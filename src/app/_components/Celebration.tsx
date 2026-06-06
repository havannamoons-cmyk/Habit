"use client"

/**
 * Confetti a pantalla completa cuando se completan todos los hábitos del día.
 * Sin librerías: generamos las piezas en el cliente (por eso useEffect, para
 * no romper la hidratación) y caen con una animación CSS. Respeta a quien
 * prefiere menos movimiento.
 */

import { useEffect, useState, type CSSProperties } from "react"

const COLORS = [
  "#fbbf24",
  "#34d399",
  "#60a5fa",
  "#f472b6",
  "#a78bfa",
  "#fb923c",
]

type Piece = {
  left: number
  delay: number
  duration: number
  size: number
  color: string
  rotate: number
}

function makePieces(): Piece[] {
  return Array.from({ length: 70 }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 2.2 + Math.random() * 1.6,
    size: 6 + Math.random() * 7,
    color: COLORS[i % COLORS.length],
    rotate: 180 + Math.random() * 540,
  }))
}

export function Celebration({ active }: { active: boolean }) {
  const [pieces, setPieces] = useState<Piece[] | null>(null)

  useEffect(() => {
    // Si no está activo (o se pidió menos movimiento), limpiamos en el
    // próximo frame. Hacer setState dentro de callbacks —no en el cuerpo del
    // efecto— evita re-renders sincrónicos y deja contento al linter.
    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches
    if (!active || reduce) {
      const id = requestAnimationFrame(() => setPieces(null))
      return () => cancelAnimationFrame(id)
    }

    const raf = requestAnimationFrame(() => setPieces(makePieces()))
    const hide = setTimeout(() => setPieces(null), 4000)
    return () => {
      cancelAnimationFrame(raf)
      clearTimeout(hide)
    }
  }, [active])

  if (!pieces) return null

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
    >
      {pieces.map((p, i) => (
        <span
          key={i}
          className="confetti"
          style={
            {
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: p.color,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              "--rot": `${p.rotate}deg`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}
