import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { logout } from "@/app/auth/actions"
import { createHabit } from "@/app/habits/actions"
import { HabitRow } from "@/app/habits/HabitRow"
import { Brand } from "@/app/_components/Brand"
import { Sprout, Sparkles, Sun } from "@/app/_components/Doodles"
import { Celebration } from "@/app/_components/Celebration"

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
const SUGGESTIONS = [
  { emoji: "💧", name: "Tomar agua" },
  { emoji: "📖", name: "Leer 20 min" },
  { emoji: "🧘", name: "Meditar" },
  { emoji: "🏃", name: "Salir a correr" },
  { emoji: "💪", name: "Ejercicio" },
  { emoji: "😴", name: "Dormir 8h" },
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
      <div className="w-full max-w-md space-y-7">
        <div className="flex items-center justify-between">
          <Brand />
          <form action={logout}>
            <button
              type="submit"
              className="text-xs text-zinc-500 underline-offset-4 transition-colors hover:text-zinc-900 hover:underline dark:hover:text-zinc-100"
            >
              Cerrar sesión
            </button>
          </form>
        </div>

        {/* Tarjeta de saludo + progreso */}
        <section className="relative overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 via-white to-emerald-50/60 p-5 shadow-sm dark:border-zinc-800 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="flex items-center gap-1.5 text-xs text-zinc-500">
                {greeting}
                {morning && <Sun className="h-4 w-4 text-amber-400" />}
              </p>
              <h1 className="mt-1 text-xl font-semibold tracking-tight">
                {total === 0
                  ? "Empecemos tu primer hábito"
                  : allDone
                    ? "¡Todo hecho por hoy! 🎉"
                    : `Hoy llevás ${done} de ${total}`}
              </h1>
            </div>
            {allDone && (
              <Sparkles className="float h-10 w-10 shrink-0 text-amber-400" />
            )}
          </div>

          {total > 0 && (
            <div className="mt-4 space-y-1.5">
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-amber-100/80 dark:bg-zinc-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-400 to-emerald-500 transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="text-right text-xs font-medium tabular-nums text-zinc-500">
                {pct}%
              </p>
            </div>
          )}
        </section>

        {/* Sumar hábito */}
        <form action={createHabit} className="flex gap-2">
          <input
            name="name"
            required
            maxLength={100}
            placeholder="Nuevo hábito (ej. leer 20 min)"
            className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm transition-colors focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-emerald-500"
          />
          <button
            type="submit"
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            Sumar
          </button>
        </form>

        {/* Ideas rápidas (se ocultan cuando ya hay varios hábitos) */}
        {total < 4 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-zinc-500">Ideas para sumar</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <form key={s.name} action={createHabit}>
                  <input type="hidden" name="name" value={s.name} />
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 shadow-sm transition-colors hover:border-emerald-300 hover:bg-emerald-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-emerald-800 dark:hover:bg-emerald-950/40"
                  >
                    <span aria-hidden>{s.emoji}</span>
                    {s.name}
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
              <Sprout className="h-12 w-12 text-emerald-500" />
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
