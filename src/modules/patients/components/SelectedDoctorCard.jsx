import Card from '../../shared/components/Card';
import { getInitials } from '../../shared/helpers/getInitials';

export default function SelectedDoctorCard({ doctor }) {
  if (!doctor) {
    return null;
  }

  return (
    <Card className="flex items-center gap-4 border-med-border p-5 sm:p-6">
      <div className="relative shrink-0">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-med-primary-200 bg-med-primary-100 text-lg font-bold text-med-primary-900 sm:h-16 sm:w-16">
          {getInitials(doctor.name)}
        </div>
        <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-base font-bold text-med-primary-900 sm:text-lg">
            {doctor.name}
          </h2>
          <span className="inline-block rounded bg-med-primary-100 px-2 py-0.5 text-[11px] font-semibold text-med-primary-700">
            Profesional Activo
          </span>
        </div>
        <p className="mt-0.5 text-xs font-semibold text-med-primary-700 sm:text-sm">
          {doctor.specialty?.name || 'Sin especialidad'}
        </p>
        {doctor.licenseNumber && (
          <p className="mt-0.5 text-xs text-med-text-muted">
            Matrícula: {doctor.licenseNumber}
          </p>
        )}
      </div>
    </Card>
  );
}
