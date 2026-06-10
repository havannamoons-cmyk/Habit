/**
 * Logros: medallas que se desbloquean solas según las estadísticas del usuario.
 * Las desbloqueadas son círculos con degradé violeta, glow y un destello que
 * titila; las pendientes quedan en gris con candado (sirven de meta).
 * Es un Server Component: sólo calcula y muestra.
 */

import { createElement } from "react"
import {
  Footprints,
  Flame,
  Zap,
  Crown,
  Trophy,
  Medal,
  Award,
  Star as StarIcon,
  Lock,
  type LucideIcon,
} from "lucide-react"
import { Star } from "./Doodles"

type Props = {
  totalDone: number
  bestStreak: number
  totalHabits: number
  allDone: boolean
}

type Achievement = {
  id: string
  label: string
  icon: LucideIcon
  unlocked: boolean
}

export function Achievements({
  totalDone,
  bestStreak,
  totalHabits,
  allDone,
}: Props) {
  const list: Achievement[] = [
    { id: "first", label: "Primer paso", icon: Footprints, unlocked: totalDone >= 1 },
    { id: "streak3", label: "En racha", icon: Flame, unlocked: bestStreak >= 3 },
    { id: "perfect", label: "Día perfecto", icon: StarIcon, unlocked: allDone },
    { id: "streak7", label: "Imparable", icon: Zap, unlocked: bestStreak >= 7 },
    { id: "collector", label: "Coleccionista", icon: Medal, unlocked: totalHabits >= 5 },
    { id: "done25", label: "Dedicación", icon: Trophy, unlocked: totalDone >= 25 },
    { id: "streak30", label: "Constante", icon: Crown, unlocked: bestStreak >= 30 },
    { id: "done100", label: "Centenaria", icon: Award, unlocked: totalDone >= 100 },
  ]

  const unlockedCount = list.filter((a) => a.unlocked).length

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-zinc-500">Logros</p>
        <p className="text-xs tabular-nums text-zinc-400">
          {unlockedCount}/{list.length}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-y-3">
        {list.map((a) => (
          <div
            key={a.id}
            title={a.label}
            className="flex flex-col items-center gap-1.5 text-center"
          >
            <span
              className={`relative flex h-12 w-12 items-center justify-center rounded-full transition-transform ${
                a.unlocked
                  ? "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-md shadow-violet-500/30"
                  : "bg-zinc-100 text-zinc-300 dark:bg-zinc-900 dark:text-zinc-600"
              }`}
            >
              {createElement(a.unlocked ? a.icon : Lock, {
                className: "h-5 w-5",
              })}
              {a.unlocked && (
                <Star className="twinkle absolute -right-1 -top-1 h-3.5 w-3.5 text-amber-300" />
              )}
            </span>
            <span
              className={`text-[10px] leading-tight ${
                a.unlocked
                  ? "font-medium text-zinc-600 dark:text-zinc-300"
                  : "text-zinc-400"
              }`}
            >
              {a.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
