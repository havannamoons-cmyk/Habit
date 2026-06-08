/**
 * Encabezado grande y elegante de la home: logo (estrella), nombre en serif
 * con degradé, bajada, y estrellitas titilando alrededor.
 */

import { Sparkles, Star } from "./Doodles"

export function Hero() {
  return (
    <div className="relative flex flex-col items-center pt-1 text-center">
      <Star
        className="twinkle absolute left-6 top-0 h-4 w-4 text-amber-300"
        style={{ animationDelay: "-0.5s" }}
      />
      <Star
        className="twinkle absolute right-8 top-2 h-3 w-3 text-violet-300"
        style={{ animationDelay: "-1.5s" }}
      />
      <Sparkles
        className="twinkle absolute right-3 top-9 h-5 w-5 text-fuchsia-300"
        style={{ animationDelay: "-2s" }}
      />
      <Star
        className="twinkle absolute left-3 top-10 h-3 w-3 text-rose-300"
        style={{ animationDelay: "-1s" }}
      />

      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-lg shadow-violet-500/30">
        <Star className="h-7 w-7 text-white" />
      </span>

      <h1 className="mt-3 bg-gradient-to-r from-violet-700 via-fuchsia-600 to-violet-700 bg-clip-text font-serif text-4xl font-semibold tracking-tight text-transparent dark:from-violet-300 dark:via-fuchsia-300 dark:to-violet-200">
        Habituación
      </h1>
      <p className="mt-1.5 text-sm text-zinc-500">tu día, paso a paso</p>
    </div>
  )
}
