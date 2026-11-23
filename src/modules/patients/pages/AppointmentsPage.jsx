import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import { useAuth } from '../../auth/hooks/useAuth';
import { parseApiError } from '../../shared/api/apiError';
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

  useEffect(() => {
    if (!appointmentToCancel) {
      return undefined;
    }

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !cancelling) {
        setAppointmentToCancel(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [appointmentToCancel, cancelling]);

  const handleConfirmCancel = async () => {
    if (!appointmentToCancel) {
      return;
    }

    setCancelling(true);
    setFeedback(null);

    try {
      await cancel(appointmentToCancel.appointmentId);
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
        <div
          role={feedback.variant === 'error' ? 'alert' : 'status'}
          className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${
            feedback.variant === 'error'
              ? 'border-red-200 bg-red-50 text-red-700'
              : 'border-emerald-200 bg-emerald-50 text-emerald-800'
          }`}
        >
          <span>{feedback.message}</span>
          <button
            type="button"
            aria-label="Cerrar aviso"
            onClick={() => setFeedback(null)}
            className="text-xs font-bold opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error.message}
        </div>
      )}

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
            const isCancellable = appt.appointmentStatus === 'BOOKED';
            const badge = STATUS_BADGE_MAP[appt.appointmentStatus] || {
              label: appt.appointmentStatus,
              bgClass: 'bg-slate-100 text-slate-700',
            };

            return (
              <Card
                key={appt.appointmentId}
                className="flex flex-col justify-between gap-4 p-6"
              >
                <div>
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="inline-block rounded-full bg-med-primary-100 px-3 py-1 text-xs font-semibold text-med-primary-700">
                      {appt.doctor?.specialty?.name || 'Especialidad'}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${badge.bgClass}`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {badge.label}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-med-primary-900">
                    {appt.doctor?.name || 'Médico asignado'}
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
        <div
          onClick={(e) => {
            if (!cancelling && e.target === e.currentTarget) {
              setAppointmentToCancel(null);
            }
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4"
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="cancel-appointment-title"
            className="flex w-full max-w-md flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
          >
            <header className="border-b border-med-border bg-med-primary-50/60 px-6 py-4">
              <h2
                id="cancel-appointment-title"
                className="text-lg font-bold text-med-primary-900"
              >
                Cancelar turno médico
              </h2>
            </header>
            <div className="px-6 py-5 text-sm text-med-text-sub">
              ¿Seguro que deseás cancelar tu turno con{' '}
              <strong className="text-med-text-main">
                {appointmentToCancel.doctor?.name}
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
            </div>
            <footer className="flex justify-end gap-2.5 border-t border-med-border bg-med-primary-50/40 px-6 py-4">
              <Button
                variant="outline"
                disabled={cancelling}
                onClick={() => setAppointmentToCancel(null)}
              >
                Volver
              </Button>
              <Button
                variant="danger"
                disabled={cancelling}
                onClick={handleConfirmCancel}
              >
                {cancelling ? 'Cancelando...' : 'Sí, cancelar turno'}
              </Button>
            </footer>
          </section>
        </div>
      )}
    </div>
  );
}

export default AppointmentsPage;
