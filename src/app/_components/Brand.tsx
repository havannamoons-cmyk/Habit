/**
 * Wordmark de la app: logo (estrella) + nombre en serif elegante.
 * `size="lg"` lo agranda (para encabezados de login/signup).
 */

import { Star } from "./Doodles"

type Props = { className?: string; size?: "sm" | "lg" }

export function Brand({ className = "", size = "sm" }: Props) {
  const lg = size === "lg"
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        className={`flex items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-sm shadow-violet-500/30 ${
          lg ? "h-9 w-9" : "h-7 w-7"
        }`}
      >
        <Star className={lg ? "h-5 w-5 text-white" : "h-4 w-4 text-white"} />
      </span>
      <span
        className={`bg-gradient-to-r from-violet-600 to-fuchsia-500 bg-clip-text font-serif font-semibold tracking-tight text-transparent dark:from-violet-300 dark:to-fuchsia-300 ${
          lg ? "text-2xl" : "text-base"
        }`}
      >
        Habituación
      </span>
    </span>
  )
}
