const VARIANT_CLASSES = {
  error: 'border-red-200 bg-red-50 text-red-700',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
};

function Alert({
  variant = 'error',
  message,
  details = [],
  onClose,
  className = '',
  children,
}) {
  if (!message && !children) {
    return null;
  }

  const styleClass = VARIANT_CLASSES[variant] || VARIANT_CLASSES.error;

  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className={`flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-xs sm:text-sm ${styleClass} ${className}`}
    >
      <div className="flex-1">
        {message && <p className="font-medium">{message}</p>}
        {Array.isArray(details) && details.length > 0 && (
          <ul className="mt-1 list-disc pl-4 text-xs">
            {details.map((item, idx) => (
              <li key={idx}>
                {item.field ? `${item.field}: ` : ''}
                {item.issue}
              </li>
            ))}
          </ul>
        )}
        {children}
      </div>

      {onClose && (
        <button
          type="button"
          aria-label="Cerrar aviso"
          onClick={onClose}
          className="text-xs font-bold opacity-70 transition hover:opacity-100"
        >
          ✕
        </button>
      )}
    </div>
  );
}

export default Alert;
