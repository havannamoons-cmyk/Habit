/**
 * Lógica de refresco de sesión que corre en cada request.
 * Se invoca desde src/middleware.ts (el "punto de entrada" de Next.js).
 *
 * Por qué hace falta: las sesiones de Supabase viven en cookies. Si una
 * cookie está por expirar, hay que renovarla en el servidor antes de que
 * lleguen las requests al resto de la app. Sin esto, el usuario podría
 * ser deslogueado silenciosamente entre páginas.
 */
import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // Esto refresca el token si está por vencer.
  // NO mover, NO sacar — la doc de Supabase es explícita acá.
  await supabase.auth.getUser()

  return supabaseResponse
}
