import { useState } from 'react';
import CreateDoctorModal from '../components/CreateDoctorModal';
import Card from '../../shared/components/Card';
import Button from '../../shared/components/Button';
import AddAvailabilityModal from '../../availabilities/components/AddAvailabilityModal';
import DoctorsTable from './components/DoctorsTable';
import DoctorsTableHeader from './components/DoctorsTableHeader';
import DoctorsTablePagination from './components/DoctorsTablePagination';

function DoctorsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  //TODO: Refactorizar para unificar en un solo estado de modal
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const doctorsList = [
    {
      id: 'MED-4920',
      name: 'Dr. Alejandro Rivera',
      specialty: 'Cardiología Clínica',
      status: 'Active',
      statusType: 'active',
      avatar: '👨‍⚕️',
    },
    {
      id: 'MED-2104',
      name: 'Dra. Elena Martínez',
      specialty: 'Pediatría Avanzada',
      status: 'On Leave',
      statusType: 'danger',
      avatar: '👩‍⚕️',
    },
    {
      id: 'MED-8831',
      name: 'Dr. Marcos Torres',
      specialty: 'Neurocirugía',
      status: 'Active',
      statusType: 'active',
      avatar: '👨‍⚕️',
    },
    {
      id: 'MED-1192',
      name: 'Dra. Lucía Soria',
      specialty: 'Ginecología',
      status: 'Active',
      statusType: 'active',
      avatar: '👩‍⚕️',
    },
  ];

  const filteredDoctors = doctorsList.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //TODO: Refactorizar
  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };
  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };
  const handleOpenAvailabilityModal = () => {
    setIsAvailabilityModalOpen(true);
  };
  const handleCloseAvailabilityModal = () => {
    setIsAvailabilityModalOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Título y Acciones de Cabecera */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-med-text-main">
            Directorio de Doctores
          </h1>
          <p className="text-sm text-med-text-sub mt-1">
            Gestione el personal médico y supervise su disponibilidad actual.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Barra de Búsqueda */}
          <div className="relative min-w-[240px] flex-1 sm:flex-initial">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-med-text-muted">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Buscar doctor por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-med-border rounded-lg text-med-text-main placeholder-med-text-muted focus:outline-none focus:ring-1 focus:ring-med-primary-600"
            />
          </div>

          <Button
            onClick={handleOpenAvailabilityModal}
            className="flex items-center gap-2 bg-med-primary-900 hover:bg-med-primary-800 text-white"
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
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Agregar Disponibilidad Horaria</span>
          </Button>
          {isAvailabilityModalOpen && !isCreateModalOpen && (
            <AddAvailabilityModal onClose={handleCloseAvailabilityModal} />
          )}

          <Button
            onClick={handleOpenCreateModal}
            className="flex items-center gap-1.5 bg-med-primary-700 hover:bg-med-primary-800 text-white"
          >
            <span>+</span>
            <span>Nuevo Doctor</span>
          </Button>

          {isCreateModalOpen && !isAvailabilityModalOpen && (
            <CreateDoctorModal onClose={handleCloseCreateModal} />
          )}
        </div>
      </div>

      {/* Tabla Principal */}
      <Card className="p-0 overflow-hidden border-med-border">
        <DoctorsTableHeader />
        <DoctorsTable filteredDoctors={filteredDoctors} />
        <DoctorsTablePagination />
      </Card>
    </div>
  );
}

export default DoctorsPage;
