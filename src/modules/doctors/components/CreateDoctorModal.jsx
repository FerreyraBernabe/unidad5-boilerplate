import DoctorForm from './DoctorForm';
export default function CreateDoctorModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl sm:p-8">
        <header className="mb-6 flex items-start justify-between gap-4 border-b border-med-border-subtle pb-5">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-med-primary-900 sm:text-2xl">
              Registrar Nuevo Doctor
            </h1>
            <p className="mt-1 text-sm leading-6 text-med-text-sub">
              Complete todos los campos obligatorios para integrar al nuevo
              facultativo al sistema del centro medico
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar modal"
            className="shrink-0 rounded-lg p-2 text-med-text-muted transition hover:bg-med-primary-50 hover:text-med-primary-900"
          >
            ✕
          </button>
        </header>
        <DoctorForm onCancel={onClose} />
      </div>
    </div>
  );
}
