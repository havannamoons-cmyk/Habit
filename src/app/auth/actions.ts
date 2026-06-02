"use server"

/**
 * Server Actions de autenticación.
 *
 * "use server" arriba significa que TODO lo de este archivo corre solo en el
 * servidor. Esto es importante porque acá hablamos con Supabase usando cookies
 * de sesión — eso no puede pasar en el browser.
 *
 * Cada función acá toma un FormData (lo que manda un <form>) y hace su laburo.
 */

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    // Volvemos a /login con el error en la URL (search params).
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  // Invalidamos la cache de la home para que la nueva sesión se vea reflejada.
  revalidatePath("/", "layout")
  redirect("/")
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { error } = await supabase.auth.signUp({ email, password })

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`)
  }

  // Por defecto Supabase pide confirmación por email. Si tenés esa opción
  // desactivada en el dashboard, el usuario queda logueado al toque.
  revalidatePath("/", "layout")
  redirect("/")
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/login")
}
