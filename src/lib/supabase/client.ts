/**
 * Cliente de Supabase para componentes del lado del browser.
 * Usar este en Client Components (los que tienen "use client" arriba).
 */
import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
