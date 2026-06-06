"use client"

/**
 * Una fila de la lista de hábitos.
 * Es Client Component porque usa useOptimistic: queremos que el círculo
 * cambie de color ANTES de que vuelva la respuesta del servidor.
 */

import { useOptimistic } from "react"
import { deleteHabit, toggleCheckInToday } from "./actions"

type Props = {
  id: string
  name: string
  doneToday: boolean
}

export function HabitRow({ id, name, doneToday }: Props) {
  // useOptimistic: estado "como si ya hubiera pasado". Cuando llamamos
  // setOptimisticDone, React lo pinta al toque. Si el server-action falla,
  // React vuelve solo al estado real.
  const [optimisticDone, setOptimisticDone] = useOptimistic(doneToday)

  return (
    <li className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 shadow-sm transition-colors hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700">
      <form
        action={async () => {
          setOptimisticDone(!optimisticDone)
          await toggleCheckInToday(id)
        }}
      >
        <button
          type="submit"
          aria-label={optimisticDone ? "Desmarcar hoy" : "Marcar como hecho hoy"}
          className={`flex h-6 w-6 items-center justify-center rounded-full border transition-all active:scale-90 ${
            optimisticDone
              ? "border-emerald-600 bg-emerald-600 dark:border-emerald-500 dark:bg-emerald-500"
              : "border-zinc-300 hover:border-emerald-500 dark:border-zinc-700 dark:hover:border-emerald-500"
          }`}
        >
          {optimisticDone && (
            <svg
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
      </form>

      <span
        className={`flex-1 text-sm transition-colors ${
          optimisticDone
            ? "text-zinc-400 line-through dark:text-zinc-500"
            : "text-zinc-900 dark:text-zinc-50"
        }`}
      >
        {name}
      </span>

      <form
        action={async () => {
          await deleteHabit(id)
        }}
      >
        <button
          type="submit"
          aria-label="Borrar hábito"
          className="flex h-6 w-6 items-center justify-center rounded-md text-sm text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50"
        >
          ✕
        </button>
      </form>
    </li>
  )
}
