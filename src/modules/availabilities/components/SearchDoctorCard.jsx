import { useEffect } from 'react';
export default function SearchDoctorCard() {
  useEffect(() => {
    console.log('Renderizando card de búsqueda');
  }, []);
  return (
    <>
      <div className="flex flex-col gap-2">
        <form action="submit">
          <label htmlFor="doctor-name">Seleccionar profesional</label>
          {/* TODO: Esto debería ser un SELECT, no un INPUT*/}
          <input className="rounded-sm" type="text" name="doctor-name" />
        </form>
        <section className=" flex flex-row justify-center items-center bg-sky-100 rounded-sm gap-1.5">
          <img className="w-12 h-12 p-1" src="" alt="doc" />
          <div className="flex flex-col gap-1">
            <p className="text-l">Nombre del doctor pero más largo...</p>
            <p className="text-sm">Nro de licencia...</p>
            {/* En la imagen dice "Sede Central", pero no trabajamos con distintas sucursales*/}
          </div>
        </section>
      </div>
    </>
  );
}
