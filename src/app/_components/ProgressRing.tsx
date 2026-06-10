"use client"

/**
 * Anillo de progreso circular. Se llena con una animación suave al cargar
 * (de 0% al valor real) usando una transición de stroke-dashoffset.
 * El setState va dentro de un rAF para no romper la regla set-state-in-effect.
 */

import { useEffect, useState } from "react"

type Props = { value: number; done: number; total: number }

const SIZE = 96
const STROKE = 9
const R = (SIZE - STROKE) / 2
const C = 2 * Math.PI * R

export function ProgressRing({ value, done, total }: Props) {
  const [shown, setShown] = useState(0)

  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(value))
    return () => cancelAnimationFrame(id)
  }, [value])

  const offset = C - (shown / 100) * C

  return (
    <div
      className="relative shrink-0"
      style={{ width: SIZE, height: SIZE }}
    >
      <svg width={SIZE} height={SIZE} className="-rotate-90">
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#d946ef" />
          </linearGradient>
        </defs>
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          strokeWidth={STROKE}
          className="fill-none stroke-violet-100 dark:stroke-zinc-800"
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          strokeWidth={STROKE}
          stroke="url(#ringGradient)"
          strokeLinecap="round"
          className="fill-none transition-[stroke-dashoffset] duration-1000 ease-out motion-reduce:transition-none"
          style={{ strokeDasharray: C, strokeDashoffset: offset }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-serif text-xl font-semibold leading-none tabular-nums">
          {value}%
        </span>
        <span className="mt-1 text-[10px] tabular-nums text-zinc-500">
          {done}/{total}
        </span>
      </div>
    </div>
  )
}
