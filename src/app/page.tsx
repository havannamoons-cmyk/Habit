import { createElement } from "react"
import {
  Flame,
  CircleCheck,
  ListChecks,
  LogOut,
  type LucideIcon,
} from "lucide-react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { logout } from "@/app/auth/actions"
import { createHabit } from "@/app/habits/actions"
import { HabitRow } from "@/app/habits/HabitRow"
import { Hero } from "@/app/_components/Hero"
import { Sprout, Sun } from "@/app/_components/Doodles"
import { Celebration } from "@/app/_components/Celebration"
import { Achievements } from "@/app/_components/Achievements"
import { ProgressRing } from "@/app/_components/ProgressRing"
import { getHabitIcon } from "@/app/habits/decor"

// Tarjetita de estadística (ícono + número + etiqueta).
function Stat({
  icon,
  value,
  label,
}: {
  icon: LucideIcon
  value: number
  label: string
}) {
  return (
    <div className="flex flex-col items-center gap-0.5 rounded-xl border border-violet-100 bg-white/70 px-2 py-3 text-center shadow-sm backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/70">
      {createElement(icon, { className: "h-4 w-4 text-violet-500" })}
      <span className="font-serif text-lg font-semibold tabular-nums">
        {value}
      </span>
      <span className="text-[10px] leading-tight text-zinc-500">{label}</span>
    </div>
  )
}

// Día (YYYY-MM-DD) desplazado `delta` días.
function shiftDay(day: string, delta: number): string {
  const d = new Date(`${day}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + delta)
  return d.toISOString().slice(0, 10)
}

// Racha actual: días consecutivos terminando hoy (o ayer, si todavía no
// marcaste hoy pero la racha sigue viva).
function currentStreak(days: Set<string>, today: string): number {
  const yesterday = shiftDay(today, -1)
  let cursor = days.has(today) ? today : days.has(yesterday) ? yesterday : null
  let streak = 0
  while (cursor && days.has(cursor)) {
    streak++
    cursor = shiftDay(cursor, -1)
  }
  return streak
}

// Ideas para sumar con un click cuando todavía hay pocos hábitos.
// El ícono sale del mismo mapeo que los hábitos (coherencia).
const SUGGESTIONS = [
  "Tomar agua",
  "Leer 20 min",
  "Meditar",
  "Salir a correr",
  "Ejercicio",
  "Dormir 8h",
]

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const today = new Date().toISOString().slice(0, 10)

  const { data: habits } = await supabase
    .from("habits")
    .select("id, name, check_ins(id, day)")
    .order("created_at", { ascending: true })

  // Últimos 7 días, del más viejo al más nuevo (hoy es el último).
  const last7 = Array.from({ length: 7 }, (_, i) => shiftDay(today, -(6 - i)))

  const habitsWithStatus = (habits ?? []).map((h) => {
    const days = new Set(
      (h.check_ins ?? []).map((c: { day: string }) => c.day),
    )
    return {
      id: h.id as string,
      name: h.name as string,
      doneToday: days.has(today),
      streak: currentStreak(days, today),
      history: last7.map((d) => days.has(d)),
    }
  })

  const total = habitsWithStatus.length
  const done = habitsWithStatus.filter((h) => h.doneToday).length
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)
  const allDone = total > 0 && done === total

  // Estadísticas de toda la vida del usuario.
  const totalDone = (habits ?? []).reduce(
    (acc, h) => acc + (h.check_ins ?? []).length,
    0,
  )
  const bestStreak = habitsWithStatus.reduce(
    (max, h) => Math.max(max, h.streak),
    0,
  )

  const hour = new Date().getHours()
  const morning = hour >= 6 && hour < 13
  const greeting = morning
    ? "Buenos días"
    : hour >= 13 && hour < 20
      ? "Buenas tardes"
      : "Buenas noches"

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-10 sm:py-12">
      <Celebration active={allDone} />

      {/* Cerrar sesión: fijo en la esquina superior derecha, lejos del logo. */}
      <form action={logout} className="fixed right-3 top-3 z-20 sm:right-5 sm:top-5">
        <button
          type="submit"
          className="inline-flex items-center gap-1 rounded-full border border-zinc-200/70 bg-white/70 px-2.5 py-1 text-xs text-zinc-500 shadow-sm backdrop-blur-sm transition-colors hover:bg-white hover:text-zinc-800 dark:border-zinc-800/70 dark:bg-zinc-950/70 dark:hover:bg-zinc-900 dark:hover:text-zinc-100"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Cerrar sesión</span>
        </button>
      </form>

      <div className="reveal-stagger w-full max-w-md space-y-7">
        <Hero />

        {/* Tarjeta de saludo + progreso */}
        <section className="relative overflow-hidden rounded-2xl border border-violet-100 bg-gradient-to-br from-amber-50 via-white to-violet-50/70 p-5 shadow-sm dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="flex items-center gap-1.5 text-xs text-zinc-500">
                {greeting}
                {morning && <Sun className="h-4 w-4 text-amber-400" />}
              </p>
              <h2 className="mt-1 font-serif text-2xl font-semibold tracking-tight">
                {total === 0
                  ? "Empecemos tu primer hábito"
                  : allDone
                    ? "¡Todo hecho por hoy! 🎉"
                    : `Hoy llevás ${done} de ${total}`}
              </h2>
            </div>
            {total > 0 && (
              <ProgressRing value={pct} done={done} total={total} />
            )}
          </div>
        </section>

        {/* Estadísticas */}
        {total > 0 && (
          <div className="grid grid-cols-3 gap-2">
            <Stat icon={Flame} value={bestStreak} label="Mejor racha" />
            <Stat icon={CircleCheck} value={totalDone} label="Completados" />
            <Stat icon={ListChecks} value={total} label="Hábitos" />
          </div>
        )}

        {/* Logros */}
        {total > 0 && (
          <Achievements
            totalDone={totalDone}
            bestStreak={bestStreak}
            totalHabits={total}
            allDone={allDone}
          />
        )}

        {/* Sumar hábito */}
        <form action={createHabit} className="flex gap-2">
          <input
            name="name"
            required
            maxLength={100}
            placeholder="Nuevo hábito (ej. leer 20 min)"
            className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm transition-colors focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-600/20 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-violet-500"
          />
          <button
            type="submit"
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
          >
            Sumar
          </button>
        </form>

        {/* Ideas rápidas (se ocultan cuando ya hay varios hábitos) */}
        {total < 4 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-zinc-500">Ideas para sumar</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((name) => (
                <form key={name} action={createHabit}>
                  <input type="hidden" name="name" value={name} />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm transition-colors hover:border-violet-300 hover:bg-violet-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-violet-800 dark:hover:bg-violet-950/40"
                  >
                    {createElement(getHabitIcon(name), {
                      className: "h-3.5 w-3.5 text-violet-500",
                      strokeWidth: 2,
                    })}
                    {name}
                  </button>
                </form>
              ))}
            </div>
          </div>
        )}

        {/* Lista */}
        <ul className="space-y-2">
          {total === 0 && (
            <li className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-zinc-300 px-4 py-10 text-center dark:border-zinc-700">
              <Sprout className="h-12 w-12 text-violet-500" />
              <p className="text-sm text-zinc-500">
                Sumá tu primer hábito y empezá tu racha 🔥
              </p>
            </li>
          )}

          {habitsWithStatus.map((habit) => (
            <HabitRow
              key={habit.id}
              id={habit.id}
              name={habit.name}
              doneToday={habit.doneToday}
              streak={habit.streak}
              history={habit.history}
            />
          ))}
        </ul>
      </div>
    </main>
  )
}
