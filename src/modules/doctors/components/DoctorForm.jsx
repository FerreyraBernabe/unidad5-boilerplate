export default function DoctorForm({ onCancel }) {
  return (
    <form className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="doctor-name"
          className="text-xs font-semibold text-med-text-main"
        >
          Nombre Completo del Doctor
        </label>
        <input
          type="text"
          id="doctor-name"
          name="doctorName"
          placeholder="Ej: Dr. Alejandro Martinez"
          required
          className="w-full rounded-lg border border-med-border bg-white px-3.5 py-2.5 text-sm text-med-text-main transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-med-primary-600"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="specialty"
          className="text-xs font-semibold text-med-text-main"
        >
          Especialidad
        </label>
        <select
          id="specialty"
          name="specialty"
          required
          className="w-full rounded-lg border border-med-border bg-white px-3.5 py-2.5 text-sm text-med-text-main transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-med-primary-600"
        >
          <option value="" disabled selected>
            Seleccione una especialidad
          </option>
          <option value="Cardiología">Cardiología</option>
          <option value="Pediatría">Pediatría</option>
          <option value="Traumatología">Traumatología</option>
          <option value="Dermatología">Dermatología</option>
          <option value="Neurología">Neurología</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="doctor-license"
          className="text-xs font-semibold text-med-text-main"
        >
          Número de Licencia Médica
        </label>
        <input
          type="text"
          id="doctor-license"
          name="doctorLicense"
          placeholder="ID-45920-X"
          required
          className="w-full rounded-lg border border-med-border bg-white px-3.5 py-2.5 text-sm text-med-text-main transition focus:border-transparent focus:outline-none focus:ring-2 focus:ring-med-primary-600"
        />
      </div>
      <div className="mt-2 flex flex-col-reverse gap-3 border-t border-med-border-subtle pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-med-border bg-white px-4 py-2.5 text-sm font-medium text-med-text-main transition hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="rounded-lg bg-med-primary-900 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-med-primary-800"
        >
          Guardar Doctor
        </button>
      </div>
    </form>
  );
}
