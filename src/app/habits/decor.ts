/**
 * Le da a cada hábito un "dibujito": un emoji acorde a su nombre y un color
 * de fondo propio. Sin tocar la base de datos — se calcula del nombre.
 *
 * Las clases de color están escritas completas a propósito: Tailwind sólo
 * incluye en el CSS final las clases que ve literales en el código, así que
 * `bg-${color}-100` interpolado NO funcionaría.
 */

// Emoji según palabras clave del nombre. El primero que matchea gana.
const KEYWORDS: [RegExp, string][] = [
  [/leer|libro|lectura/i, "📖"],
  [/agua|hidrat/i, "💧"],
  [/corr|run|trot/i, "🏃"],
  [/yoga/i, "🧘‍♀️"],
  [/medit|respir|calm|mindful/i, "🧘"],
  [/gym|ejerc|pesa|entren|fuerza|m[úu]sculo/i, "💪"],
  [/dorm|sue[ñn]|descan/i, "😴"],
  [/estud|clase|curso|aprend/i, "📚"],
  [/escrib|diario|journal|nota/i, "✍️"],
  [/camin|pase|paso/i, "🚶"],
  [/fruta|verdura|comer|sano|dieta|ensalada/i, "🥗"],
  [/code|program|dev|c[óo]digo/i, "💻"],
  [/ingl|idioma|franc|portugu/i, "🗣️"],
  [/dinero|ahorr|finanz/i, "💰"],
  [/limpi|orden|casa/i, "🧹"],
  [/m[úu]sica|guitarra|piano|toc/i, "🎸"],
]

// Emojis de reserva cuando ninguna palabra matchea.
const FALLBACK_EMOJIS = ["⭐", "🌱", "🎯", "✨", "🌟", "🔆"]

// Colores de avatar (clases completas para que Tailwind las conserve).
const AVATARS = [
  "bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
  "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
  "bg-sky-100 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300",
  "bg-violet-100 text-violet-700 dark:bg-violet-950/50 dark:text-violet-300",
  "bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
  "bg-teal-100 text-teal-700 dark:bg-teal-950/50 dark:text-teal-300",
]

// Hash simple y estable del nombre → un número.
function hash(text: string): number {
  let h = 0
  for (let i = 0; i < text.length; i++) {
    h = (h * 31 + text.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

export function getHabitDecor(name: string): { emoji: string; avatar: string } {
  const h = hash(name)
  const matched = KEYWORDS.find(([re]) => re.test(name))?.[1]
  const emoji = matched ?? FALLBACK_EMOJIS[h % FALLBACK_EMOJIS.length]
  const avatar = AVATARS[h % AVATARS.length]
  return { emoji, avatar }
}
