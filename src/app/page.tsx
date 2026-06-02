import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { logout } from "@/app/auth/actions"
import { createHabit } from "@/app/habits/actions"
import { HabitRow } from "@/app/habits/HabitRow"

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

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Tus hábitos</h1>
            <p className="text-xs text-zinc-500">{user.email}</p>
          </div>
          <form action={logout}>
            <button
              type="submit"
              className="text-xs text-zinc-500 underline-offset-4 hover:text-zinc-900 hover:underline dark:hover:text-zinc-100"
            >
              Cerrar sesión
            </button>
          </form>
        </header>

        <form action={createHabit} className="flex gap-2">
          <input
            name="name"
            required
            maxLength={100}
            placeholder="Nuevo hábito (ej. leer 20 min)"
            className="flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-50"
          />
          <button
            type="submit"
            className="rounded-md bg-zinc-900 px-3 py-2 text-sm font-medium text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Sumar
          </button>
        </form>

        <ul className="space-y-2">
          {habitsWithStatus.length === 0 && (
            <li className="rounded-md border border-dashed border-zinc-300 px-4 py-8 text-center text-sm text-zinc-500 dark:border-zinc-700">
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
