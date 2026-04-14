import { createClient as createSupabaseClient } from "@supabase/supabase-js"

function normalizeEnvValue(value: string | undefined) {
  if (!value) return ""
  // Handle common Windows/.env issues: CRLF, surrounding quotes, whitespace
  return value
    .replace(/\r/g, "")
    .trim()
    .replace(/^"(.*)"$/, "$1")
    .replace(/^'(.*)'$/, "$1")
    .trim()
}

const supabaseUrl = normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL)
const supabaseAnonKey = normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

const looksLikePlaceholderUrl =
  !supabaseUrl ||
  supabaseUrl.includes("YOUR_PROJECT_REF") ||
  supabaseUrl.includes("your_project_ref")

const looksLikePlaceholderKey =
  !supabaseAnonKey ||
  supabaseAnonKey.includes("YOUR_") ||
  supabaseAnonKey.toLowerCase().includes("your_project_ref")

if (looksLikePlaceholderUrl || looksLikePlaceholderKey) {
  throw new Error(
    "Supabase env vars look missing or still set to placeholders.\n" +
      "- Confirm `.env.local` has real `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`\n" +
      "- Restart `npm run dev` after changing env vars\n" +
      "- If you previously set Windows env vars for NEXT_PUBLIC_*, remove them"
  )
}

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY in environment.")
}

type SupabaseClientType = ReturnType<typeof createSupabaseClient>

let browserSingleton: SupabaseClientType | null = null

export function createClient() {
  // In the browser, reuse a single client to avoid multiple GoTrueClient instances.
  if (typeof window !== "undefined") {
    if (!browserSingleton) {
      browserSingleton = createSupabaseClient(supabaseUrl, supabaseAnonKey)
    }
    return browserSingleton
  }

  // On the server, create a fresh client (no shared global state).
  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = createClient()

