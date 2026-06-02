/**
 * Cliente de Supabase para uso en el servidor.
 * Usar este en Server Components, Server Actions y Route Handlers.
 *
 * Lee las cookies de la request para mantener la sesión del usuario logueado
 * coherente entre cliente y servidor (Server-Side Rendering con auth).
 */
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            )
          } catch {
            // El método set() se llama desde un Server Component;
            // se puede ignorar si la middleware refresca sesiones.
          }
        },
      },
    },
  )
}
