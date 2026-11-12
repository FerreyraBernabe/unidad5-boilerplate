export default function DoctorsTablePagination() {
  return (
    <div className="p-4 bg-med-primary-50/50 border-t border-med-border flex items-center justify-between text-xs text-med-text-muted">
      <span>Mostrando 4 de 124 registros</span>
      <div className="flex items-center gap-1">
        <button className="px-2.5 py-1 border border-med-border rounded bg-white text-med-text-sub hover:bg-gray-50">
          ‹
        </button>
        <button className="px-2.5 py-1 border border-med-border rounded bg-white text-med-text-sub hover:bg-gray-50">
          ›
        </button>
      </div>
    </div>
  );
}
