/**
 * Logros: badges que se desbloquean solos según las estadísticas del usuario.
 * Los desbloqueados se ven con degradé violeta; los pendientes, en gris con
 * candado (sirven de meta). Es un Server Component: sólo calcula y muestra.
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
  Star,
  Lock,
  type LucideIcon,
} from "lucide-react"

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
    { id: "perfect", label: "Día perfecto", icon: Star, unlocked: allDone },
    { id: "streak7", label: "Imparable", icon: Zap, unlocked: bestStreak >= 7 },
    { id: "collector", label: "Coleccionista", icon: Medal, unlocked: totalHabits >= 5 },
    { id: "done25", label: "Dedicación", icon: Trophy, unlocked: totalDone >= 25 },
    { id: "streak30", label: "Constante", icon: Crown, unlocked: bestStreak >= 30 },
    { id: "done100", label: "Centenaria", icon: Award, unlocked: totalDone >= 100 },
  ]

  const unlockedCount = list.filter((a) => a.unlocked).length

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-zinc-500">Logros</p>
        <p className="text-xs tabular-nums text-zinc-400">
          {unlockedCount}/{list.length}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {list.map((a) => (
          <span
            key={a.id}
            title={a.label}
            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors ${
              a.unlocked
                ? "border-transparent bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-sm shadow-violet-500/25"
                : "border-zinc-200 bg-white/60 text-zinc-400 dark:border-zinc-800 dark:bg-zinc-950/60"
            }`}
          >
            {createElement(a.unlocked ? a.icon : Lock, {
              className: "h-3.5 w-3.5",
            })}
            {a.label}
          </span>
        ))}
      </div>
    </div>
  )
}
