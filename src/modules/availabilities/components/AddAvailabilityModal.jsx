import { useEffect, useState } from 'react';
import Card from '../../shared/components/Card';
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
  doctors = [],
  onSaved,
}) {
  const [selectedDoctorId, setSelectedDoctorId] = useState(
    () => doctors[0]?.id ?? ''
  );
  const [schedules, setSchedules] = useState(days);
  const [hasExistingRules, setHasExistingRules] = useState(false);
  const [loadingRules, setLoadingRules] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedDoctorId && doctors.length > 0) {
      setSelectedDoctorId(doctors[0].id);
    }
  }, [doctors, selectedDoctorId]);

  useEffect(() => {
    if (!selectedDoctorId) {
      setSchedules(days);
      setHasExistingRules(false);
      return;
    }

    let cancelled = false;

    const loadDoctorRules = async () => {
      setLoadingRules(true);
      setError(null);

      try {
        const existingRules = await getDoctorsAvailabilities(selectedDoctorId);

        if (cancelled) return;

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
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              activo: !item.activo,
              entrada: item.entrada || '08:00',
              salida: item.salida || '16:00',
            }
          : item
      )
    );
  };

  const handleTimeChange = (id, field, value) => {
    setSchedules((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSave = async () => {
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

    setIsSubmitting(true);

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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        if (!isSubmitting && e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="availability-modal-title"
        className="flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-med-bg shadow-xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-med-border-subtle bg-white px-5 py-5 sm:px-7">
          <div>
            <h2
              id="availability-modal-title"
              className="text-xl font-bold tracking-tight text-med-primary-900 sm:text-2xl"
            >
              Gestionar Disponibilidad Horaria
            </h2>
            <p className="mt-1 text-sm leading-6 text-med-text-sub">
              Defina los días y rangos horarios de atención para el profesional
              seleccionado.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Cerrar modal"
            className="shrink-0 rounded-lg p-2 text-med-text-muted transition hover:bg-med-primary-50 hover:text-med-primary-900 disabled:opacity-40"
          >
            ✕
          </button>
        </header>

        <div className="flex flex-1 flex-col lg:flex-row gap-6 p-6 overflow-y-auto">
          <div className="flex flex-col gap-6 lg:w-72 shrink-0">
            <Card className="search-card">
              <SearchDoctorCard
                doctors={doctors}
                selectedDoctorId={selectedDoctorId}
                onSelectDoctor={setSelectedDoctorId}
              />
            </Card>
            <Card className="extra-info-card">
              <ExtraInfoCard />
            </Card>
          </div>

          <section className="flex-1 bg-white border border-med-border rounded-xl flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2 p-4 border-b border-med-border-subtle">
                <span className="font-bold text-med-primary-900 text-sm">
                  Configuración de Horarios
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs bg-emerald-100 rounded-2xl px-2.5 py-1 text-emerald-700 font-semibold">
                    • {hasExistingRules ? 'Editar Horario' : 'Horario Regular'}
                  </span>
                  <span className="text-xs text-gray-500">
                    Intervalos de 30 minutos
                  </span>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="mx-4 mt-4 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-700"
                >
                  <p className="font-medium">{error.message}</p>
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

            <section className="flex flex-row gap-2.5 justify-end p-4 border-t border-med-border bg-med-primary-50/40">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="border border-med-border rounded-lg bg-white px-4 py-2 text-xs font-semibold text-med-text-main hover:bg-gray-50 disabled:opacity-40 transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSubmitting || loadingRules}
                className="rounded-lg bg-med-primary-900 hover:bg-med-primary-800 text-white px-4 py-2 text-xs font-semibold disabled:opacity-40 transition"
              >
                {isSubmitting ? 'Guardando...' : 'Guardar Disponibilidad'}
              </button>
            </section>
          </section>
        </div>
      </section>
    </div>
  );
}
