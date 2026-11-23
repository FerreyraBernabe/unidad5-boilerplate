import Alert from '../../shared/components/Alert';
import Card from '../../shared/components/Card';

export default function WeeklySlotsCalendar({
  weekOffset,
  weekDays,
  weekRangeLabel,
  onPreviousWeek,
  onNextWeek,
  slotsByDate,
  selectedDayIso,
  onSelectDayIso,
  selectedSlot,
  onSelectSlot,
  loadingSlots,
  slotsError,
}) {
  const mobileDaySlots = slotsByDate[selectedDayIso] || [];

  return (
    <Card className="border-med-border p-5 sm:p-6">
      <div className="flex flex-col justify-between gap-3 border-b border-med-border-subtle pb-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="Semana anterior"
            disabled={weekOffset === 0}
            onClick={onPreviousWeek}
            className="rounded-md border border-med-border px-2 py-1 text-med-text-sub transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            ‹
          </button>
          <span className="text-sm font-bold text-med-primary-900 sm:text-base">
            {weekRangeLabel}
          </span>
          <button
            type="button"
            aria-label="Semana siguiente"
            onClick={onNextWeek}
            className="rounded-md border border-med-border px-2 py-1 text-med-text-sub transition hover:bg-gray-50"
          >
            ›
          </button>
        </div>

        <div className="flex items-center gap-4 text-xs text-med-text-sub">
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-med-primary-900" />
            Disponible
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Seleccionado
          </span>
        </div>
      </div>

      {slotsError && (
        <Alert
          variant="warning"
          message={slotsError.message}
          className="mt-4"
        />
      )}

      {loadingSlots ? (
        <div className="py-12 text-center text-sm text-med-text-muted">
          Consultando horarios disponibles...
        </div>
      ) : (
        <>
          <div className="hidden gap-2.5 pt-5 sm:grid sm:grid-cols-7">
            {weekDays.map((day) => {
              const daySlots = slotsByDate[day.isoDate] || [];

              return (
                <div
                  key={day.isoDate}
                  className="flex flex-col items-center gap-3"
                >
                  <div className="text-center">
                    <span className="text-[11px] font-bold uppercase text-med-text-sub">
                      {day.dayShort}
                    </span>
                    <p className="text-lg font-bold leading-tight text-med-primary-900">
                      {day.dayNumber}
                    </p>
                    <span className="text-[10px] uppercase text-med-text-muted">
                      {day.monthShort}
                    </span>
                  </div>

                  <div className="flex w-full flex-col gap-2">
                    {daySlots.length > 0 ? (
                      daySlots.map((slot) => {
                        const isSelected = selectedSlot?.id === slot.id;

                        return (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => onSelectSlot(day.isoDate, slot)}
                            className={`w-full rounded-lg border px-2 py-2 text-center text-xs font-semibold transition-all ${
                              isSelected
                                ? 'border-emerald-500 bg-emerald-500 text-white shadow-sm'
                                : 'border-med-border bg-white text-med-primary-900 hover:border-med-primary-600 hover:bg-med-primary-50/50'
                            }`}
                          >
                            {slot.startTime}
                          </button>
                        );
                      })
                    ) : (
                      <div className="flex h-32 items-center justify-center rounded-lg bg-slate-50 p-2 text-center">
                        <p className="text-[11px] leading-relaxed text-med-text-muted">
                          Sin disponibilidad
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="block space-y-4 pt-4 sm:hidden">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-bold text-med-text-main">
                  Seleccionar Día
                </span>
                <span className="text-[11px] text-med-text-muted">
                  Deslizá para ver la semana
                </span>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {weekDays.map((day) => {
                  const isActive = selectedDayIso === day.isoDate;

                  return (
                    <button
                      key={day.isoDate}
                      type="button"
                      onClick={() => onSelectDayIso(day.isoDate)}
                      className={`min-w-[66px] flex-1 rounded-xl border px-2 py-2.5 text-center transition-all ${
                        isActive
                          ? 'border-med-primary-900 bg-med-primary-900 text-white shadow-sm'
                          : 'border-med-border bg-white text-med-text-main hover:bg-gray-50'
                      }`}
                    >
                      <span
                        className={`block text-[10px] font-bold uppercase ${
                          isActive ? 'text-white/80' : 'text-med-text-sub'
                        }`}
                      >
                        {day.dayShort}
                      </span>
                      <span className="my-0.5 block text-base font-extrabold">
                        {day.dayNumber}
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
              <span className="mb-2.5 block text-xs font-bold text-med-text-sub">
                Horarios disponibles (Bloques de 30 min)
              </span>

              {mobileDaySlots.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {mobileDaySlots.map((slot) => {
                    const isSelected = selectedSlot?.id === slot.id;

                    return (
                      <button
                        key={slot.id}
                        type="button"
                        onClick={() => onSelectSlot(selectedDayIso, slot)}
                        className={`rounded-lg border px-2 py-2 text-xs font-semibold transition-all ${
                          isSelected
                            ? 'border-2 border-emerald-500 bg-emerald-50 font-bold text-emerald-800 shadow-xs'
                            : 'border-med-border bg-white text-med-text-main hover:bg-gray-50'
                        }`}
                      >
                        {slot.startTime} hs
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-xl border border-med-border bg-gray-50 p-6 text-center">
                  <p className="text-xs text-med-text-muted">
                    Sin disponibilidad para el día seleccionado.
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
