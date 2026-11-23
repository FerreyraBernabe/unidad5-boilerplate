import Button from '../../shared/components/Button';
import Modal from '../../shared/components/Modal';
import { formatDate, formatTime } from '../helpers/appointments';
import StatusBadge from './StatusBadge';

function Field({ label, children }) {
  return (
    <div>
      <dt className="text-[10px] font-bold uppercase tracking-wider text-med-text-sub">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm text-med-text-main">{children}</dd>
    </div>
  );
}

export default function AppointmentDetailModal({ appointment, onClose }) {
  const status = appointment.appointmentStatus ?? appointment.status;
  const patientName =
    appointment.patient?.name ||
    appointment.patientName ||
    'Paciente registrado';
  const patientDni = appointment.patient?.dni ?? appointment.patientDni ?? '-';
  const doctorName = appointment.doctor?.name ?? appointment.doctorName ?? '-';
  const specialtyName =
    appointment.doctor?.specialty?.name ??
    appointment.specialityName ??
    'Sin especialidad';

  return (
    <Modal
      titleId="appointment-detail-title"
      title="Detalle de la cita"
      headerRight={<StatusBadge status={status} />}
      onClose={onClose}
      footer={
        <Button variant="outline" onClick={onClose}>
          Cerrar
        </Button>
      }
    >
      <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Paciente">{patientName}</Field>
        <Field label="DNI">{patientDni}</Field>
        <Field label="Doctor">{doctorName}</Field>
        <Field label="Especialidad">{specialtyName}</Field>
        <Field label="Fecha">{formatDate(appointment.date)}</Field>
        <Field label="Hora">{formatTime(appointment.startTime)} HS</Field>
      </dl>

      <div className="mt-4">
        <Field label="Motivo de la consulta">
          <p className="whitespace-pre-wrap break-words">
            {appointment.reason || 'Sin motivo registrado.'}
          </p>
        </Field>
      </div>
    </Modal>
  );
}
