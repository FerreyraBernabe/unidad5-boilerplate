import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { parseApiError } from '../../shared/api/apiError';
import Alert from '../../shared/components/Alert';
import BookingConfirmedModal from '../components/BookingConfirmedModal';
import BookingFiltersCard from '../components/BookingFiltersCard';
import BookingSummaryForm from '../components/BookingSummaryForm';
import SelectedDoctorCard from '../components/SelectedDoctorCard';
import WeeklySlotsCalendar from '../components/WeeklySlotsCalendar';
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

  const selectedDayObj =
    weekDays.find(
      (day) => day.isoDate === (selectedSlot?.date || selectedDayIso)
    ) || weekDays[0];

  const handleSelectSlot = (dayIso, slot) => {
    setSelectedDayIso(dayIso);
    setSelectedSlot(slot);
    setBookingError(null);
  };

  const handleSelectMobileDay = (dayIso) => {
    setSelectedDayIso(dayIso);
    setSelectedSlot(null);
  };

  const handleConfirmBooking = async (reason) => {
    if (!selectedSlot) {
      setBookingError({
        message: 'Seleccioná un horario disponible antes de confirmar.',
        details: [],
      });

      return false;
    }

    setBookingError(null);

    try {
      const created = await bookAppointment({
        dni: user?.dni,
        reason,
      });

      const specialtyName =
        currentDoctor?.specialty?.name ||
        created.doctor?.specialty?.name ||
        'Especialidad';

      setConfirmedBooking({
        id: created.appointmentId ?? created.id,
        doctorName: currentDoctor?.name || created.doctor?.name,
        specialtyName,
        fullDateLabel: selectedDayObj?.fullDateLabel || selectedSlot.date,
        startTime: selectedSlot.startTime,
        reason: reason.trim(),
      });

      return true;
    } catch (error) {
      setBookingError(
        parseApiError(error, 'No se pudo confirmar la reserva del turno.')
      );

      return false;
    }
  };

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <BookingFiltersCard
        specialties={specialties}
        doctors={doctors}
        selectedSpecialtyId={selectedSpecialtyId}
        onSelectSpecialty={setSelectedSpecialtyId}
        selectedDoctorId={selectedDoctorId}
        onSelectDoctor={setSelectedDoctorId}
        loadingSpecialties={loadingSpecialties}
        loadingDoctors={loadingDoctors}
        loadingSlots={loadingSlots}
        onRefreshSlots={refreshSlots}
      />

      {catalogError && <Alert variant="error" message={catalogError.message} />}

      <SelectedDoctorCard doctor={currentDoctor} />

      <WeeklySlotsCalendar
        weekOffset={weekOffset}
        weekDays={weekDays}
        weekRangeLabel={weekRangeLabel}
        onPreviousWeek={goPreviousWeek}
        onNextWeek={goNextWeek}
        slotsByDate={slotsByDate}
        selectedDayIso={selectedDayIso}
        onSelectDayIso={handleSelectMobileDay}
        selectedSlot={selectedSlot}
        onSelectSlot={handleSelectSlot}
        loadingSlots={loadingSlots}
        slotsError={slotsError}
      />

      <BookingSummaryForm
        selectedSlot={selectedSlot}
        selectedDayLabel={selectedDayObj?.fullDateLabel || selectedSlot?.date}
        currentDoctor={currentDoctor}
        bookingError={bookingError}
        onClearError={() => setBookingError(null)}
        onConfirm={handleConfirmBooking}
      />

      <BookingConfirmedModal
        booking={confirmedBooking}
        user={user}
        onClose={() => setConfirmedBooking(null)}
        onViewAppointments={() => navigate('/appointments')}
      />
    </div>
  );
}

export default PatientHome;
