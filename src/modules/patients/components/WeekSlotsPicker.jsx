import { useState } from 'react';
import Card from '../../shared/components/Card';
import {
  addDays,
  buildWeekDays,
  formatWeekRange,
  fromIsoDate,
  getFirstSlotDate,
  getLastSlotDate,
  getWeekStart,
} from '../../appointments/helpers/slots';

// Selector semanal de turnos (lunes a sábado).
// Recibe los turnos libres agrupados por fecha y avisa cuál eligió el paciente.
function WeekSlotsPicker({ slotsByDate, selectedSlot, onSelectSlot }) {
  const firstSlotDate = getFirstSlotDate(slotsByDate);
  const lastSlotDate = getLastSlotDate(slotsByDate);
  const currentWeekStart = getWeekStart(new Date());

  // Arranca en la semana del primer turno libre (o en la actual si no hay ninguno).
  const [weekStart, setWeekStart] = useState(() =>
    getWeekStart(firstSlotDate ? fromIsoDate(firstSlotDate) : new Date())
  );
  const [mobileDayIso, setMobileDayIso] = useState(null);

  const weekDays = buildWeekDays(weekStart);
  const hasAnySlot = firstSlotDate !== null;

  const firstDayWithSlots = weekDays.find(
    (day) => (slotsByDate[day.iso] ?? []).length > 0
  );
  const activeMobileIso =
    mobileDayIso && weekDays.some((day) => day.iso === mobileDayIso)
      ? mobileDayIso
      : (firstDayWithSlots ?? weekDays[0]).iso;
  const activeMobileDay = weekDays.find((day) => day.iso === activeMobileIso);

  const canGoPrev = weekStart > currentWeekStart;
  const canGoNext =
    lastSlotDate !== null && addDays(weekStart, 7) <= fromIsoDate(lastSlotDate);

  const changeWeek = (amount) => {
    setWeekStart(addDays(weekStart, amount));
    setMobileDayIso(null);
  };

  const handleSelect = (day, slot) => {
    onSelectSlot({
      id: slot.id,
      iso: day.iso,
      time: slot.time,
      endTime: slot.endTime,
      fullDate: day.fullDate,
    });
  };

  return (
    <Card className="p-5 sm:p-6 border-med-border">
      {/* Cabecera del calendario de semana */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-med-border-subtle">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Semana anterior"
            disabled={!canGoPrev}
            onClick={() => changeWeek(-7)}
            className="p-1 px-2 rounded-md border border-med-border hover:bg-gray-50 text-med-text-sub transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ‹
          </button>
          <span className="font-bold text-sm sm:text-base text-med-primary-900">
            {formatWeekRange(weekDays)}
          </span>
          <button
            type="button"
            aria-label="Semana siguiente"
            disabled={!canGoNext}
            onClick={() => changeWeek(7)}
            className="p-1 px-2 rounded-md border border-med-border hover:bg-gray-50 text-med-text-sub transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ›
          </button>
        </div>

        {/* Leyenda */}
        <div className="flex items-center gap-4 text-xs text-med-text-sub">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-med-primary-900" />
            Disponible
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Seleccionado
          </span>
        </div>
      </div>

      {!hasAnySlot ? (
        <p className="py-10 text-center text-sm text-med-text-muted">
          Este profesional no tiene turnos disponibles por el momento.
        </p>
      ) : (
        <>
          {/* --- A) VISTA DESKTOP: grilla semanal (visible en sm+) --- */}
          <div className="hidden sm:grid sm:grid-cols-6 gap-3 pt-5">
            {weekDays.map((day) => {
              const slots = slotsByDate[day.iso] ?? [];

              return (
                <div key={day.iso} className="flex flex-col items-center gap-3">
                  <div className="text-center">
                    <span className="text-[11px] font-bold text-med-text-sub uppercase">
                      {day.dayName}
                    </span>
                    <p className="text-xl font-bold text-med-primary-900 leading-tight">
                      {day.dateNumber}
                    </p>
                  </div>

                  <div className="w-full flex flex-col gap-2">
                    {slots.length > 0 ? (
                      slots.map((slot) => {
                        const isSelected = selectedSlot?.id === slot.id;

                        return (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => handleSelect(day, slot)}
                            className={`w-full py-2 px-3 text-xs font-semibold rounded-lg border transition-all text-center ${
                              isSelected
                                ? 'bg-emerald-400 text-white border-emerald-400 shadow-sm'
                                : 'bg-white border-med-border text-med-primary-900 hover:border-med-primary-600 hover:bg-med-primary-50/50'
                            }`}
                          >
                            {slot.time}
                          </button>
                        );
                      })
                    ) : (
                      <div className="h-44 flex items-center justify-center text-center p-2">
                        <p className="text-xs text-med-text-muted leading-relaxed">
                          No hay turnos disponibles para este día.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* --- B) VISTA MOBILE: días en fila + horarios en bloques --- */}
          <div className="block sm:hidden pt-4 space-y-4">
            <div>
              <span className="block text-xs font-bold text-med-text-main mb-2">
                Próximos Turnos
              </span>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {weekDays.map((day) => {
                  const isActive = activeMobileIso === day.iso;

                  return (
                    <button
                      key={day.iso}
                      type="button"
                      onClick={() => setMobileDayIso(day.iso)}
                      className={`flex-1 min-w-[68px] py-2.5 px-2 rounded-xl text-center border transition-all ${
                        isActive
                          ? 'bg-med-primary-900 text-white border-med-primary-900 shadow-sm'
                          : 'bg-white border-med-border text-med-text-main hover:bg-gray-50'
                      }`}
                    >
                      <span
                        className={`block text-[10px] font-bold uppercase ${
                          isActive ? 'text-white/80' : 'text-med-text-sub'
                        }`}
                      >
                        {day.dayName}
                      </span>
                      <span className="block text-base font-extrabold my-0.5">
                        {day.dateNumber}
                      </span>
                      <span
                        className={`block text-[10px] uppercase ${
                          isActive ? 'text-white/80' : 'text-med-text-muted'
                        }`}
                      >
                        {day.monthShort}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="block text-xs font-bold text-med-text-sub mb-2.5">
                Horarios disponibles (Bloques de 30 min)
              </span>

              {(slotsByDate[activeMobileIso] ?? []).length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {slotsByDate[activeMobileIso].map((slot) => {
                    const isSelected = selectedSlot?.id === slot.id;

                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => handleSelect(activeMobileDay, slot)}
                        className={`py-2 px-2 text-xs font-semibold rounded-lg border transition-all ${
                          isSelected
                            ? 'border-2 border-med-primary-900 bg-white text-med-primary-900 font-bold shadow-xs'
                            : 'bg-white border-med-border text-med-text-main hover:bg-gray-50'
                        }`}
                      >
                        {slot.time}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 bg-gray-50 border border-med-border rounded-xl text-center">
                  <p className="text-xs text-med-text-muted">
                    No hay turnos disponibles para este día seleccionado.
                  </p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </Card>
  );
}

export default WeekSlotsPicker;
