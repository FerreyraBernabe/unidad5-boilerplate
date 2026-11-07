export default function AvailabilityTable() {
  return (
    <form
      id="availabilityForm"
      className="overflow-hidden rounded-xl border border-med-border bg-white shadow-xs"
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-med-border bg-med-primary-50/70 text-[11px] uppercase tracking-wider text-med-text-sub">
            <tr>
              <th className="px-5 py-3.5 font-semibold">Día</th>
              <th className="px-5 py-3.5 font-semibold">Estado</th>
              <th className="px-5 py-3.5 font-semibold">Entrada</th>
              <th className="px-5 py-3.5 font-semibold">Salida</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-med-border-subtle"></tbody>
        </table>
      </div>
    </form>
  );
}
