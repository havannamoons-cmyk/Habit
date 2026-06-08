/**
 * Fondo decorativo: manchas de color desenfocadas que flotan + un cielo de
 * estrellitas que titilan. Va fijo detrás de todo (-z-10) y no captura clicks.
 * Es puro adorno (aria-hidden). Las posiciones son fijas (no random) para no
 * romper la hidratación servidor/cliente.
 */

import { Sparkles, Star } from "./Doodles"

// Colores vivos para que las estrellas se vean sobre el fondo claro.
const STAR_COLORS = [
  "text-violet-400",
  "text-fuchsia-400",
  "text-amber-400",
  "text-rose-400",
  "text-violet-500",
]

// Cielo de 40 estrellas. Posiciones pseudo-aleatorias pero DETERMINÍSTICAS
// (derivadas del índice con sin) para que servidor y cliente coincidan.
const STARS = Array.from({ length: 40 }, (_, i) => {
  const rand = (seed: number) => {
    const x = Math.sin((i + 1) * seed) * 10000
    return x - Math.floor(x)
  }
  return {
    top: `${(rand(12.9898) * 96 + 2).toFixed(2)}%`,
    left: `${(rand(78.233) * 96 + 2).toFixed(2)}%`,
    size: 7 + Math.floor(rand(43.123) * 13),
    color: STAR_COLORS[i % STAR_COLORS.length],
    delay: `-${(rand(3.77) * 4).toFixed(2)}s`,
  }
})

export function Backdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="blob blob-amber" />
      <div className="blob blob-violet" />
      <div className="blob blob-rose" />

      {STARS.map((s, i) => (
        <Star
          key={i}
          className={`twinkle absolute ${s.color}`}
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            animationDelay: s.delay,
          }}
        />
      ))}

      <Sparkles className="float absolute left-[14%] top-[20%] h-9 w-9 text-amber-400/80" />
      <Sparkles className="float absolute right-[12%] top-[36%] h-7 w-7 text-violet-400/80 [animation-delay:-3s]" />
      <Sparkles className="float absolute bottom-[14%] left-[22%] h-6 w-6 text-fuchsia-400/80 [animation-delay:-5s]" />
    </div>
  )
}
