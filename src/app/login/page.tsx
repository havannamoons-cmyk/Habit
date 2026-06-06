import Link from "next/link"
import { login } from "@/app/auth/actions"
import { Brand } from "@/app/_components/Brand"

type Props = {
  searchParams: Promise<{ error?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const { error } = await searchParams

  return (
    <main className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex justify-center">
          <Brand />
        </div>

        <div className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <header className="space-y-1 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Entrar</h1>
            <p className="text-sm text-zinc-500">Volvé a tus hábitos.</p>
          </header>

          <form action={login} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm transition-colors focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-600/20 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-violet-500"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                minLength={6}
                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm transition-colors focus:border-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-600/20 dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-violet-500"
              />
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950 dark:text-red-300"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full rounded-lg bg-violet-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
            >
              Entrar
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-zinc-500">
          ¿No tenés cuenta?{" "}
          <Link
            href="/signup"
            className="font-medium text-violet-700 underline-offset-4 hover:underline dark:text-violet-400"
          >
            Registrate
          </Link>
        </p>
      </div>
    </main>
  )
}
