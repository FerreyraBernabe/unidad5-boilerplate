import { useEffect } from 'react';
import Button from '../../shared/components/Button';
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
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="appointment-detail-title"
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="flex items-start justify-between gap-4">
          <h2
            id="appointment-detail-title"
            className="text-xl font-bold text-med-primary-900"
          >
            Detalle de la cita
          </h2>
          <StatusBadge status={appointment.status} />
        </div>

        <dl className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Paciente">{appointment.patientName}</Field>
          <Field label="DNI">{appointment.patientDni}</Field>
          <Field label="Doctor">{appointment.doctorName}</Field>
          <Field label="Especialidad">{appointment.specialityName}</Field>
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

        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </section>
    </div>
  );
}
