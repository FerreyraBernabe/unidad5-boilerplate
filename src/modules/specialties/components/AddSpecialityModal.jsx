export default function AddSpecialityModal({ onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="speciality-modal-title"
        className="flex max-h-[250vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-med-primary-100 shadow-xl"
      >
        <header className="flex flex-col gap-0.5 p-1">
          <h2 className="font-bold text-sky-900">
            Registrar Nueva Especialidad
          </h2>
          <p>
            Complete la información técnica y administrativa para dar de alta
            una especialidad médica en el sistema hospitalario
          </p>
        </header>
        {/*TODO: Mover este form a un componente */}
        <section className="bg-white border rounded-sm border-gray-400 ml-7 mb-7 p-2 w-fit">
          <form action="submit">
            <div className="flex flex-col gap-1 justify-start ml-2">
              <label htmlFor="">Nombre de la Especialidad</label>
              <input
                className="rounded-1"
                type="text"
                placeholder="Ej. Cardiología Intervencionista"
              />
              <label htmlFor="">Descripción</label>
              <input
                className="border border-gray-300 w-200 h-100"
                type="text"
                placeholder="Detalle el alcance de la especialidad, procedimientos principales y requisitos de derivación..."
              />
              <label htmlFor="">Estado Inicial</label>
              <select>
                <option value="Activo">
                  Activo - Disponible para programación
                </option>
                <option value="Inactivo">Inactivo - No disponible</option>
              </select>
            </div>
          </form>
        </section>
        {/*TODO: Refactorizar. Son los mismos botones de @AddAvailabilityModal */}
        <section className="flex flex-row gap-1.5 justify-end p-6 boder-t border-t-gray-400 bg-white">
          <button
            onClick={onCancel}
            className="border border-blue-950 rounded-sm bg-white pb-2 pt-2 pr-4 pl-4"
          >
            Cancelar
          </button>
          <button className="border border-blue-950 rounded-sm bg-sky-950 text-white pb-2 pt-2 pr-4 pl-4">
            Guardar Especialidad
          </button>
        </section>
      </section>
    </div>
  );
}
