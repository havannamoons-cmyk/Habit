/**
 * Le asigna a cada hábito un ícono de línea (Lucide) según su nombre.
 * Sin tocar la base de datos: se deduce del texto. El avatar es monocromático
 * (violeta suave) e igual para todos, para una estética limpia y coherente.
 */

import {
  BookOpen,
  Droplet,
  Footprints,
  Flower2,
  Dumbbell,
  Moon,
  GraduationCap,
  PenLine,
  Salad,
  Code,
  Languages,
  Wallet,
  Brush,
  Music,
  Target,
  type LucideIcon,
} from "lucide-react"

// Ícono según palabras clave del nombre. El primero que matchea gana.
const KEYWORDS: [RegExp, LucideIcon][] = [
  [/leer|libro|lectura/i, BookOpen],
  [/agua|hidrat/i, Droplet],
  [/corr|run|trot|camin|pase|paso/i, Footprints],
  [/yoga|medit|respir|calm|mindful/i, Flower2],
  [/gym|ejerc|pesa|entren|fuerza|m[úu]sculo/i, Dumbbell],
  [/dorm|sue[ñn]|descan/i, Moon],
  [/estud|clase|curso|aprend/i, GraduationCap],
  [/escrib|diario|journal|nota/i, PenLine],
  [/fruta|verdura|comer|sano|dieta|ensalada/i, Salad],
  [/code|program|dev|c[óo]digo/i, Code],
  [/ingl|idioma|franc|portugu/i, Languages],
  [/dinero|ahorr|finanz/i, Wallet],
  [/limpi|orden|casa/i, Brush],
  [/m[úu]sica|guitarra|piano|toc/i, Music],
]

// Avatar igual para todos: violeta suave (acento de la app).
export const HABIT_AVATAR =
  "bg-violet-50 text-violet-500 dark:bg-violet-950/40 dark:text-violet-300"

export function getHabitIcon(name: string): LucideIcon {
  return KEYWORDS.find(([re]) => re.test(name))?.[1] ?? Target
}
