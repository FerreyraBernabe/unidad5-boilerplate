/*
const ERROR_CODE_MESSAGES = {
  INVALID_CREDENTIALS: 'Correo electrónico o credenciales incorrectas.',
  AUTHENTICATION_ERROR: 'No se pudo autenticar el usuario. Verifica tus datos.',
  UNAUTHORIZED: 'Tu sesión expiró o no tenés permiso para esta acción.',
  FORBIDDEN: 'No tenés permisos suficientes para acceder a este recurso.',
  VALIDATION_ERROR: 'Algunos campos contienen errores. Revisá los datos ingresados.',
  NOT_FOUND: 'El recurso solicitado no existe o fue eliminado.',
  ENTITY_NOT_FOUND: 'El registro solicitado no fue encontrado.',
  APPOINTMENT_CONFLICT: 'El horario seleccionado ya fue reservado por otro paciente. Elegí otro turno.',
  DUPLICATE_ENTITY: 'Ya existe un registro con esos datos.',
  CONFLICT: 'Se produjo un conflicto al procesar la operación.',
  RATE_LIMIT_EXCEEDED: 'Demasiados intentos en poco tiempo. Esperá un momento y volvé a intentar.',
  INTERNAL_SERVER_ERROR: 'Ocurrió un error interno en el servidor. Intentá nuevamente más tarde.',
};

const HTTP_STATUS_MESSAGES = {
  400: 'Los datos enviados no son válidos. Revisá el formulario.',
  401: 'Credenciales inválidas o sesión expirada.',
  403: 'No tenés permisos para realizar esta operación.',
  404: 'No se encontró el recurso solicitado.',
  409: 'Conflicto: el recurso ya existe o el turno ya fue ocupado.',
  429: 'Demasiadas solicitudes. Esperá unos segundos antes de reintentar.',
  500: 'Error interno del servidor. Intentá nuevamente en unos instantes.',
};

*/

// Traduce respuestas de error de Axios, usa directamente la descripcion de errores del back
// Arriba quedaron los datos para hacer un diccionario para un manejo mas elaborado
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
      message: 'No se pudo conectar con el servidor. Verificá que el backend esté en ejecución.',
      details: [],
    };
  }

  const rawCode = payload?.errorCode || null;
  // const normalizedCode = rawCode ? String(rawCode).toUpperCase() : null;
  const details = Array.isArray(payload?.details) ? payload.details : [];

  const message = payload?.message || payload?.detail || fallbackMessage;

  return {
    status,
    errorCode: rawCode,
    message,
    details,
  };
}
