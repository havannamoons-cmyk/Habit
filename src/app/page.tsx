import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { logout } from "@/app/auth/actions"
import { createHabit } from "@/app/habits/actions"
import { HabitRow } from "@/app/habits/HabitRow"
import { Brand } from "@/app/_components/Brand"

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Trae los hábitos del usuario logueado (RLS ya filtra) y por cada uno
  // sus check-ins (solo nos importa saber si hay uno con day=hoy).
  const today = new Date().toISOString().slice(0, 10)

  const { data: habits } = await supabase
    .from("habits")
    .select("id, name, check_ins(id, day)")
    .order("created_at", { ascending: true })

  const habitsWithStatus = (habits ?? []).map((h) => ({
    id: h.id as string,
    name: h.name as string,
    doneToday: (h.check_ins ?? []).some(
      (c: { day: string }) => c.day === today,
    ),
  }))

  const total = habitsWithStatus.length
  const done = habitsWithStatus.filter((h) => h.doneToday).length
  const pct = total === 0 ? 0 : Math.round((done / total) * 100)

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-10 sm:py-12">
      <div className="w-full max-w-md space-y-8">
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

        <header className="space-y-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Tus hábitos
            </h1>
            <p className="text-xs text-zinc-500">{user.email}</p>
          </div>

          {total > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-500">Hoy</span>
                <span className="font-medium tabular-nums text-zinc-700 dark:text-zinc-300">
                  {done} de {total}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                <div
                  className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )}
        </header>

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

        <ul className="space-y-2">
          {total === 0 && (
            <li className="rounded-xl border border-dashed border-zinc-300 px-4 py-10 text-center text-sm text-zinc-500 dark:border-zinc-700">
              Todavía no sumaste ningún hábito.
            </li>
          )}

          {habitsWithStatus.map((habit) => (
            <HabitRow
              key={habit.id}
              id={habit.id}
              name={habit.name}
              doneToday={habit.doneToday}
            />
          ))}
        </ul>
      </div>
    </main>
  )
}
