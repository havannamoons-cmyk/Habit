"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export async function createHabit(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const name = (formData.get("name") as string).trim()
  if (!name) return

  await supabase.from("habits").insert({ user_id: user.id, name })

  revalidatePath("/")
}

export async function deleteHabit(habitId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // RLS ya filtra por user_id; igualmente Supabase respeta el id que pasamos.
  await supabase.from("habits").delete().eq("id", habitId)

  revalidatePath("/")
}

export async function toggleCheckInToday(habitId: string) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const today = new Date().toISOString().slice(0, 10) // YYYY-MM-DD

  // ¿Existe ya un check-in de este hábito para hoy?
  const { data: existing } = await supabase
    .from("check_ins")
    .select("id")
    .eq("habit_id", habitId)
    .eq("day", today)
    .maybeSingle()

  if (existing) {
    // Estaba marcado → desmarcamos.
    await supabase.from("check_ins").delete().eq("id", existing.id)
  } else {
    // No estaba → marcamos.
    await supabase
      .from("check_ins")
      .insert({ habit_id: habitId, user_id: user.id, day: today })
  }

  revalidatePath("/")
}
