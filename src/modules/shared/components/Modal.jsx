import { useEffect } from 'react';

function Modal({
  titleId = 'modal-title',
  title,
  subtitle,
  headerRight = null,
  onClose,
  disableClose = false,
  maxWidth = 'max-w-lg',
  footer = null,
  children,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !disableClose && onClose) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [disableClose, onClose]);

  return (
    <div
      onClick={(e) => {
        if (!disableClose && e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4"
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`flex max-h-[90vh] w-full ${maxWidth} flex-col overflow-hidden rounded-2xl bg-white shadow-xl`}
      >
        <header className="flex items-start justify-between gap-4 border-b border-med-border bg-med-primary-50/60 px-6 py-4">
          <div className="flex flex-col gap-1">
            <h2
              id={titleId}
              className="text-lg font-bold text-med-primary-900 sm:text-xl"
            >
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-med-text-sub">{subtitle}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            {headerRight}
            {onClose && (
              <button
                type="button"
                aria-label="Cerrar modal"
                disabled={disableClose}
                onClick={onClose}
                className="rounded-lg p-1 text-med-text-muted transition hover:bg-med-primary-100 hover:text-med-primary-900 disabled:opacity-40"
              >
                ✕
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {footer && (
          <footer className="flex flex-wrap items-center justify-end gap-2.5 border-t border-med-border bg-med-primary-50/40 px-6 py-4">
            {footer}
          </footer>
        )}
      </section>
    </div>
  );
}

export default Modal;
