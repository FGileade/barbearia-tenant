import type { Professional } from "../../types";

const DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

type Jornada = Professional["jornada"];

export default function WeekdaySchedule({
  jornada,
  onChange,
}: {
  jornada: Jornada;
  onChange: (jornada: Jornada) => void;
}) {
  function toggleDay(weekday: number, working: boolean) {
    onChange({
      ...jornada,
      [weekday]: working ? { inicio: "09:00", fim: "18:00" } : null,
    });
  }

  function updateTime(weekday: number, field: "inicio" | "fim", value: string) {
    const current = jornada[weekday];
    if (!current) return;
    onChange({ ...jornada, [weekday]: { ...current, [field]: value } });
  }

  return (
    <div className="weekday-schedule">
      {DIAS.map((label, weekday) => {
        const day = jornada[weekday];
        return (
          <div className="weekday-schedule__row" key={weekday}>
            <label className="weekday-schedule__toggle">
              <input
                type="checkbox"
                checked={!!day}
                onChange={(e) => toggleDay(weekday, e.target.checked)}
              />
              {label}
            </label>

            {day && (
              <span className="weekday-schedule__times">
                <input
                  type="time"
                  value={day.inicio}
                  onChange={(e) => updateTime(weekday, "inicio", e.target.value)}
                />
                <span>até</span>
                <input
                  type="time"
                  value={day.fim}
                  onChange={(e) => updateTime(weekday, "fim", e.target.value)}
                />
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
