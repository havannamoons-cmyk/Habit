/**
 * Calendario de un mes para un hábito: los días cumplidos se pintan de violeta,
 * hoy lleva un anillo. Recibe el set de días (YYYY-MM-DD) cumplidos.
 * Server Component.
 */

const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"]

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`
}

type Props = {
  year: number
  month: number // 0-11
  doneDays: Set<string>
  today: string
}

export function MonthCalendar({ year, month, doneDays, today }: Props) {
  const first = new Date(Date.UTC(year, month, 1))
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
  // Día de la semana del 1° con lunes = 0.
  const startOffset = (first.getUTCDay() + 6) % 7

  const monthName = new Intl.DateTimeFormat("es", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(first)

  // Celdas: huecos al principio + los días del mes.
  const cells: (string | null)[] = []
  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(`${year}-${pad(month + 1)}-${pad(d)}`)
  }

  return (
    <div className="space-y-2">
      <p className="text-center text-sm font-medium capitalize">{monthName}</p>
      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((w, i) => (
          <span key={i} className="text-[10px] font-medium text-zinc-400">
            {w}
          </span>
        ))}
        {cells.map((day, i) => {
          if (!day) return <span key={i} />
          const done = doneDays.has(day)
          const isToday = day === today
          const num = Number(day.slice(8, 10))
          return (
            <span
              key={i}
              className={`mx-auto flex h-8 w-8 items-center justify-center rounded-lg text-xs tabular-nums transition-colors ${
                done
                  ? "bg-gradient-to-br from-violet-500 to-fuchsia-500 font-medium text-white"
                  : "text-zinc-500 dark:text-zinc-400"
              } ${
                isToday && !done
                  ? "ring-2 ring-violet-300 dark:ring-violet-700"
                  : ""
              }`}
            >
              {num}
            </span>
          )
        })}
      </div>
    </div>
  )
}
