"use client"

/**
 * Botón para alternar tema claro/oscuro. Togglea la clase `.dark` en <html>
 * y lo guarda en localStorage. El ícono se decide con CSS (dark:) — sin estado
 * de React — así que no hay parpadeo ni hidratación rara.
 */

import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  function toggle() {
    const isDark = document.documentElement.classList.toggle("dark")
    try {
      localStorage.setItem("theme", isDark ? "dark" : "light")
    } catch {
      // localStorage puede fallar en modo privado; no pasa nada.
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Cambiar tema"
      className="fixed left-3 top-3 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200/70 bg-white/70 text-zinc-500 shadow-sm backdrop-blur-sm transition-colors hover:text-zinc-800 sm:left-5 sm:top-5 dark:border-zinc-800/70 dark:bg-zinc-950/70 dark:text-zinc-400 dark:hover:text-zinc-100"
    >
      <Moon className="h-4 w-4 dark:hidden" />
      <Sun className="hidden h-4 w-4 dark:inline" />
    </button>
  )
}
