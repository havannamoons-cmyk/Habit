/**
 * Fondo decorativo: manchas de color desenfocadas que flotan lento, más
 * un par de destellos. Va fijo detrás de todo (-z-10) y no captura clicks.
 * Es puro adorno, por eso aria-hidden.
 */

import { Sparkles } from "./Doodles"

export function Backdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div className="blob blob-amber" />
      <div className="blob blob-violet" />
      <div className="blob blob-rose" />

      <Sparkles className="float absolute left-[12%] top-[18%] h-8 w-8 text-amber-300/70" />
      <Sparkles className="float absolute right-[14%] top-[32%] h-6 w-6 text-violet-300/70 [animation-delay:-3s]" />
      <Sparkles className="float absolute bottom-[16%] left-[20%] h-5 w-5 text-rose-300/60 [animation-delay:-5s]" />
    </div>
  )
}
