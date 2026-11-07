import { useState } from 'react';
export default function AvailabilityTable({
  initialData = days,
  onSave,
  onCancel,
}) {
  const [schedules, setSchedules] = useState(initialData);
  const handleToggle = (id) => {
    setSchedules((prev) => {
      prev.map((item) =>
        item.id === id ? { ...item, activo: !item.activo } : item
      );
    });
  };

  const handleTimeChange = (id, field, value) => {
    setSchedules((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };
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
          <tbody className="divide-y divide-med-border-subtle">
            {schedules.map((row) => (
              <tr key={row.id} className={!row.activo ? 'row-disabled' : ''}>
                <td className="day-name">{row.nombre}</td>
                <td>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={row.activo}
                      onChange={() => handleToggle(row.id)}
                    />
                    <span className="slider round"></span>
                    <span className="toggle-label">
                      {row.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </label>
                </td>
                <td>
                  <input
                    type="time"
                    className="time-input"
                    value={row.activo ? row.entrada : ''}
                    disabled={!row.activo}
                    onChange={(e) =>
                      handleTimeChange(row.id, 'entrada', e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="time"
                    className="time-input"
                    value={row.activo ? row.salida : ''}
                    disabled={!row.activo}
                    onChange={(e) =>
                      handleTimeChange(row.id, 'salida', e.target.value)
                    }
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </form>
  );
}
