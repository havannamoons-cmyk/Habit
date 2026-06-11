"use client"

/**
 * Una fila de la lista de hábitos.
 * Es Client Component porque usa useOptimistic (el círculo cambia al toque)
 * y una pequeña animación de celebración al completar.
 */

import { createElement, useOptimistic, useState, type CSSProperties } from "react"
import Link from "next/link"
import { Flame, Pencil, Check, X } from "lucide-react"
import { deleteHabit, toggleCheckInToday, updateHabit } from "./actions"
import { getHabitIcon, HABIT_AVATAR } from "./decor"

type Props = {
  id: string
  name: string
  doneToday: boolean
  streak?: number
  // Últimos 7 días (del más viejo al más nuevo). Opcional para los tests.
  history?: boolean[]
}

// Direcciones de las partículas que salen al marcar (en px).
const BURST = [
  { dx: "0px", dy: "-15px" },
  { dx: "13px", dy: "-8px" },
  { dx: "14px", dy: "7px" },
  { dx: "0px", dy: "15px" },
  { dx: "-14px", dy: "7px" },
  { dx: "-13px", dy: "-8px" },
]

export function HabitRow({
  id,
  name,
  doneToday,
  streak = 0,
  history = [],
}: Props) {
  // useOptimistic: estado "como si ya hubiera pasado". Si el server-action
  // falla, React vuelve solo al estado real.
  const [optimisticDone, setOptimisticDone] = useOptimistic(doneToday)
  const [celebrate, setCelebrate] = useState(false)
  const [editing, setEditing] = useState(false)

  const habitIcon = getHabitIcon(name)

  return (
    <li
      className={`group flex items-center gap-3 rounded-xl border px-3 py-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
        optimisticDone
          ? "border-violet-200 bg-violet-50/60 dark:border-violet-900/50 dark:bg-violet-950/20"
          : "border-zinc-200 bg-white hover:border-violet-200 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-violet-900"
      }`}
    >
      <form
        action={async () => {
          const next = !optimisticDone
          setOptimisticDone(next)
          if (next) setCelebrate(true) // solo celebramos al COMPLETAR
          await toggleCheckInToday(id)
        }}
      >
        <span className="relative inline-flex">
          <button
            type="submit"
            aria-label={optimisticDone ? "Desmarcar hoy" : "Marcar como hecho hoy"}
            onAnimationEnd={() => setCelebrate(false)}
            className={`flex h-7 w-7 items-center justify-center rounded-full border transition-all active:scale-90 ${
              celebrate ? "animate-pop" : ""
            } ${
              optimisticDone
                ? "border-violet-600 bg-violet-600 dark:border-violet-500 dark:bg-violet-500"
                : "border-zinc-300 hover:border-violet-500 dark:border-zinc-700 dark:hover:border-violet-500"
            }`}
          >
            {optimisticDone && (
              <svg
                data-check
                viewBox="0 0 20 20"
                fill="none"
                className="h-4 w-4 text-white"
              >
                <path
                  d="M5 10l3 3 7-7"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>

          {celebrate && (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
              {BURST.map((p, i) => (
                <span
                  key={i}
                  className="burst-dot bg-amber-400"
                  style={{ "--dx": p.dx, "--dy": p.dy } as CSSProperties}
                />
              ))}
            </span>
          )}
        </span>
      </form>

      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ring-1 ring-inset ring-violet-100 dark:ring-violet-900/40 ${HABIT_AVATAR}`}
        aria-hidden
      >
        {createElement(habitIcon, {
          className: "h-[18px] w-[18px]",
          strokeWidth: 2,
        })}
      </span>

      {editing ? (
        <form
          action={async (formData) => {
            const newName = (formData.get("rename") as string)?.trim()
            setEditing(false)
            if (newName && newName !== name) await updateHabit(id, newName)
          }}
          className="flex flex-1 items-center gap-1.5"
        >
          <input
            name="rename"
            defaultValue={name}
            autoFocus
            maxLength={100}
            aria-label="Nuevo nombre del hábito"
            className="min-w-0 flex-1 rounded-md border border-violet-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-violet-600/20 dark:border-violet-700 dark:bg-zinc-900"
          />
          <button
            type="submit"
            aria-label="Guardar nombre"
            className="flex h-7 w-7 items-center justify-center rounded-md text-violet-600 transition-colors hover:bg-violet-50 dark:hover:bg-violet-950/40"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            aria-label="Cancelar"
            className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800"
          >
            <X className="h-4 w-4" />
          </button>
        </form>
      ) : (
        <>
          <div className="min-w-0 flex-1">
            <Link
              href={`/habits/${id}`}
              className={`block truncate text-sm underline-offset-2 transition-colors hover:underline ${
                optimisticDone
                  ? "text-zinc-400 line-through dark:text-zinc-500"
                  : "text-zinc-900 dark:text-zinc-50"
              }`}
            >
              {name}
            </Link>

            {history.length === 7 && (
              <div className="mt-1.5 flex items-center gap-1" aria-hidden>
                {history.map((did, i) => (
                  <span
                    key={i}
                    className={`h-1.5 w-1.5 rounded-full transition-colors ${
                      did
                        ? "bg-violet-500"
                        : "bg-zinc-200 dark:bg-zinc-700"
                    } ${i === 6 ? "ring-2 ring-violet-300 ring-offset-1 ring-offset-white dark:ring-offset-zinc-950" : ""}`}
                  />
                ))}
              </div>
            )}
          </div>

          {streak > 0 && (
            <span
              title={`${streak} día${streak === 1 ? "" : "s"} seguidos`}
              className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold tabular-nums text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
            >
              <Flame className="h-3 w-3" strokeWidth={2.5} />
              {streak}
            </span>
          )}

          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label="Editar hábito"
            className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-300 transition-all hover:bg-violet-50 hover:text-violet-600 focus:opacity-100 group-hover:opacity-100 sm:opacity-0 dark:text-zinc-600 dark:hover:bg-violet-950/40"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>

          <form
            action={async () => {
              await deleteHabit(id)
            }}
          >
            <button
              type="submit"
              aria-label="Borrar hábito"
              className="flex h-7 w-7 items-center justify-center rounded-md text-sm text-zinc-300 transition-all hover:bg-red-50 hover:text-red-600 focus:opacity-100 group-hover:opacity-100 sm:opacity-0 dark:text-zinc-600 dark:hover:bg-red-950/50"
            >
              ✕
            </button>
          </form>
        </>
      )}
    </li>
  )
}
