import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import { useSpecialties } from '../../specialties/hooks/useSpecialties';
import { useDoctors } from '../../doctors/hooks/useDoctors';
import { useDoctorSlots } from '../../appointments/hooks/useDoctorSlots';
import WeekSlotsPicker from '../components/WeekSlotsPicker';
import BookingConfirmModal from '../components/BookingConfirmModal';
import { getPatientDni } from '../helpers/session';

const selectClass =
  'w-full appearance-none px-3.5 py-2.5 text-sm bg-white border border-med-border rounded-lg text-med-text-main focus:outline-none focus:ring-2 focus:ring-med-primary-600 pr-10 cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-med-text-muted';

// El backend no filtra doctores por especialidad: se filtra acá.
const belongsToSpecialty = (doctor, specialty) => {
  if (!specialty) {
    return false;
  }

  const doctorSpecialty = doctor.specialty ?? doctor.speciality;
  const doctorSpecialtyId = doctorSpecialty?.specialtyId ?? doctorSpecialty?.id;

  if (doctorSpecialtyId && doctorSpecialtyId === specialty.id) {
    return true;
  }

  return (
    Boolean(doctorSpecialty?.name) &&
    doctorSpecialty.name.toLowerCase() === specialty.name?.toLowerCase()
  );
};

function PatientHome() {
  const navigate = useNavigate();
  const dni = getPatientDni();

  // Selección de filtros
  const [specialtyId, setSpecialtyId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  // Doctor cuya disponibilidad se está mostrando (se fija al apretar "Buscar Disponibilidad")
  const [searchedDoctorId, setSearchedDoctorId] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  // Copia del turno elegido mientras el modal de confirmación está abierto
  const [bookingSlot, setBookingSlot] = useState(null);

  const {
    specialties,
    loading: loadingSpecialties,
    error: specialtiesError,
  } = useSpecialties({ initialPageSize: 100 });

  const {
    doctors,
    loading: loadingDoctors,
    error: doctorsError,
  } = useDoctors({ initialPageSize: 100 });

  const {
    slotsByDate,
    loading: loadingSlots,
    error: slotsError,
    refetch: refetchSlots,
  } = useDoctorSlots(searchedDoctorId);

  const selectedSpecialty = specialties.find((item) => item.id === specialtyId);
  const doctorsOfSpecialty = doctors.filter((doc) =>
    belongsToSpecialty(doc, selectedSpecialty)
  );
  const selectedDoctor = doctorsOfSpecialty.find((doc) => doc.id === doctorId);
  const specialtyName =
    selectedDoctor?.specialty?.name ?? selectedDoctor?.speciality?.name ?? '';

  const handleSpecialtyChange = (value) => {
    setSpecialtyId(value);
    setDoctorId('');
    setSearchedDoctorId('');
    setSelectedSlot(null);
  };

  const handleDoctorChange = (value) => {
    setDoctorId(value);
    setSearchedDoctorId('');
    setSelectedSlot(null);
  };

  const handleSearch = () => {
    if (!doctorId) {
      return;
    }

    setSelectedSlot(null);

    if (searchedDoctorId === doctorId) {
      refetchSlots();
    } else {
      setSearchedDoctorId(doctorId);
    }
  };

  // Después de reservar (o de perder el horario) se refresca la grilla.
  const refreshAfterBooking = () => {
    setSelectedSlot(null);
    refetchSlots();
  };

  const handleCloseModal = () => {
    setBookingSlot(null);
  };

  const showPicker = Boolean(searchedDoctorId) && !loadingSlots && !slotsError;

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* 1. Selector de Especialidad y Doctor */}
      <Card className="p-6 sm:p-7">
        <div className="mb-5">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-primary-900">
            Reservar Turno Médico
          </h1>
          <p className="text-xs sm:text-sm text-med-text-sub mt-1">
            Seleccione la especialidad y el profesional para continuar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* Especialidad */}
          <div className="md:col-span-5 flex flex-col gap-1.5">
            <label
              htmlFor="booking-specialty"
              className="text-xs font-semibold text-med-text-sub"
            >
              Seleccionar Especialidad
            </label>
            <div className="relative">
              <select
                id="booking-specialty"
                value={specialtyId}
                disabled={loadingSpecialties}
                onChange={(e) => handleSpecialtyChange(e.target.value)}
                className={selectClass}
              >
                <option value="">
                  {loadingSpecialties
                    ? 'Cargando especialidades...'
                    : 'Seleccione una especialidad'}
                </option>
                {specialties.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-med-text-muted">
                ▼
              </span>
            </div>
            {specialtiesError && (
              <p role="alert" className="text-xs font-medium text-red-500">
                {specialtiesError.message}
              </p>
            )}
          </div>

          {/* Doctor */}
          <div className="md:col-span-4 flex flex-col gap-1.5">
            <label
              htmlFor="booking-doctor"
              className="text-xs font-semibold text-med-text-sub"
            >
              Seleccionar Doctor
            </label>
            <div className="relative">
              <select
                id="booking-doctor"
                value={doctorId}
                disabled={!specialtyId || loadingDoctors}
                onChange={(e) => handleDoctorChange(e.target.value)}
                className={selectClass}
              >
                <option value="">
                  {!specialtyId
                    ? 'Primero elija una especialidad'
                    : loadingDoctors
                      ? 'Cargando doctores...'
                      : doctorsOfSpecialty.length === 0
                        ? 'Sin doctores para esta especialidad'
                        : 'Seleccione un doctor'}
                </option>
                {doctorsOfSpecialty.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name}
                  </option>
                ))}
              </select>
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-med-text-muted">
                ▼
              </span>
            </div>
            {doctorsError && (
              <p role="alert" className="text-xs font-medium text-red-500">
                {doctorsError.message}
              </p>
            )}
          </div>

          {/* Botón Buscar Disponibilidad */}
          <div className="md:col-span-3">
            <Button
              type="button"
              disabled={!doctorId || loadingSlots}
              onClick={handleSearch}
              className="w-full flex items-center justify-center gap-2 bg-med-primary-900 hover:bg-med-primary-800 text-white font-medium py-2.5 rounded-lg shadow-sm disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
                />
              </svg>
              <span>
                {loadingSlots ? 'Buscando...' : 'Buscar Disponibilidad'}
              </span>
            </Button>
          </div>
        </div>
      </Card>

      {/* 2. Información del doctor seleccionado */}
      {selectedDoctor && (
        <Card className="p-5 sm:p-6 flex items-center gap-4 border-med-border">
          <div className="w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-2xl bg-med-primary-100 flex items-center justify-center text-3xl border border-med-primary-200">
            👨‍⚕️
          </div>

          <div className="overflow-hidden">
            <h2 className="text-base sm:text-lg font-bold text-med-primary-900">
              {selectedDoctor.name}
            </h2>
            {specialtyName && (
              <p className="text-xs sm:text-sm font-semibold text-med-primary-700 mt-0.5">
                {specialtyName}
              </p>
            )}
            {selectedDoctor.licenseNumber && (
              <p className="text-xs text-med-text-muted mt-0.5 truncate">
                Matrícula: {selectedDoctor.licenseNumber}
              </p>
            )}
          </div>
        </Card>
      )}

      {/* 3. Disponibilidad */}
      {loadingSlots && (
        <Card className="p-8 text-center text-sm text-med-text-muted">
          Buscando turnos disponibles...
        </Card>
      )}

      {slotsError && (
        <Card className="p-6 border-red-200 bg-red-50">
          <p role="alert" className="text-sm text-red-700">
            {slotsError.message}
          </p>
          <Button
            variant="outline"
            className="mt-3 text-xs"
            onClick={refetchSlots}
          >
            Reintentar
          </Button>
        </Card>
      )}

      {showPicker && (
        <>
          <WeekSlotsPicker
            slotsByDate={slotsByDate}
            selectedSlot={selectedSlot}
            onSelectSlot={setSelectedSlot}
          />

          {/* 4. Resumen de selección y confirmación */}
          <div className="bg-med-primary-50 border border-med-primary-200/60 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="border-l-4 border-med-primary-900 pl-3.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-med-text-sub">
                Resumen de Selección
              </span>
              {selectedSlot ? (
                <>
                  <p className="text-base sm:text-lg font-bold text-med-primary-900 mt-0.5 flex items-center gap-2">
                    <span>📅</span>
                    <span>
                      {selectedSlot.fullDate}, {selectedSlot.time} HS
                    </span>
                  </p>
                  <p className="text-xs text-med-text-sub mt-0.5">
                    {selectedDoctor?.name} • Duración: 30 min
                  </p>
                </>
              ) : (
                <p className="text-sm text-med-text-sub mt-1">
                  Elegí un horario disponible para continuar.
                </p>
              )}
            </div>

            <Button
              type="button"
              disabled={!selectedSlot}
              onClick={() => setBookingSlot(selectedSlot)}
              className="flex items-center justify-center gap-2 bg-med-primary-900 hover:bg-med-primary-800 text-white font-medium py-3 px-6 rounded-xl shadow-md text-sm shrink-0 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span>Confirmar Turno</span>
              <svg
                className="w-5 h-5 text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </Button>
          </div>
        </>
      )}

      {/* Modal: motivo + confirmación + resultado */}
      {bookingSlot && selectedDoctor && (
        <BookingConfirmModal
          doctor={{
            id: selectedDoctor.id,
            name: selectedDoctor.name,
            specialtyName,
          }}
          slot={bookingSlot}
          dni={dni}
          onClose={handleCloseModal}
          onBooked={refreshAfterBooking}
          onConflict={refreshAfterBooking}
          onGoToAppointments={() => navigate('/appointments')}
        />
      )}
    </div>
  );
}

export default PatientHome;
