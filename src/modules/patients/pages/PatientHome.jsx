import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import { useAuth } from '../../auth/hooks/useAuth';
import { parseApiError } from '../../shared/api/apiError';
import { useBooking } from '../hooks/useBooking';

function PatientHome() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookingError, setBookingError] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const {
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
  } = useBooking();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { reason: '' },
    mode: 'onBlur',
  });

  useEffect(() => {
    if (!confirmedBooking) {
      return undefined;
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setConfirmedBooking(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [confirmedBooking]);

  const selectedDayObj =
    weekDays.find(
      (day) => day.isoDate === (selectedSlot?.date || selectedDayIso)
    ) || weekDays[0];

  const handleSelectSlot = (dayIso, slot) => {
    setSelectedDayIso(dayIso);
    setSelectedSlot(slot);
    setBookingError(null);
  };

  const onConfirmValid = async (formData) => {
    if (!selectedSlot) {
      setBookingError({
        message: 'Seleccioná un horario disponible antes de confirmar.',
        details: [],
      });

      return;
    }

    setBookingError(null);

    try {
      const created = await bookAppointment({
        dni: user?.dni,
        reason: formData.reason,
      });

      const specialtyName =
        currentDoctor?.specialty?.name ||
        created.doctor?.specialty?.name ||
        'Especialidad';

      setConfirmedBooking({
        id: created.appointmentId,
        doctorName: currentDoctor?.name || created.doctor?.name,
        specialtyName,
        fullDateLabel: selectedDayObj?.fullDateLabel || selectedSlot.date,
        startTime: selectedSlot.startTime,
        reason: formData.reason.trim(),
      });
      reset();
    } catch (error) {
      setBookingError(
        parseApiError(error, 'No se pudo confirmar la reserva del turno.')
      );
    }
  };

  const mobileDaySlots = slotsByDate[selectedDayIso] || [];

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <Card className="p-5 sm:p-7">
        <div className="mb-5">
          <h1 className="text-2xl font-bold tracking-tight text-med-primary-900 sm:text-3xl">
            Reservar Turno Médico
          </h1>
          <p className="mt-1 text-xs text-med-text-sub sm:text-sm">
            Seleccione la especialidad y el profesional para consultar horarios
            disponibles.
          </p>
        </div>

        <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-12">
          <div className="flex flex-col gap-1.5 md:col-span-5">
            <label
              htmlFor="booking-specialty"
              className="text-xs font-semibold text-med-text-sub"
            >
              Seleccionar Especialidad
            </label>
            <select
              id="booking-specialty"
              value={selectedSpecialtyId}
              disabled={loadingSpecialties}
              onChange={(event) => setSelectedSpecialtyId(event.target.value)}
              className="w-full cursor-pointer rounded-lg border border-med-border bg-white px-3.5 py-2.5 text-sm text-med-text-main focus:outline-none focus:ring-2 focus:ring-med-primary-600 disabled:bg-gray-50"
            >
              {loadingSpecialties ? (
                <option value="">Cargando especialidades...</option>
              ) : specialties.length === 0 ? (
                <option value="">Sin especialidades activas</option>
              ) : (
                specialties.map((spec) => (
                  <option key={spec.id} value={spec.id}>
                    {spec.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="flex flex-col gap-1.5 md:col-span-4">
            <label
              htmlFor="booking-doctor"
              className="text-xs font-semibold text-med-text-sub"
            >
              Seleccionar Doctor
            </label>
            <select
              id="booking-doctor"
              value={selectedDoctorId}
              disabled={loadingDoctors || doctors.length === 0}
              onChange={(event) => setSelectedDoctorId(event.target.value)}
              className="w-full cursor-pointer rounded-lg border border-med-border bg-white px-3.5 py-2.5 text-sm text-med-text-main focus:outline-none focus:ring-2 focus:ring-med-primary-600 disabled:bg-gray-50"
            >
              {loadingDoctors ? (
                <option value="">Cargando doctores...</option>
              ) : doctors.length === 0 ? (
                <option value="">Sin doctores disponibles</option>
              ) : (
                doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="md:col-span-3">
            <Button
              type="button"
              disabled={!selectedDoctorId || loadingSlots}
              className="flex w-full items-center justify-center gap-2 py-2.5 disabled:opacity-60"
              onClick={refreshSlots}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span>
                {loadingSlots ? 'Buscando...' : 'Buscar Disponibilidad'}
              </span>
            </Button>
          </div>
        </div>
      </Card>

      {catalogError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {catalogError.message}
        </div>
      )}

      {currentDoctor && (
        <Card className="flex items-center gap-4 border-med-border p-5 sm:p-6">
          <div className="relative shrink-0">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-med-primary-200 bg-med-primary-100 text-lg font-bold text-med-primary-900 sm:h-16 sm:w-16">
              {currentDoctor.name?.slice(0, 2).toUpperCase()}
            </div>
            <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base font-bold text-med-primary-900 sm:text-lg">
                {currentDoctor.name}
              </h2>
              <span className="inline-block rounded bg-med-primary-100 px-2 py-0.5 text-[11px] font-semibold text-med-primary-700">
                Profesional Activo
              </span>
            </div>
            <p className="mt-0.5 text-xs font-semibold text-med-primary-700 sm:text-sm">
              {currentDoctor.specialty?.name || 'Sin especialidad'}
            </p>
            {currentDoctor.licenseNumber && (
              <p className="mt-0.5 text-xs text-med-text-muted">
                Matrícula: {currentDoctor.licenseNumber}
              </p>
            )}
          </div>
        </Card>
      )}

      <Card className="border-med-border p-5 sm:p-6">
        <div className="flex flex-col justify-between gap-3 border-b border-med-border-subtle pb-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Semana anterior"
              disabled={weekOffset === 0}
              onClick={goPreviousWeek}
              className="rounded-md border border-med-border px-2 py-1 text-med-text-sub transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ‹
            </button>
            <span className="text-sm font-bold text-med-primary-900 sm:text-base">
              {weekRangeLabel}
            </span>
            <button
              type="button"
              aria-label="Semana siguiente"
              onClick={goNextWeek}
              className="rounded-md border border-med-border px-2 py-1 text-med-text-sub transition hover:bg-gray-50"
            >
              ›
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs text-med-text-sub">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-med-primary-900" />
              Disponible
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Seleccionado
            </span>
          </div>
        </div>

        {slotsError && (
          <div
            role="alert"
            className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
          >
            {slotsError.message}
          </div>
        )}

        {loadingSlots ? (
          <div className="py-12 text-center text-sm text-med-text-muted">
            Consultando horarios disponibles...
          </div>
        ) : (
          <>
            {/* Vista Desktop: grilla semanal */}
            <div className="hidden gap-2.5 pt-5 sm:grid sm:grid-cols-7">
              {weekDays.map((day) => {
                const daySlots = slotsByDate[day.isoDate] || [];

                return (
                  <div
                    key={day.isoDate}
                    className="flex flex-col items-center gap-3"
                  >
                    <div className="text-center">
                      <span className="text-[11px] font-bold uppercase text-med-text-sub">
                        {day.dayShort}
                      </span>
                      <p className="text-lg font-bold leading-tight text-med-primary-900">
                        {day.dayNumber}
                      </p>
                      <span className="text-[10px] uppercase text-med-text-muted">
                        {day.monthShort}
                      </span>
                    </div>

                    <div className="flex w-full flex-col gap-2">
                      {daySlots.length > 0 ? (
                        daySlots.map((slot) => {
                          const isSelected = selectedSlot?.id === slot.id;

                          return (
                            <button
                              key={slot.id}
                              type="button"
                              onClick={() =>
                                handleSelectSlot(day.isoDate, slot)
                              }
                              className={`w-full rounded-lg border px-2 py-2 text-center text-xs font-semibold transition-all ${
                                isSelected
                                  ? 'border-emerald-500 bg-emerald-500 text-white shadow-sm'
                                  : 'border-med-border bg-white text-med-primary-900 hover:border-med-primary-600 hover:bg-med-primary-50/50'
                              }`}
                            >
                              {slot.startTime}
                            </button>
                          );
                        })
                      ) : (
                        <div className="flex h-32 items-center justify-center rounded-lg bg-slate-50 p-2 text-center">
                          <p className="text-[11px] leading-relaxed text-med-text-muted">
                            Sin disponibilidad
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Vista Mobile (>= 6 pulgadas) */}
            <div className="block space-y-4 pt-4 sm:hidden">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-bold text-med-text-main">
                    Seleccionar Día
                  </span>
                  <span className="text-[11px] text-med-text-muted">
                    Deslizá para ver la semana
                  </span>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {weekDays.map((day) => {
                    const isActive = selectedDayIso === day.isoDate;

                    return (
                      <button
                        key={day.isoDate}
                        type="button"
                        onClick={() => {
                          setSelectedDayIso(day.isoDate);
                          setSelectedSlot(null);
                        }}
                        className={`min-w-[66px] flex-1 rounded-xl border px-2 py-2.5 text-center transition-all ${
                          isActive
                            ? 'border-med-primary-900 bg-med-primary-900 text-white shadow-sm'
                            : 'border-med-border bg-white text-med-text-main hover:bg-gray-50'
                        }`}
                      >
                        <span
                          className={`block text-[10px] font-bold uppercase ${
                            isActive ? 'text-white/80' : 'text-med-text-sub'
                          }`}
                        >
                          {day.dayShort}
                        </span>
                        <span className="my-0.5 block text-base font-extrabold">
                          {day.dayNumber}
                        </span>
                        <span
                          className={`block text-[10px] uppercase ${
                            isActive ? 'text-white/80' : 'text-med-text-muted'
                          }`}
                        >
                          {day.monthShort}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <span className="mb-2.5 block text-xs font-bold text-med-text-sub">
                  Horarios disponibles (Bloques de 30 min)
                </span>

                {mobileDaySlots.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {mobileDaySlots.map((slot) => {
                      const isSelected = selectedSlot?.id === slot.id;

                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => handleSelectSlot(selectedDayIso, slot)}
                          className={`rounded-lg border px-2 py-2 text-xs font-semibold transition-all ${
                            isSelected
                              ? 'border-2 border-emerald-500 bg-emerald-50 font-bold text-emerald-800 shadow-xs'
                              : 'border-med-border bg-white text-med-text-main hover:bg-gray-50'
                          }`}
                        >
                          {slot.startTime} hs
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-xl border border-med-border bg-gray-50 p-6 text-center">
                    <p className="text-xs text-med-text-muted">
                      Sin disponibilidad para el día seleccionado.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Resumen de selección + Motivo obligatorio (reason) + Confirmar */}
      <form
        onSubmit={handleSubmit(onConfirmValid)}
        className="flex flex-col gap-4 rounded-2xl border border-med-primary-200/70 bg-med-primary-50 p-5 sm:p-6"
        noValidate
      >
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="border-l-4 border-med-primary-900 pl-3.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-med-text-sub">
              Resumen de Selección
            </span>
            {selectedSlot ? (
              <>
                <p className="mt-0.5 text-base font-bold text-med-primary-900 sm:text-lg">
                  {selectedDayObj?.fullDateLabel}, {selectedSlot.startTime} hs
                </p>
                <p className="mt-0.5 text-xs text-med-text-sub">
                  {currentDoctor?.name} • {currentDoctor?.specialty?.name} •
                  Duración: 30 min
                </p>
              </>
            ) : (
              <p className="mt-1 text-sm text-med-text-sub">
                Seleccioná un horario disponible en el calendario para reservar
                tu turno.
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={!selectedSlot || isSubmitting}
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm shadow-md disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span>{isSubmitting ? 'Confirmando...' : 'Confirmar Turno'}</span>
          </Button>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="appointment-reason"
            className="text-xs font-semibold text-med-primary-900"
          >
            Motivo de la consulta (obligatorio, mínimo 5 caracteres)
          </label>
          <textarea
            id="appointment-reason"
            rows={2}
            placeholder="Ej: Control anual de presión arterial y revisión de estudios"
            className={`w-full rounded-lg border bg-white px-3.5 py-2 text-sm text-med-text-main placeholder-med-text-muted focus:border-transparent focus:outline-none focus:ring-2 focus:ring-med-primary-600 ${
              errors.reason
                ? 'border-red-400 bg-red-50/20'
                : 'border-med-border'
            }`}
            {...register('reason', {
              required: 'El motivo de la consulta es obligatorio',
              validate: (value) => {
                const len = value.trim().length;

                if (len < 5) {
                  return 'El motivo debe tener al menos 5 caracteres';
                }

                if (len > 300) {
                  return 'El motivo no puede superar los 300 caracteres';
                }

                return true;
              },
            })}
          />
          {errors.reason && (
            <p className="text-xs font-medium text-red-500">
              {errors.reason.message}
            </p>
          )}
        </div>

        {bookingError && (
          <div
            role="alert"
            className="flex items-start justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs text-red-700"
          >
            <div>
              <p className="font-medium">{bookingError.message}</p>
              {bookingError.details?.length > 0 && (
                <ul className="mt-1 list-disc pl-4">
                  {bookingError.details.map((item, idx) => (
                    <li key={idx}>
                      {item.field ? `${item.field}: ` : ''}
                      {item.issue}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              type="button"
              aria-label="Cerrar error"
              onClick={() => setBookingError(null)}
              className="font-bold opacity-70 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        )}
      </form>

      {confirmedBooking && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setConfirmedBooking(null);
            }
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4"
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirmed-booking-title"
            className="flex w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
          >
            <header className="border-b border-med-border bg-med-primary-50/60 px-6 py-4">
              <h2
                id="confirmed-booking-title"
                className="text-lg font-bold text-med-primary-900"
              >
                ¡Turno Confirmado con Éxito!
              </h2>
            </header>

            <div className="space-y-4 px-6 py-5">
              <p className="text-sm text-med-text-sub">
                Tu turno con{' '}
                <strong className="text-med-text-main">
                  {confirmedBooking.doctorName}
                </strong>{' '}
                quedó registrado para el{' '}
                <strong className="text-med-text-main">
                  {confirmedBooking.fullDateLabel} a las{' '}
                  {confirmedBooking.startTime} hs
                </strong>
                .
              </p>

              <div className="space-y-1.5 rounded-xl border border-med-primary-200/70 bg-med-primary-50 p-3.5 text-xs text-med-primary-900">
                <p>
                  <strong>Especialidad:</strong>{' '}
                  {confirmedBooking.specialtyName}
                </p>
                <p>
                  <strong>Paciente:</strong> {user?.email}{' '}
                  {user?.dni ? `(DNI: ${user.dni})` : ''}
                </p>
                <p>
                  <strong>Motivo:</strong> {confirmedBooking.reason}
                </p>
              </div>
            </div>

            <footer className="flex flex-col-reverse gap-2.5 border-t border-med-border bg-med-primary-50/40 px-6 py-4 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setConfirmedBooking(null)}
              >
                Reservar Otro
              </Button>
              <Button type="button" onClick={() => navigate('/appointments')}>
                Ver Mis Turnos
              </Button>
            </footer>
          </section>
        </div>
      )}
    </div>
  );
}

export default PatientHome;
