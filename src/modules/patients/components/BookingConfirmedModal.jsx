import Button from '../../shared/components/Button';
import Modal from '../../shared/components/Modal';

export default function BookingConfirmedModal({
  booking,
  user,
  onClose,
  onViewAppointments,
}) {
  if (!booking) {
    return null;
  }

  return (
    <Modal
      titleId="confirmed-booking-title"
      title="¡Turno Confirmado con Éxito!"
      onClose={onClose}
      maxWidth="max-w-md"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Reservar Otro
          </Button>
          <Button type="button" onClick={onViewAppointments}>
            Ver Mis Turnos
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-med-text-sub">
          Tu turno con{' '}
          <strong className="text-med-text-main">{booking.doctorName}</strong>{' '}
          quedó registrado para el{' '}
          <strong className="text-med-text-main">
            {booking.fullDateLabel} a las {booking.startTime} hs
          </strong>
          .
        </p>

        <div className="space-y-1.5 rounded-xl border border-med-primary-200/70 bg-med-primary-50 p-3.5 text-xs text-med-primary-900">
          <p>
            <strong>Especialidad:</strong> {booking.specialtyName}
          </p>
          <p>
            <strong>Paciente:</strong> {user?.email}{' '}
            {user?.dni ? `(DNI: ${user.dni})` : ''}
          </p>
          <p>
            <strong>Motivo:</strong> {booking.reason}
          </p>
        </div>
      </div>
    </Modal>
  );
}
