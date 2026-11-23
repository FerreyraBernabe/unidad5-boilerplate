import { forwardRef } from 'react';

const Input = forwardRef(function Input(
  {
    id,
    label,
    error = '',
    icon = null,
    rightElement = null,
    className = '',
    ...restProps
  },
  ref
) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <label
          htmlFor={id}
          className="text-xs font-semibold text-med-text-main"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-med-text-muted">
            {icon}
          </span>
        )}
        <input
          id={id}
          ref={ref}
          className={`w-full rounded-lg border bg-white py-2.5 text-sm text-med-text-main placeholder-med-text-muted transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-med-primary-600 ${
            icon ? 'pl-10' : 'pl-3.5'
          } ${rightElement ? 'pr-10' : 'pr-3.5'} ${
            error ? 'border-red-400 bg-red-50/20' : 'border-med-border'
          } ${className}`}
          {...restProps}
        />
        {rightElement && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {rightElement}
          </div>
        )}
      </div>
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
});

export default Input;
