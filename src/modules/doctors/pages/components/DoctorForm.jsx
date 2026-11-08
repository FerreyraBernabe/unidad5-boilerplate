export default function DoctorForm() {
  return (
    <div className="form-container">
      <header className="page-header">
        <h1>Registrar Nuevo Doctor</h1>
        <p className="page-subtitle">
          Complete todos los campos obligatorios para integrar al nuevo
          facultativo al sistema del centro medico
        </p>
      </header>
      <div className="cuadroformulario">
        <form id="doctor-create-form" className="formularioCrear">
          <label for="nombre">Nombre completo del doctor</label>
          <input type="text" placeholder="Ej: Dr. Juan Pérez" id="nombre" />

          <div className="fila-campos">
            <div className="campo">
              <label for="specialty">Especialidad</label>
              <select id="specialty">
                <option value="Cardiología">Cardiología</option>
                <option value="Pediatría">Pediatría</option>
                <option value="Traumatología">Traumatología</option>
                <option value="Dermatología">Dermatología</option>
                <option value="Neurología">Neurología</option>
              </select>
            </div>
            <div className="campo">
              <label for="inputLicense">Numero de Licencia</label>
              <input id="inputLicense" placeholder="ID-45920-x" />
            </div>
          </div>
          <div className="btn-container">
            <button id="cancel-btn" type="button">
              Cancelar
            </button>
            <button id="create-btn" type="submit">
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              Guardar Doctor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
