import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/hooks/useAuth';
import { parseApiError } from '../../shared/api/apiError';
import Alert from '../../shared/components/Alert';
import Button from '../../shared/components/Button';
import Card from '../../shared/components/Card';
import ConfirmModal from '../../shared/components/ConfirmModal';
import { useMyAppointments } from '../hooks/useMyAppointments';

const STATUS_BADGE_MAP = {
  BOOKED: {
    label: 'Confirmado',
    bgClass: 'bg-med-active-bg text-med-active-text',
  },
  ATTENDED: {
    label: 'Atendido',
    bgClass: 'bg-slate-100 text-slate-700',
  },
  CANCELLED: {
    label: 'Cancelado',
    bgClass: 'bg-med-danger-bg text-med-danger-text',
  },
  NO_SHOW: {
    label: 'Ausente',
    bgClass: 'bg-med-leave-bg text-med-leave-text',
  },
};

function AppointmentsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [cancelling, setCancelling] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const { appointments, loading, error, cancel } = useMyAppointments(user?.dni);

  const handleConfirmCancel = async () => {
    if (!appointmentToCancel) {
      return;
    }

    setCancelling(true);
    setFeedback(null);

    try {
      await cancel(appointmentToCancel.appointmentId ?? appointmentToCancel.id);
      setFeedback({
        variant: 'success',
        message: 'El turno fue cancelado y el horario quedó liberado.',
      });
      setAppointmentToCancel(null);
    } catch (err) {
      const parsed = parseApiError(err, 'No se pudo cancelar el turno.');

      setFeedback({
        variant: 'error',
        message: parsed.message,
      });
      setAppointmentToCancel(null);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-med-text-main sm:text-3xl">
            Mis Turnos Médicos
          </h1>
          <p className="mt-1 text-sm text-med-text-sub">
            Consulta y gestiona tus citas médicas programadas.
          </p>
        </div>
        <Button onClick={() => navigate('/')}>+ Solicitar Nuevo Turno</Button>
      </div>

      {feedback && (
        <Alert
          variant={feedback.variant}
          message={feedback.message}
          onClose={() => setFeedback(null)}
        />
      )}

      {error && <Alert variant="error" message={error.message} />}

      {loading ? (
        <Card className="p-8 text-center text-sm text-med-text-muted">
          Cargando tus turnos médicos...
        </Card>
      ) : appointments.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 p-8 text-center">
          <p className="text-base font-semibold text-med-primary-900">
            No tenés turnos activos registrados
          </p>
          <p className="text-sm text-med-text-sub">
            Podés buscar disponibilidad por especialidad y profesional cuando lo
            necesites.
          </p>
          <Button className="mt-2" onClick={() => navigate('/')}>
            Reservar mi primer turno
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {appointments.map((appt) => {
            const id = appt.appointmentId ?? appt.id;
            const status = appt.appointmentStatus ?? appt.status;
            const doctorName =
              appt.doctor?.name ?? appt.doctorName ?? 'Médico asignado';
            const specialtyName =
              appt.doctor?.specialty?.name ??
              appt.specialityName ??
              'Especialidad';
            const isCancellable = status === 'BOOKED';
            const badge = STATUS_BADGE_MAP[status] || {
              label: status,
              bgClass: 'bg-slate-100 text-slate-700',
            };

            return (
              <Card
                key={id}
                className="flex flex-col justify-between gap-4 p-6"
              >
                <div>
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="inline-block rounded-full bg-med-primary-100 px-3 py-1 text-xs font-semibold text-med-primary-700">
                      {specialtyName}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${badge.bgClass}`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {badge.label}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-med-primary-900">
                    {doctorName}
                  </h3>

                  <p className="mt-2 text-sm text-med-text-sub">
                    Fecha:{' '}
                    <strong className="font-semibold text-med-text-main">
                      {appt.date}
                    </strong>{' '}
                    a las{' '}
                    <strong className="font-semibold text-med-text-main">
                      {appt.startTime?.slice(0, 5)} hs
                    </strong>
                  </p>

                  {appt.reason && (
                    <p className="mt-2 text-xs text-med-text-muted">
                      Motivo: {appt.reason}
                    </p>
                  )}
                </div>

                {isCancellable && (
                  <div className="flex gap-2 border-t border-med-border pt-3">
                    <Button
                      variant="outline"
                      className="w-full text-xs text-red-600 hover:bg-red-50"
                      onClick={() => setAppointmentToCancel(appt)}
                    >
                      Cancelar Turno
                    </Button>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}

      {appointmentToCancel && (
        <ConfirmModal
          title="Cancelar turno médico"
          confirmLabel="Sí, cancelar turno"
          cancelLabel="Volver"
          loadingLabel="Cancelando..."
          isLoading={cancelling}
          onCancel={() => setAppointmentToCancel(null)}
          onConfirm={handleConfirmCancel}
        >
          ¿Seguro que deseás cancelar tu turno con{' '}
          <strong className="text-med-text-main">
            {appointmentToCancel.doctor?.name ?? appointmentToCancel.doctorName}
          </strong>{' '}
          el día{' '}
          <strong className="text-med-text-main">
            {appointmentToCancel.date}
          </strong>{' '}
          a las{' '}
          <strong className="text-med-text-main">
            {appointmentToCancel.startTime?.slice(0, 5)} hs
          </strong>
          ?
        </ConfirmModal>
      )}
    </div>
  );
}

export default AppointmentsPage;
