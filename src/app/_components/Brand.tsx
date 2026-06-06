/**
 * Wordmark de la app. Lo usamos en login, signup y home para dar
 * identidad de marca consistente. La carpeta _components no genera ruta.
 */

export function Brand({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 shadow-sm">
        <svg
          viewBox="0 0 20 20"
          fill="none"
          className="h-4 w-4 text-white"
          aria-hidden="true"
        >
          <path
            d="M5 10l3 3 7-7"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-sm font-bold tracking-tight text-transparent dark:from-emerald-400 dark:to-teal-300">
        Hábito
      </span>
    </span>
  )
}
