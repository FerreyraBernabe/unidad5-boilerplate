import Card from '../../shared/components/Card';
import AvailabilityTable from './AvailabilityTable';
import SearchDoctorCard from './SearchDoctorCard';
import ExtraInfoCard from './ExtraInfoCard';
import { useEffect } from 'react';
import { days } from '../constants/days.js';
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
        className="flex max-h-[250vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-med-bg shadow-xl"
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

        <div className="flex flex-row gap-4">
          <div className="flex flex-col gap-6 p-4">
            <Card className="search-card">
              <SearchDoctorCard />
            </Card>
            <Card className="extra-info-card">
              <ExtraInfoCard />
            </Card>
          </div>
          {/*TODO: Ver la forma de hacer la modal más grande sin usar margin. */}
          <section className="bg-white border border-gray-400 rounded-sm mt-2 mb-10 mr-4">
            <div className="flex flex-row items-center justify-between p-4">
              <span className>Configuración de Horarios</span>
              <span className=" text-xs bg-emerald-100 rounded-2xl w-fit h-fit p-1 text-emerald-500 font-bold">
                • Horario Regular
              </span>
              <span className="text-xs text-gray-500">
                Intervalos de 30 minutos
              </span>
            </div>
            <AvailabilityTable
              initialData={days}
              onSave={() => console.log('guardado')}
              onCancel={() => console.log('cancelado')}
            />
            <section className="flex flex-row gap-1.5 justify-end p-6 boder-t border-t-gray-400">
              <button
                onClick={onClose}
                className="border border-blue-950 rounded-sm bg-white pb-2 pt-2 pr-4 pl-4"
              >
                Cancelar
              </button>
              <button className="border border-blue-950 rounded-sm bg-sky-950 text-white pb-2 pt-2 pr-4 pl-4">
                Guardar Disponibilidad
              </button>
            </section>
          </section>
        </div>
      </section>
    </div>
  );
}
