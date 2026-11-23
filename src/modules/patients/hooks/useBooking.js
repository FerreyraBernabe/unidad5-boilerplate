import { useCallback, useEffect, useMemo, useState } from 'react';
import { getSpecialties } from '../../specialties/services/getSpecialties';
import { getDoctors } from '../../doctors/services/getDoctors';
import { getDoctorSlots } from '../../availabilities/services/availabilitiesService';
import { createAppointment } from '../../appointments/services/getAppointments';
import { parseApiError } from '../../shared/api/apiError';
import {
  buildWeekDays,
  formatWeekRangeLabel,
  isSlotInPast,
} from '../helpers/weekCalendar';

export function useBooking() {
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedSpecialtyId, setSelectedSpecialtyId] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState('');
  const [weekOffset, setWeekOffset] = useState(0);
  const [slots, setSlots] = useState([]);
  const [selectedDayIso, setSelectedDayIso] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [loadingSpecialties, setLoadingSpecialties] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [catalogError, setCatalogError] = useState(null);
  const [slotsError, setSlotsError] = useState(null);
  const [slotsReloadKey, setSlotsReloadKey] = useState(0);

  const weekDays = useMemo(() => buildWeekDays(weekOffset), [weekOffset]);
  const weekRangeLabel = useMemo(
    () => formatWeekRangeLabel(weekDays),
    [weekDays]
  );

  useEffect(() => {
    let cancelled = false;

    const loadSpecialties = async () => {
      setLoadingSpecialties(true);
      setCatalogError(null);

      try {
        const result = await getSpecialties({ pageIndex: 1, pageSize: 100 });

        if (!cancelled) {
          setSpecialties(result.data);

          if (result.data.length > 0) {
            setSelectedSpecialtyId(String(result.data[0].id));
          }
        }
      } catch (err) {
        if (!cancelled) {
          setCatalogError(
            parseApiError(
              err,
              'No se pudieron cargar las especialidades disponibles.'
            )
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingSpecialties(false);
        }
      }
    };

    loadSpecialties();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!selectedSpecialtyId) {
      setDoctors([]);
      setSelectedDoctorId('');

      return undefined;
    }

    let cancelled = false;

    const loadDoctors = async () => {
      setLoadingDoctors(true);
      setCatalogError(null);

      try {
        const result = await getDoctors({
          specialtyId: selectedSpecialtyId,
          pageIndex: 1,
          pageSize: 100,
        });

        if (cancelled) {
          return;
        }

        setDoctors(result.data);
        setSelectedDoctorId(
          result.data.length > 0 ? String(result.data[0].id) : ''
        );
      } catch (err) {
        if (!cancelled) {
          setCatalogError(
            parseApiError(
              err,
              'No se pudieron cargar los médicos de la especialidad.'
            )
          );
          setDoctors([]);
          setSelectedDoctorId('');
        }
      } finally {
        if (!cancelled) {
          setLoadingDoctors(false);
        }
      }
    };

    loadDoctors();

    return () => {
      cancelled = true;
    };
  }, [selectedSpecialtyId]);

  useEffect(() => {
    if (weekDays.length > 0) {
      setSelectedDayIso((prev) => {
        const stillInWeek = weekDays.some((d) => d.isoDate === prev);

        return stillInWeek ? prev : weekDays[0].isoDate;
      });
    }
  }, [weekDays]);

  useEffect(() => {
    if (!selectedDoctorId || weekDays.length === 0) {
      setSlots([]);
      setSelectedSlot(null);

      return undefined;
    }

    let cancelled = false;

    const loadSlots = async () => {
      setLoadingSlots(true);
      setSlotsError(null);
      setSelectedSlot(null);

      try {
        const from = weekDays[0].isoDate;
        const to = weekDays[weekDays.length - 1].isoDate;
        const rawSlots = await getDoctorSlots(selectedDoctorId, { from, to });

        if (cancelled) {
          return;
        }

        const availableFutureSlots = rawSlots.filter(
          (slot) =>
            slot.status === 'AVAILABLE' &&
            !isSlotInPast(slot.date, slot.startTime)
        );

        setSlots(availableFutureSlots);
      } catch (err) {
        if (!cancelled) {
          setSlots([]);
          setSlotsError(
            parseApiError(
              err,
              'No se pudo obtener la disponibilidad de horarios del profesional.'
            )
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingSlots(false);
        }
      }
    };

    loadSlots();

    return () => {
      cancelled = true;
    };
  }, [selectedDoctorId, weekDays, slotsReloadKey]);

  const slotsByDate = useMemo(() => {
    const map = {};

    for (const day of weekDays) {
      map[day.isoDate] = [];
    }

    for (const slot of slots) {
      if (map[slot.date]) {
        map[slot.date].push(slot);
      }
    }

    for (const key of Object.keys(map)) {
      map[key].sort((a, b) => a.startTime.localeCompare(b.startTime));
    }

    return map;
  }, [slots, weekDays]);

  const refreshSlots = useCallback(() => {
    setSlotsReloadKey((prev) => prev + 1);
  }, []);

  const goPreviousWeek = useCallback(() => {
    setWeekOffset((prev) => Math.max(0, prev - 1));
  }, []);

  const goNextWeek = useCallback(() => {
    setWeekOffset((prev) => prev + 1);
  }, []);

  const currentDoctor = useMemo(
    () =>
      doctors.find((doc) => String(doc.id) === String(selectedDoctorId)) ||
      null,
    [doctors, selectedDoctorId]
  );

  const bookAppointment = async ({ dni, reason }) => {
    if (!selectedDoctorId || !selectedSlot) {
      throw new Error('Seleccioná un médico y un horario disponible.');
    }

    try {
      const created = await createAppointment({
        doctorId: selectedDoctorId,
        availabilityId: selectedSlot.id,
        dni,
        reason,
      });

      refreshSlots();

      return created;
    } catch (error) {
      if (error?.response?.status === 409) {
        refreshSlots();
      }

      throw error;
    }
  };

  return {
    specialties,
    doctors,
    selectedSpecialtyId,
    setSelectedSpecialtyId,
    selectedDoctorId,
    setSelectedDoctorId,
    currentDoctor,
    weekOffset,
    weekDays,
    weekRangeLabel,
    goPreviousWeek,
    goNextWeek,
    slotsByDate,
    selectedDayIso,
    setSelectedDayIso,
    selectedSlot,
    setSelectedSlot,
    loadingSpecialties,
    loadingDoctors,
    loadingSlots,
    catalogError,
    slotsError,
    refreshSlots,
    bookAppointment,
  };
}
