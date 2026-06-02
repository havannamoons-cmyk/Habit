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
    <li className="flex items-center gap-2 rounded-md border border-zinc-200 px-3 py-2 dark:border-zinc-800">
      <form
        action={async () => {
          setOptimisticDone(!optimisticDone)
          await toggleCheckInToday(id)
        }}
      >
        <button
          type="submit"
          aria-label={optimisticDone ? "Desmarcar hoy" : "Marcar como hecho hoy"}
          className={`h-6 w-6 rounded-full border transition-colors ${
            optimisticDone
              ? "border-zinc-900 bg-zinc-900 dark:border-zinc-50 dark:bg-zinc-50"
              : "border-zinc-300 hover:border-zinc-500 dark:border-zinc-700"
          }`}
        >
          {optimisticDone && (
            <svg
              viewBox="0 0 20 20"
              fill="none"
              className="mx-auto h-4 w-4 text-white dark:text-zinc-900"
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
        className={`flex-1 text-sm ${
          optimisticDone
            ? "text-zinc-500 line-through"
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
          className="text-xs text-zinc-400 hover:text-red-600"
        >
          ✕
        </button>
      </form>
    </li>
  )
}
