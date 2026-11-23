export function parseApiError(
  error,
  fallbackMessage = 'Ocurrió un error inesperado.'
) {
  if (!error) {
    return {
      status: null,
      errorCode: null,
      message: fallbackMessage,
      details: [],
    };
  }

  const status = error.response?.status ?? null;
  const payload = error.response?.data;

  if (!error.response) {
    return {
      status: null,
      errorCode: 'NETWORK_ERROR',
      message:
        'No se pudo conectar con el servidor. Verificá que el backend esté en ejecución.',
      details: [],
    };
  }

  const rawCode = payload?.errorCode || null;
  const details = Array.isArray(payload?.details) ? payload.details : [];
  const message = payload?.message || payload?.detail || fallbackMessage;

  return {
    status,
    errorCode: rawCode,
    message,
    details,
  };
}
