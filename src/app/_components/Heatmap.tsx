/**
 * Mapa de actividad estilo "contribuciones": una grilla de las últimas
 * semanas (columnas) × 7 días (filas). Cada cuadradito se tiñe de violeta
 * según cuántos hábitos se cumplieron ese día. Server Component.
 */

const WEEKS = 13

function shiftDay(day: string, delta: number): string {
  const d = new Date(`${day}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + delta)
  return d.toISOString().slice(0, 10)
}

// Día de la semana con lunes = 0 ... domingo = 6.
function mondayIndex(day: string): number {
  return (new Date(`${day}T00:00:00Z`).getUTCDay() + 6) % 7
}

function colorFor(count: number): string {
  if (count <= 0) return "bg-zinc-100 dark:bg-zinc-800/70"
  if (count === 1) return "bg-violet-200 dark:bg-violet-900"
  if (count === 2) return "bg-violet-400 dark:bg-violet-700"
  if (count === 3) return "bg-violet-500 dark:bg-violet-600"
  return "bg-violet-600 dark:bg-violet-500"
}

const LEGEND = [
  "bg-zinc-100 dark:bg-zinc-800/70",
  "bg-violet-200 dark:bg-violet-900",
  "bg-violet-400 dark:bg-violet-700",
  "bg-violet-500 dark:bg-violet-600",
  "bg-violet-600 dark:bg-violet-500",
]

type Props = { counts: Record<string, number>; today: string }

export function Heatmap({ counts, today }: Props) {
  const lastMonday = shiftDay(today, -mondayIndex(today))
  const firstMonday = shiftDay(lastMonday, -(WEEKS - 1) * 7)

  const columns = Array.from({ length: WEEKS }, (_, c) => {
    const weekStart = shiftDay(firstMonday, c * 7)
    return Array.from({ length: 7 }, (_, r) => {
      const day = shiftDay(weekStart, r)
      return { day, count: counts[day] ?? 0, future: day > today }
    })
  })

  return (
    <section className="space-y-3 rounded-2xl border border-violet-100 bg-white/60 p-4 shadow-sm backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/60">
      <p className="text-xs font-medium text-zinc-500">Tu actividad</p>

      <div className="flex justify-center gap-1 overflow-x-auto">
        {columns.map((week, ci) => (
          <div key={ci} className="flex flex-col gap-1">
            {week.map((cell, ri) => (
              <span
                key={ri}
                title={
                  cell.future
                    ? undefined
                    : `${cell.day}: ${cell.count} ${
                        cell.count === 1 ? "hábito" : "hábitos"
                      }`
                }
                className={`h-2.5 w-2.5 rounded-[3px] ${
                  cell.future ? "bg-transparent" : colorFor(cell.count)
                }`}
              />
            ))}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-end gap-1 text-[10px] text-zinc-400">
        <span>menos</span>
        {LEGEND.map((c, i) => (
          <span key={i} className={`h-2.5 w-2.5 rounded-[3px] ${c}`} />
        ))}
        <span>más</span>
      </div>
    </section>
  )
}
