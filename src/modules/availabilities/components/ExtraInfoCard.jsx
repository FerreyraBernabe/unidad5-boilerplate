export default function ExtraInfoCard() {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-med-primary-200 bg-med-primary-50 p-4 text-sm text-med-primary-900">
      <span
        aria-hidden="true"
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-xs font-bold"
      >
        i
      </span>
      <p className="leading-6">
        Los cambios realizados se aplicarán a partir de la próxima semana
        calendario. Las citas ya programadas no se verán afectadas
        automáticamente.
      </p>
    </div>
  );
}
