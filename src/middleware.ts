/**
 * Punto de entrada del middleware de Next.js.
 * Se ejecuta antes de cada request que coincida con el `matcher`.
 * Acá lo único que hacemos es delegar a updateSession() para refrescar
 * la sesión de Supabase si hace falta.
 */
import { type NextRequest } from "next/server"
import { updateSession } from "@/lib/supabase/middleware"

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Hace match con TODAS las rutas excepto:
     * - _next/static, _next/image (assets generados)
     * - favicon.ico
     * - archivos de imagen (svg, png, jpg, etc.)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
