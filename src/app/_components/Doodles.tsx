/**
 * Dibujitos hechos a mano (SVG) para darle calidez a la app.
 * Todos heredan el color con `currentColor` y son decorativos (aria-hidden).
 */

import type { CSSProperties } from "react"

type DoodleProps = { className?: string; style?: CSSProperties }

// Estrellita de 4 puntas (una sola), para el cielo de fondo.
export function Star({ className = "", style }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
      style={style}
    >
      <path d="M12 1c0 6 5 11 11 11-6 0-11 5-11 11 0-6-5-11-11-11 6 0 11-5 11-11Z" />
    </svg>
  )
}

// Brote/plantita: la metáfora de un hábito que crece día a día.
export function Sprout({ className = "", style }: DoodleProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden className={className} style={style}>
      <path
        d="M24 44V22"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M24 30c0-7-5.5-11-13-11 0 7.5 5.5 11 13 11Z"
        fill="currentColor"
        opacity="0.3"
      />
      <path
        d="M24 26c0-7 5.5-11 13-11 0 7.5-5.5 11-13 11Z"
        fill="currentColor"
        opacity="0.5"
      />
    </svg>
  )
}

// Destellos: para celebrar logros.
export function Sparkles({ className = "", style }: DoodleProps) {
  return (
    <svg viewBox="0 0 48 48" fill="currentColor" aria-hidden className={className} style={style}>
      <path d="M22 4l3.2 9.8L35 17l-9.8 3.2L22 30l-3.2-9.8L9 17l9.8-3.2L22 4Z" />
      <path
        d="M38 26l1.6 4.8L44 32l-4.4 1.2L38 38l-1.6-4.8L32 32l4.4-1.2L38 26Z"
        opacity="0.75"
      />
      <path
        d="M11 30l1.3 4L16 35l-3.7 1L11 40l-1.3-4L6 35l3.7-1L11 30Z"
        opacity="0.55"
      />
    </svg>
  )
}

// Solcito para el saludo de la mañana.
export function Sun({ className = "", style }: DoodleProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      aria-hidden
      className={className}
      style={style}
    >
      <circle cx="24" cy="24" r="9" fill="currentColor" stroke="none" />
      <path d="M24 4v5M24 39v5M4 24h5M39 24h5M9.9 9.9l3.5 3.5M34.6 34.6l3.5 3.5M38.1 9.9l-3.5 3.5M13.4 34.6l-3.5 3.5" />
    </svg>
  )
}
