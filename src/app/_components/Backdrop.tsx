/**
 * Fondo decorativo: manchas de color desenfocadas que flotan + un cielo de
 * estrellitas que titilan. Va fijo detrás de todo (-z-10) y no captura clicks.
 * Es puro adorno (aria-hidden). Las posiciones son fijas (no random) para no
 * romper la hidratación servidor/cliente.
 */

import { Sparkles, Star } from "./Doodles"

// Cielo de estrellas: posición, tamaño (px), color y desfase de la animación.
const STARS = [
  { top: "6%", left: "12%", size: 14, color: "text-amber-300", delay: "0s" },
  { top: "10%", left: "82%", size: 10, color: "text-violet-300", delay: "-0.6s" },
  { top: "18%", left: "46%", size: 8, color: "text-fuchsia-300", delay: "-1.2s" },
  { top: "24%", left: "8%", size: 11, color: "text-violet-300", delay: "-1.8s" },
  { top: "28%", left: "70%", size: 9, color: "text-rose-300", delay: "-2.4s" },
  { top: "34%", left: "30%", size: 7, color: "text-amber-300", delay: "-0.3s" },
  { top: "40%", left: "90%", size: 12, color: "text-violet-300", delay: "-1.5s" },
  { top: "46%", left: "16%", size: 8, color: "text-fuchsia-300", delay: "-2.1s" },
  { top: "52%", left: "58%", size: 10, color: "text-amber-300", delay: "-0.9s" },
  { top: "60%", left: "86%", size: 9, color: "text-rose-300", delay: "-1.7s" },
  { top: "64%", left: "38%", size: 7, color: "text-violet-300", delay: "-2.6s" },
  { top: "70%", left: "10%", size: 12, color: "text-fuchsia-300", delay: "-0.5s" },
  { top: "76%", left: "66%", size: 8, color: "text-amber-300", delay: "-1.3s" },
  { top: "82%", left: "24%", size: 10, color: "text-violet-300", delay: "-2.2s" },
  { top: "88%", left: "78%", size: 9, color: "text-rose-300", delay: "-0.8s" },
  { top: "92%", left: "44%", size: 7, color: "text-fuchsia-300", delay: "-1.9s" },
]

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

      <Sparkles className="float absolute left-[14%] top-[20%] h-8 w-8 text-amber-300/70" />
      <Sparkles className="float absolute right-[12%] top-[36%] h-6 w-6 text-violet-300/70 [animation-delay:-3s]" />
      <Sparkles className="float absolute bottom-[14%] left-[22%] h-5 w-5 text-fuchsia-300/70 [animation-delay:-5s]" />
    </div>
  )
}
