import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { getDoctors } from '../../doctors/services/getDoctors';
import Alert from '../../shared/components/Alert';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import Modal from '../../shared/components/Modal';
import { parseApiError } from '../../shared/api/apiError';
import { days } from '../constants/days.js';
import {
  createAvailabilities,
  getDoctorsAvailabilities,
  updateAvailabilities,
} from '../services/availabilitiesService.js';
import AvailabilityTable from './AvailabilityTable';
import ExtraInfoCard from './ExtraInfoCard';
import SearchDoctorCard from './SearchDoctorCard';

const normalizeDay = (str = '') =>
  str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase();

export default function AddAvailabilityModal({
  onClose,
  doctors: initialDoctors = [],
  onSaved,
}) {
  const [allDoctors, setAllDoctors] = useState(initialDoctors);
  const [selectedDoctorId, setSelectedDoctorId] = useState(
    () => initialDoctors[0]?.id ?? ''
  );
  const [schedules, setSchedules] = useState(days);
  const [hasExistingRules, setHasExistingRules] = useState(false);
  const [loadingRules, setLoadingRules] = useState(false);
  const [error, setError] = useState(null);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  useEffect(() => {
    let cancelled = false;

    const loadAllDoctors = async () => {
      try {
        const result = await getDoctors({ pageIndex: 1, pageSize: 100 });

        if (!cancelled && result.data.length > 0) {
          setAllDoctors(result.data);
          setSelectedDoctorId((prev) => prev || result.data[0].id);
        }
      } catch {
        // Si falla la carga completa, se conserva el listado recibido por props.
      }
    };

    loadAllDoctors();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedDoctorId) {
      setSchedules(days);
      setHasExistingRules(false);

      return undefined;
    }

    let cancelled = false;

    const loadDoctorRules = async () => {
      setLoadingRules(true);
      setError(null);

      try {
        const existingRules = await getDoctorsAvailabilities(selectedDoctorId);

        if (cancelled) {
          return;
        }

        if (existingRules.length > 0) {
          setHasExistingRules(true);
          const mapped = days.map((d) => {
            const found = existingRules.find(
              (r) => normalizeDay(r.day) === normalizeDay(d.nombre)
            );

            if (found) {
              return {
                ...d,
                activo: true,
                entrada: found.startTime?.slice(0, 5) || d.entrada || '08:00',
                salida: found.endTime?.slice(0, 5) || d.salida || '16:00',
              };
            }

            return {
              ...d,
              activo: false,
              entrada: d.entrada || '08:00',
              salida: d.salida || '16:00',
            };
          });

          setSchedules(mapped);
        } else {
          setHasExistingRules(false);
          setSchedules(days);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            parseApiError(
              err,
              'No se pudieron cargar las disponibilidades del profesional.'
            )
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingRules(false);
        }
      }
    };

    loadDoctorRules();

    return () => {
      cancelled = true;
    };
  }, [selectedDoctorId]);

  const handleToggle = (id) => {
    setSchedules((prev) =>
      prev.map((item) => {
        if (item.id !== id) {
          return item;
        }

        return {
          ...item,
          activo: !item.activo,
          entrada: item.entrada || '08:00',
          salida: item.salida || '16:00',
        };
      })
    );
  };

  const handleTimeChange = (id, field, value) => {
    setSchedules((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const onSubmitForm = async () => {
    setError(null);

    if (!selectedDoctorId) {
      setError({ message: 'Debe seleccionar un profesional.' });

      return;
    }

    const activeDays = schedules.filter((d) => d.activo);

    if (activeDays.length === 0) {
      setError({ message: 'Debe activar al menos un día de atención.' });

      return;
    }

    for (const dayItem of activeDays) {
      if (!dayItem.entrada || !dayItem.salida) {
        setError({
          message: `Complete el horario de entrada y salida para el día ${dayItem.nombre}.`,
        });

        return;
      }

      if (dayItem.entrada >= dayItem.salida) {
        setError({
          message: `En ${dayItem.nombre}, el horario de entrada (${dayItem.entrada}) debe ser menor al de salida (${dayItem.salida}).`,
        });

        return;
      }
    }

    const payload = {
      doctorId: selectedDoctorId,
      days: activeDays.map((d) => ({
        day: d.nombre,
        startTime: d.entrada,
        endTime: d.salida,
      })),
    };

    try {
      if (hasExistingRules) {
        await updateAvailabilities(payload);
      } else {
        await createAvailabilities(payload);
      }

      if (onSaved) {
        onSaved();
      }

      onClose();
    } catch (err) {
      setError(
        parseApiError(err, 'No se pudo guardar la disponibilidad horaria.')
      );
    }
  };

  return (
    <Modal
      titleId="availability-modal-title"
      title="Gestionar Disponibilidad Horaria"
      subtitle="Defina los días y rangos horarios de atención para el profesional seleccionado."
      onClose={onClose}
      disableClose={isSubmitting}
      maxWidth="max-w-5xl"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="availability-form"
            disabled={isSubmitting || loadingRules}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Disponibilidad'}
          </Button>
        </>
      }
    >
      <form
        id="availability-form"
        onSubmit={handleSubmit(onSubmitForm)}
        className="flex flex-col gap-6 lg:flex-row"
        noValidate
      >
        <div className="flex shrink-0 flex-col gap-6 lg:w-72">
          <Card className="search-card">
            <SearchDoctorCard
              doctors={allDoctors}
              selectedDoctorId={selectedDoctorId}
              onSelectDoctor={setSelectedDoctorId}
            />
          </Card>
          <Card className="extra-info-card">
            <ExtraInfoCard />
          </Card>
        </div>

        <section className="flex flex-1 flex-col justify-between overflow-hidden rounded-xl border border-med-border bg-white">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-med-border-subtle p-4">
              <span className="text-sm font-bold text-med-primary-900">
                Configuración de Horarios
              </span>
              <div className="flex items-center gap-3">
                <span className="rounded-2xl bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  • {hasExistingRules ? 'Editar Horario' : 'Horario Regular'}
                </span>
                <span className="text-xs text-gray-500">
                  Intervalos de 30 minutos
                </span>
              </div>
            </div>

            {error && (
              <div className="mx-4 mt-4">
                <Alert
                  variant="error"
                  message={error.message}
                  details={error.details}
                  onClose={() => setError(null)}
                />
              </div>
            )}

            {loadingRules ? (
              <div className="p-8 text-center text-sm text-med-text-muted">
                Cargando horarios del profesional...
              </div>
            ) : (
              <AvailabilityTable
                schedules={schedules}
                onToggle={handleToggle}
                onTimeChange={handleTimeChange}
              />
            )}
          </div>
        </section>
      </form>
    </Modal>
  );
}
