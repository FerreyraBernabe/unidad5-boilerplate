import Button from './Button';
import Modal from './Modal';

function ConfirmModal({
  title = 'Confirmar acción',
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  loadingLabel = 'Procesando...',
  isLoading = false,
  onConfirm,
  onCancel,
  children,
}) {
  return (
    <Modal
      titleId="confirm-modal-title"
      title={title}
      onClose={onCancel}
      disableClose={isLoading}
      maxWidth="max-w-md"
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={onCancel}
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            variant="danger"
            disabled={isLoading}
            onClick={onConfirm}
          >
            {isLoading ? loadingLabel : confirmLabel}
          </Button>
        </>
      }
    >
      <div className="text-sm text-med-text-sub">{children}</div>
    </Modal>
  );
}

export default ConfirmModal;
