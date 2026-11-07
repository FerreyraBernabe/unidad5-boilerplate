import { useEffect } from 'react';
export default function SearchDoctorCard() {
  useEffect(() => {
    console.log('Renderizando card de búsqueda');
  }, []);
  return (
    <>
      <form action="submit">
        <label htmlFor="doctor-name">Seleccionar profesional</label>
        <input type="text" name="doctor-name" />
      </form>
      <section className="doctor-info">
        <img src="" alt="foto del doctor" />
        <p>Nombre del doctor...</p>
        <p>Nro de licencia...</p>
        {/* En la imagen dice "Sede Central", pero no trabajamos con distintas sucursales*/}
      </section>
    </>
  );
}
