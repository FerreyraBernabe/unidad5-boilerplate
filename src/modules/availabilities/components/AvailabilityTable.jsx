import {
  DEFAULT_END_TIME,
  DEFAULT_START_TIME,
} from '../constants/days';

// Tabla controlada: el estado vive en el modal (useAvailabilities) para poder guardarlo.
export default function AvailabilityTable({
  schedules,
  onChange,
  errors = {},
  disabled = false,
}) {
  const handleToggle = (id) => {
    onChange(
      schedules.map((item) => {
        if (item.id !== id) {
          return item;
        }

        const activo = !item.activo;

        return {
          ...item,
          activo,
          entrada: activo ? item.entrada || DEFAULT_START_TIME : item.entrada,
          salida: activo ? item.salida || DEFAULT_END_TIME : item.salida,
        };
      })
    );
  };

  const handleTimeChange = (id, field, value) => {
    onChange(
      schedules.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  return (
    <div className="overflow-hidden rounded-xl border border-med-border bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-sm">
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
                <td className="day-name">
                  {row.nombre}
                  {errors[row.id] && (
                    <p
                      role="alert"
                      className="mt-1 text-xs font-medium text-red-500"
                    >
                      {errors[row.id]}
                    </p>
                  )}
                </td>
                <td>
                  <label className="inline-flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                      checked={row.activo}
                      disabled={disabled}
                      onChange={() => handleToggle(row.id)}
                    />
                    <span
                      aria-hidden="true"
                      className="relative h-5 w-9 rounded-full bg-slate-300 transition-colors after:absolute after:start-0.5 after:top-0.5 after:size-4 after:rounded-full after:bg-white after:transition-transform after:content-[''] peer-checked:bg-med-primary-700 peer-checked:after:translate-x-4 peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-med-primary-700"
                    />
                    <span className="select-none ms-3 text-sm font-medium text-cyan-900">
                      {row.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </label>
                </td>
                <td>
                  <input
                    type="time"
                    step="1800"
                    aria-label={`Entrada ${row.nombre}`}
                    className="time-input"
                    value={row.activo ? row.entrada : ''}
                    disabled={disabled || !row.activo}
                    onChange={(e) =>
                      handleTimeChange(row.id, 'entrada', e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="time"
                    step="1800"
                    aria-label={`Salida ${row.nombre}`}
                    className="time-input"
                    value={row.activo ? row.salida : ''}
                    disabled={disabled || !row.activo}
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
    </div>
  );
}
