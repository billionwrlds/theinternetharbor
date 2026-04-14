import { createClient } from "@/lib/supabase"

/** Ensures a `profiles` row exists for FK (posts, comments). */
export async function ensureProfileExists(userId: string) {
  const supabase = createClient()
  const { data } = await supabase.from("profiles").select("id").eq("id", userId).maybeSingle()
  if (data) return
  const { error } = await supabase.from("profiles").insert({ id: userId })
  if (error) throw new Error(error.message)
}
