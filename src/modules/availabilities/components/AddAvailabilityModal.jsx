import Card from '../../shared/components/Card';
import AvailabilityTable from './AvailabilityTable';
import SearchDoctorCard from './SearchDoctorCard';
import ExtraInfoCard from './ExtraInfoCard';
import { useEffect } from 'react';
export default function AddAvailabilityModal({ onClose }) {
  useEffect(() => {
    console.log('Renderizando modal...');
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="availability-modal-title"
        className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-med-bg shadow-xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-med-border-subtle bg-white px-5 py-5 sm:px-7">
          <div>
            <h2
              id="availability-modal-title"
              className="text-xl font-bold tracking-tight text-med-primary-900 sm:text-2xl"
            >
              Gestionar Disponibilidad Horaria
            </h2>
            <p className="mt-1 text-sm leading-6 text-med-text-sub">
              Defina los días y rangos horarios de atención para el profesional
              seleccionado.
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

        <div className="flex flex-col gap-4 overflow-y-auto p-5 sm:gap-5 sm:p-7">
          <Card className="search-card">
            <SearchDoctorCard />
          </Card>
          <Card className="extra-info-card">
            <ExtraInfoCard />
          </Card>
          <AvailabilityTable />
        </div>
      </section>
    </div>
  );
}
