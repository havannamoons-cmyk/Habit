import { createElement } from "react"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ArrowLeft, ChevronLeft, ChevronRight, Flame } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getHabitIcon, HABIT_AVATAR } from "@/app/habits/decor"
import { currentStreak, longestStreak } from "@/app/habits/dates"
import { MonthCalendar } from "@/app/_components/MonthCalendar"
import { Heatmap } from "@/app/_components/Heatmap"

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ m?: string }>
}

export default async function HabitDetail({ params, searchParams }: Props) {
  const { id } = await params
  const { m } = await searchParams

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // RLS asegura que sólo se devuelve un hábito propio.
  const { data: habit } = await supabase
    .from("habits")
    .select("id, name, check_ins(day)")
    .eq("id", id)
    .maybeSingle()

  if (!habit) notFound()

  const today = new Date().toISOString().slice(0, 10)
  const doneDays = new Set(
    ((habit.check_ins ?? []) as { day: string }[]).map((c) => c.day),
  )

  const totalDone = doneDays.size
  const streak = currentStreak(doneDays, today)
  const best = longestStreak(doneDays)

  // Constancia: % de días cumplidos desde el primer check-in hasta hoy.
  let constancia = 0
  if (totalDone > 0) {
    const firstDay = [...doneDays].sort()[0]
    const start = new Date(`${firstDay}T00:00:00Z`).getTime()
    const end = new Date(`${today}T00:00:00Z`).getTime()
    const daysTracked = Math.floor((end - start) / 86_400_000) + 1
    constancia = Math.round((totalDone / daysTracked) * 100)
  }

  // Mes a mostrar (offset en meses respecto del actual, vía ?m=).
  const offset = Number(m ?? 0) || 0
  const now = new Date(`${today}T00:00:00Z`)
  const viewYear = now.getUTCFullYear()
  const viewMonth = now.getUTCMonth() + offset

  const Icon = getHabitIcon(habit.name as string)

  // Para el heatmap: cada día cumplido cuenta 1.
  const counts: Record<string, number> = {}
  for (const d of doneDays) counts[d] = 1

  const stats = [
    { label: "Racha actual", value: streak },
    { label: "Mejor racha", value: best },
    { label: "Completados", value: totalDone },
    { label: "Constancia", value: `${constancia}%` },
  ]

  return (
    <main className="flex flex-1 flex-col items-center px-4 py-10 sm:py-12">
      <div className="reveal-stagger w-full max-w-md space-y-7">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-xs text-zinc-500 transition-colors hover:text-zinc-800 dark:hover:text-zinc-200"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Volver
        </Link>

        <header className="flex items-center gap-3">
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ring-violet-100 dark:ring-violet-900/40 ${HABIT_AVATAR}`}
            aria-hidden
          >
            {createElement(Icon, { className: "h-6 w-6", strokeWidth: 2 })}
          </span>
          <h1 className="font-serif text-2xl font-semibold tracking-tight">
            {habit.name as string}
          </h1>
        </header>

        <div className="grid grid-cols-2 gap-2">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-3 rounded-xl border border-violet-100 bg-white/70 px-3 py-3 shadow-sm backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/70"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-500 dark:bg-violet-950/40 dark:text-violet-300">
                <Flame className="h-4 w-4" />
              </span>
              <div>
                <p className="font-serif text-lg font-semibold leading-none tabular-nums">
                  {s.value}
                </p>
                <p className="text-[11px] text-zinc-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <section className="space-y-3 rounded-2xl border border-violet-100 bg-white/60 p-4 shadow-sm backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/60">
          <div className="flex items-center justify-between">
            <Link
              href={`/habits/${id}?m=${offset - 1}`}
              aria-label="Mes anterior"
              className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </Link>
            <p className="text-xs font-medium text-zinc-500">Calendario</p>
            <Link
              href={`/habits/${id}?m=${offset + 1}`}
              aria-label="Mes siguiente"
              aria-disabled={offset >= 0}
              className={`flex h-7 w-7 items-center justify-center rounded-md text-zinc-500 transition-colors ${
                offset >= 0
                  ? "pointer-events-none opacity-30"
                  : "hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
              }`}
            >
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <MonthCalendar
            year={viewYear}
            month={viewMonth}
            doneDays={doneDays}
            today={today}
          />
        </section>

        {totalDone > 0 && <Heatmap counts={counts} today={today} />}
      </div>
    </main>
  )
}
