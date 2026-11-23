# Sistema de Turnos Médicos — Frontend (TPI DSW 2026)

Aplicación web frontend para la gestión integral de turnos médicos (portal administrativo y portal de autogestión de pacientes), desarrollada con **React 19**, **Vite 7**, **Tailwind CSS v4**, **React Router v7**, **React Hook Form** y **Axios**.

---

## Integrantes del Grupo

- **Ferreyra Bernabé** — Legajo: 53018
- **Reyes Franco Exequiel** — Legajo: 58223
- **Ruiz Coronel Mariano Agustín** — Legajo: 58286
- **Sosa Ariana Valentina** — Legajo: 58309

---

## Requisitos Previos y Configuración Local

1. **Node.js** (versión 20 o superior recomendada) y **npm**.
2. **Backend API (`Dsw2026Tpi.Api`)** en ejecución (por defecto en `http://localhost:5278/`).

### Pasos para instalar y ejecutar

1. Clonar el repositorio e instalar las dependencias:
   ```bash
   npm install
   ```
2. Configurar las variables de entorno copiando el archivo de ejemplo:
   ```bash
   cp .env.example .env.development
   ```
   Verificar que `VITE_BACKEND_URL` apunte al puerto donde corre el backend:
   ```env
   VITE_BACKEND_URL=http://localhost:5278/
   ```
3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Scripts adicionales de verificación y compilación:
   ```bash
   npm run lint          # Verifica reglas de ESLint
   npm run format:check  # Verifica formato con Prettier
   npm run build         # Genera el build de producción en /dist
   ```

---

## Arquitectura del Proyecto

El proyecto organiza su código en `src/modules/` siguiendo **Screaming Architecture** y **Atomic Design**:

- `src/modules/shared/`: Componentes atómicos y moléculas reutilizables (`Button`, `Input`, `Card`, `Alert`, `Modal`, `ConfirmModal`, `TablePagination`), cliente HTTP (`axiosInstance.js`), catálogo centralizado de rutas (`endpoints.js`), traductor de errores (`apiError.js`) y hooks/helpers comunes (`usePagination`, `getInitials`).
- `src/modules/auth/`: Contexto de sesión JWT (`AuthProvider`), guard de rutas por rol (`ProtectedRoute`), login administrativo (`AdminLoginPage`) y servicios de autenticación.
- `src/modules/dashboard/`: Vista general administrativa (`OverviewPage`), layout (`DashboardLayout`) y métricas del día (`useMetrics`).
- `src/modules/doctors/`: Directorio paginado de profesionales (`DoctorsPage`), modal de alta/edición (`AddDoctorModal`), hook (`useDoctors`) y servicios CRUD.
- `src/modules/specialties/`: Directorio paginado de especialidades (`SpecialtiesPage`), modal de alta/edición (`AddSpecialityModal`), íconos (`SpecialtyIcon`), hook (`useSpecialties`) y servicios CRUD.
- `src/modules/availabilities/`: Configuración mensual de horarios por día de semana (`AddAvailabilityModal`, `AvailabilityTable`, `SearchDoctorCard`) y consulta de slots disponibles.
- `src/modules/appointments/`: Búsqueda avanzada combinada para administradores (`AppointmentsSearchPage`, `AppointmentFilters`, `AppointmentDetailModal`, `StatusBadge`) y servicios de citas.
- `src/modules/patients/`: Login de pacientes (`PatientLoginPage`), reserva interactiva de turnos responsive Desktop/Mobile (`PatientHome`, `BookingFiltersCard`, `WeeklySlotsCalendar`, `BookingSummaryForm`, `BookingConfirmedModal`) y gestión/cancelación de turnos activos (`AppointmentsPage`).

---

## Descripción de Endpoints Consumidos

Todas las rutas se centralizan en `src/modules/shared/api/endpoints.js` y se consumen mediante la instancia de Axios con interceptor de JWT (`Authorization: Bearer <token>`):

### Autenticación

- `POST /api/auth/admin/login`: Autenticación de administrador con `{ email, password }`. Retorna `{ token, role: "ADMINISTRADOR" }`.
- `POST /api/auth/patient/login`: Autenticación (y auto-registro en el primer ingreso) de paciente con `{ email, dni }`. Retorna `{ token, role: "PACIENTE" }`.

### Especialidades

- `GET /api/specialties?pageIndex=1&pageSize=10&name=...`: Listado paginado y filtrado de especialidades activas.
- `POST /api/specialties`: Alta de especialidad (`{ name, description }`).
- `PUT /api/specialties/{id}`: Actualización de especialidad existente.
- `DELETE /api/specialties/{id}`: Baja lógica de especialidad.

### Doctores y Disponibilidades

- `GET /api/doctors?pageIndex=1&pageSize=10&name=...&specialtyId=...`: Listado paginado de médicos con filtro por nombre y especialidad.
- `POST /api/doctors`: Registro de médico (`{ name, licenseNumber, specialtyId }`).
- `PUT /api/doctors/{id}`: Edición de datos del médico.
- `DELETE /api/doctors/{id}`: Baja lógica del médico.
- `GET /api/doctors/{id}/availabilities`: Obtiene los días y rangos horarios configurados para el médico en el mes actual.
- `GET /api/doctors/{id}/slots?from=YYYY-MM-DD&to=YYYY-MM-DD`: Obtiene los bloques de 30 minutos disponibles (`AVAILABLE`) del médico.
- `POST /api/availabilities` y `PUT /api/availabilities`: Crea o actualiza la disponibilidad mensual (`{ doctorId, days: [{ day, startTime, endTime }] }`), generando los turnos de 30 minutos excluyendo días feriados.

### Turnos / Citas (`Appointments`)

- `POST /api/appointments`: Reserva un turno (`{ doctorId, availabilityId, patient: { dni }, reason }`).
- `GET /api/appointments/patient?dni=...`: Consulta los turnos activos futuros del paciente autenticado.
- `DELETE /api/appointments/{id}`: Cancela un turno en estado `BOOKED` y libera el bloque horario.
- `GET /api/appointments/search?pageIndex=1&pageSize=10&dni=...&specialtyId=...&doctorId=...&date=YYYY-MM-DD`: Búsqueda combinada y paginada de turnos para el administrador.
