/**
 * Utilidades de fechas para hábitos (trabajan con strings YYYY-MM-DD en UTC).
 */

export function shiftDay(day: string, delta: number): string {
  const d = new Date(`${day}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + delta)
  return d.toISOString().slice(0, 10)
}

// Racha actual: días consecutivos terminando hoy (o ayer, si todavía no se
// marcó hoy pero la racha sigue viva).
export function currentStreak(days: Set<string>, today: string): number {
  const yesterday = shiftDay(today, -1)
  let cursor = days.has(today) ? today : days.has(yesterday) ? yesterday : null
  let streak = 0
  while (cursor && days.has(cursor)) {
    streak++
    cursor = shiftDay(cursor, -1)
  }
  return streak
}

// Racha más larga de la historia.
export function longestStreak(days: Set<string>): number {
  const sorted = [...days].sort()
  let best = 0
  let cur = 0
  let prev: string | null = null
  for (const d of sorted) {
    cur = prev && shiftDay(prev, 1) === d ? cur + 1 : 1
    if (cur > best) best = cur
    prev = d
  }
  return best
}
