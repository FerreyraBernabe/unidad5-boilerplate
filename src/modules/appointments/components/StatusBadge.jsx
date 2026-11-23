import { STATUS_STYLES } from '../helpers/appointments';

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] ?? {
    label: status,
    badge: 'bg-slate-100 text-slate-700',
    dot: 'bg-slate-500',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${style.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {style.label}
    </span>
  );
}
