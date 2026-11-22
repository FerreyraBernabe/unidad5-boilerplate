// Horarios por defecto que se muestran cuando el doctor todavía no tiene disponibilidad cargada.
export const days = [
  {
    id: 'lunes',
    nombre: 'Lunes',
    activo: true,
    entrada: '08:00',
    salida: '16:00',
  },
  {
    id: 'martes',
    nombre: 'Martes',
    activo: true,
    entrada: '08:00',
    salida: '16:00',
  },
  {
    id: 'miercoles',
    nombre: 'Miércoles',
    activo: true,
    entrada: '08:00',
    salida: '12:00',
  },
  {
    id: 'jueves',
    nombre: 'Jueves',
    activo: true,
    entrada: '09:00',
    salida: '18:00',
  },
  {
    id: 'viernes',
    nombre: 'Viernes',
    activo: true,
    entrada: '08:00',
    salida: '14:00',
  },
  { id: 'sabado', nombre: 'Sábado', activo: false, entrada: '', salida: '' },
];

// Valor que espera / devuelve el backend en el campo "day".
// CONFIRMAR con el backend (Swagger) si va con o sin tilde: el helper
// normaliza lo que LLEGA, pero lo que se ENVÍA sale tal cual de acá.
export const API_DAY_BY_ID = {
  lunes: 'LUNES',
  martes: 'MARTES',
  miercoles: 'MIERCOLES',
  jueves: 'JUEVES',
  viernes: 'VIERNES',
  sabado: 'SABADO',
  domingo: 'DOMINGO',
};

// Horario sugerido al activar un día que no tenía horas cargadas.
export const DEFAULT_START_TIME = '08:00';
export const DEFAULT_END_TIME = '16:00';
