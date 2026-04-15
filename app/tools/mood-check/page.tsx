"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { createClient } from "@/lib/supabase"
import { ArrowLeft, RefreshCw } from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────
type MoodKey = "great" | "good" | "okay" | "low" | "struggling"

interface MoodOption {
  key: MoodKey
  label: string
  value: number
  color: string
  svgFill: string
  borderColor: string
  message: string
  tips: string[]
}

interface MoodRow {
  mood: MoodKey
  created_at: string
}

// ─── Mood Data ───────────────────────────────────────────────────────
const moodOptions: MoodOption[] = [
  {
    key: "great",
    label: "Great",
    value: 5,
    color: "#a8d8c8",
    svgFill: "#a8d8c8",
    borderColor: "#a8d8c8",
    message: "That's wonderful to hear! Keep riding this wave — you've earned it.",
    tips: [
      "Share your positive energy with someone who might need it today.",
      "Write down what made today great so you can revisit it later.",
      "Use this energy to tackle something you've been putting off.",
    ],
  },
  {
    key: "good",
    label: "Good",
    value: 4,
    color: "#7ab8a8",
    svgFill: "#7ab8a8",
    borderColor: "#7ab8a8",
    message: "Good is genuinely good. You're doing well — acknowledge that.",
    tips: [
      "Take a 10-minute walk to sustain your mood through the day.",
      "Reach out to a friend just to say hi.",
      "Notice three small things you're grateful for right now.",
    ],
  },
  {
    key: "okay",
    label: "Okay",
    value: 3,
    color: "#c8b88a",
    svgFill: "#c8b88a",
    borderColor: "#c8b88a",
    message: "Okay is valid. Some days just are — and that's perfectly fine.",
    tips: [
      "Try a 4-7-8 breath: inhale 4 counts, hold 7, exhale 8.",
      "Step outside for a few minutes of fresh air and daylight.",
      "Do one small kind thing for yourself in the next hour.",
    ],
  },
  {
    key: "low",
    label: "Low",
    value: 2,
    color: "#e8956a",
    svgFill: "#e8956a",
    borderColor: "#e8956a",
    message: "Feeling low is hard. You're not alone, and this won't last forever.",
    tips: [
      "Try the 5-4-3-2-1 grounding technique: notice 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, 1 you can taste.",
      "Drink a glass of water and eat something if you haven't already.",
      "Reach out to someone you trust — a message is enough.",
      "Visit the forums and let it out anonymously if you need to.",
    ],
  },
  {
    key: "struggling",
    label: "Struggling",
    value: 1,
    color: "#ff6b6b",
    svgFill: "#ff6b6b",
    borderColor: "#ff6b6b",
    message: "Thank you for showing up and being honest. That takes real courage.",
    tips: [
      "You don't have to feel better right now. Just focus on this moment.",
      "If you're in crisis, please text HOME to 741741 or call/text 988.",
      "Try placing one hand on your chest and breathing slowly — feel your heartbeat.",
      "Remember: struggling is not failing. It's being human.",
    ],
  },
]

const moodValueMap: Record<MoodKey, number> = {
  great: 5,
  good: 4,
  okay: 3,
  low: 2,
  struggling: 1,
}

const moodLabelMap: Record<number, string> = {
  5: "Great",
  4: "Good",
  3: "Okay",
  2: "Low",
  1: "Struggling",
}

// ─── Pixel Art Emoji SVGs ─────────────────────────────────────────────
function PixelFace({ mood, size = 56 }: { mood: MoodKey; size?: number }) {
  const s = size
  const u = Math.floor(s / 8) // unit = 1 pixel block

  const mouthPaths: Record<MoodKey, JSX.Element> = {
    great: (
      // Wide smile: bottom arc
      <>
        <rect x={u * 2} y={u * 5} width={u} height={u} fill="currentColor" />
        <rect x={u * 3} y={u * 6} width={u * 2} height={u} fill="currentColor" />
        <rect x={u * 5} y={u * 5} width={u} height={u} fill="currentColor" />
      </>
    ),
    good: (
      // Small smile
      <>
        <rect x={u * 3} y={u * 5} width={u * 2} height={u} fill="currentColor" />
        <rect x={u * 2} y={u * 5} width={u} height={u} fill="currentColor" />
        <rect x={u * 5} y={u * 5} width={u} height={u} fill="currentColor" />
      </>
    ),
    okay: (
      // Flat line
      <rect x={u * 2} y={u * 5} width={u * 4} height={u} fill="currentColor" />
    ),
    low: (
      // Slight frown
      <>
        <rect x={u * 2} y={u * 6} width={u} height={u} fill="currentColor" />
        <rect x={u * 3} y={u * 5} width={u * 2} height={u} fill="currentColor" />
        <rect x={u * 5} y={u * 6} width={u} height={u} fill="currentColor" />
      </>
    ),
    struggling: (
      // Deep frown
      <>
        <rect x={u * 2} y={u * 6} width={u * 2} height={u} fill="currentColor" />
        <rect x={u * 4} y={u * 6} width={u * 2} height={u} fill="currentColor" />
        <rect x={u * 3} y={u * 5} width={u * 2} height={u} fill="currentColor" />
      </>
    ),
  }

  const option = moodOptions.find((m) => m.key === mood)!

  return (
    <svg
      width={s}
      height={s}
      viewBox={`0 0 ${s} ${s}`}
      style={{ imageRendering: "pixelated", color: option.svgFill }}
      aria-label={mood}
    >
      {/* Face */}
      <rect x={u} y={0} width={u * 6} height={s} fill="currentColor" opacity="0.15" />
      <rect x={0} y={u} width={s} height={u * 6} fill="currentColor" opacity="0.15" />
      {/* Outline */}
      <rect x={u} y={0} width={u * 6} height={u} fill="currentColor" />
      <rect x={u} y={u * 7} width={u * 6} height={u} fill="currentColor" />
      <rect x={0} y={u} width={u} height={u * 6} fill="currentColor" />
      <rect x={u * 7} y={u} width={u} height={u * 6} fill="currentColor" />
      {/* Eyes */}
      <rect x={u * 2} y={u * 3} width={u} height={u} fill="currentColor" />
      <rect x={u * 5} y={u * 3} width={u} height={u} fill="currentColor" />
      {/* Mouth */}
      {mouthPaths[mood]}
    </svg>
  )
}

// ─── Custom Tooltip ───────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="terminal-window px-3 py-2 text-xs">
        <p className="text-muted-foreground mb-0.5">{label}</p>
        <p className="text-primary">{moodLabelMap[payload[0].value] ?? "—"}</p>
      </div>
    )
  }
  return null
}

// ─── Page ─────────────────────────────────────────────────────────────
export default function MoodCheckPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [authLoading, setAuthLoading] = useState(true)

  const [step, setStep] = useState<"select" | "saved" | "chart">("select")
  const [selectedMood, setSelectedMood] = useState<MoodKey | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  const [chartData, setChartData] = useState<{ date: string; value: number | null }[]>([])
  const [chartLoading, setChartLoading] = useState(false)

  // Auth guard
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace("/login")
      } else {
        setUserId(session.user.id)
        setAuthLoading(false)
      }
    })
  }, [router])

  const loadChart = useCallback(async (uid: string) => {
    setChartLoading(true)
    const supabase = createClient()
    const since = new Date()
    since.setDate(since.getDate() - 6)
    since.setHours(0, 0, 0, 0)

    const { data } = await supabase
      .from("moods")
      .select("mood, created_at")
      .eq("user_id", uid)
      .gte("created_at", since.toISOString())
      .order("created_at", { ascending: true })

    // Build last-7-days array (one entry per day, most recent mood of that day)
    const days: { date: string; value: number | null }[] = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const label = d.toLocaleDateString("en-US", { weekday: "short", month: "numeric", day: "numeric" })
      const dayStr = d.toISOString().slice(0, 10)
      const dayMoods = (data ?? []).filter((r: MoodRow) => r.created_at.slice(0, 10) === dayStr)
      const last = dayMoods[dayMoods.length - 1] as MoodRow | undefined
      days.push({ date: label, value: last ? moodValueMap[last.mood] : null })
    }
    setChartData(days)
    setChartLoading(false)
  }, [])

  const handleSelect = async (mood: MoodKey) => {
    if (!userId) return
    setSelectedMood(mood)
    setSaving(true)
    setSaveError(null)

    const supabase = createClient()
    const { error } = await supabase.from("moods").insert({ user_id: userId, mood })
    setSaving(false)

    if (error) {
      setSaveError("Could not save your mood. Please try again.")
      return
    }

    setStep("saved")
    await loadChart(userId)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-sm text-muted-foreground tracking-wider">Loading…</p>
        </main>
        <Footer />
      </div>
    )
  }

  const selectedOption = moodOptions.find((m) => m.key === selectedMood)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-background">
        <div className="max-w-2xl mx-auto px-4 py-12">

          {/* Back link */}
          <Link
            href="/resources"
            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors tracking-wider mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
            Resources
          </Link>

          {/* Page heading */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-2 h-2 bg-primary" />
              <span className="text-xs tracking-[0.2em] text-muted-foreground uppercase">Daily Check-In</span>
            </div>
            <h1 className="font-heading text-3xl md:text-4xl text-foreground mb-2">Mood Check-In</h1>
            <p className="text-sm text-muted-foreground">A moment to pause and notice how you&apos;re really doing.</p>
          </div>

          {/* ── Step 1: Mood Selection ── */}
          {step === "select" && (
            <div className="terminal-window">
              <div className="terminal-header">
                <span className="text-xs text-muted-foreground tracking-wider">How are you feeling today?</span>
              </div>
              <div className="p-8">
                {saveError && (
                  <p className="text-xs text-destructive mb-4">{saveError}</p>
                )}
                <div className="flex justify-center gap-3 flex-wrap">
                  {moodOptions.map((option) => (
                    <button
                      key={option.key}
                      onClick={() => handleSelect(option.key)}
                      disabled={saving}
                      className="group flex flex-col items-center gap-3 p-4 border border-border hover:border-primary/50 transition-all hover:bg-secondary/40 disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px]"
                      style={{ borderColor: `${option.borderColor}30` }}
                    >
                      <div className="transition-transform group-hover:scale-110">
                        <PixelFace mood={option.key} size={56} />
                      </div>
                      <span
                        className="text-xs tracking-widest uppercase"
                        style={{ color: option.color }}
                      >
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
                {saving && (
                  <p className="text-center text-xs text-muted-foreground mt-6 tracking-wider">
                    Saving…
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ── Step 2: Confirmation + Tip ── */}
          {step === "saved" && selectedOption && (
            <div className="space-y-6">
              <div className="terminal-window">
                <div className="terminal-header">
                  <span className="text-xs text-muted-foreground tracking-wider">Logged</span>
                  <span className="w-2 h-2 bg-primary animate-pulse" />
                </div>
                <div className="p-8 flex flex-col items-center text-center gap-4">
                  <PixelFace mood={selectedOption.key} size={72} />
                  <div>
                    <p
                      className="font-heading text-2xl mb-2"
                      style={{ color: selectedOption.color }}
                    >
                      {selectedOption.label}
                    </p>
                    <p className="text-sm text-foreground leading-relaxed">{selectedOption.message}</p>
                  </div>
                </div>
              </div>

              <div className="terminal-window">
                <div className="terminal-header">
                  <span className="text-xs text-muted-foreground tracking-wider">Coping tips for right now</span>
                </div>
                <div className="p-6 space-y-3">
                  {selectedOption.tips.map((tip, i) => (
                    <div key={i} className="flex gap-3">
                      <span
                        className="w-5 h-5 border text-xs flex items-center justify-center shrink-0 mt-0.5"
                        style={{ borderColor: selectedOption.borderColor, color: selectedOption.color }}
                      >
                        {i + 1}
                      </span>
                      <p className="text-sm text-muted-foreground leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => setStep("chart")}
                  className="retro-btn px-6 py-2.5 text-xs tracking-widest"
                >
                  View my 7-day chart
                </button>
                <button
                  onClick={() => { setStep("select"); setSelectedMood(null) }}
                  className="retro-btn-outline px-6 py-2.5 text-xs tracking-widest inline-flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" strokeWidth={2} />
                  Check in again
                </button>
              </div>

              {(selectedOption.key === "low" || selectedOption.key === "struggling") && (
                <div className="border border-red-500/30 bg-red-500/5 p-4">
                  <p className="text-xs text-red-300 leading-relaxed">
                    If you&apos;re in crisis, please reach out. Text <strong>HOME</strong> to <strong>741741</strong> or call/text <strong>988</strong>. You&apos;re not alone.{" "}
                    <Link href="/crisis" className="underline hover:no-underline">
                      More resources →
                    </Link>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── Step 3: Chart ── */}
          {step === "chart" && (
            <div className="space-y-6">
              <div className="terminal-window">
                <div className="terminal-header">
                  <span className="text-xs text-muted-foreground tracking-wider">Your mood — last 7 days</span>
                </div>
                <div className="p-6">
                  {chartLoading ? (
                    <div className="h-48 flex items-center justify-center">
                      <p className="text-xs text-muted-foreground tracking-wider">Loading chart…</p>
                    </div>
                  ) : (
                    <div className="h-52">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="2 4" stroke="#2a3f4f" vertical={false} />
                          <XAxis
                            dataKey="date"
                            tick={{ fill: "#6b7f8c", fontSize: 10, fontFamily: "var(--font-serif)" }}
                            tickLine={false}
                            axisLine={{ stroke: "#2a3f4f" }}
                          />
                          <YAxis
                            domain={[1, 5]}
                            ticks={[1, 2, 3, 4, 5]}
                            tickFormatter={(v: number) => moodLabelMap[v] ?? ""}
                            tick={{ fill: "#6b7f8c", fontSize: 10, fontFamily: "var(--font-serif)" }}
                            tickLine={false}
                            axisLine={false}
                            width={72}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Line
                            type="stepAfter"
                            dataKey="value"
                            stroke="#a8d8c8"
                            strokeWidth={2}
                            dot={{ fill: "#a8d8c8", r: 4, strokeWidth: 0 }}
                            activeDot={{ fill: "#c8f8e8", r: 5, strokeWidth: 0 }}
                            connectNulls={false}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-4">
                    Empty days mean no check-in was logged. Try to check in daily for the best picture.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => { setStep("select"); setSelectedMood(null) }}
                  className="retro-btn px-6 py-2.5 text-xs tracking-widest inline-flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" strokeWidth={2} />
                  New check-in
                </button>
                <Link href="/resources" className="retro-btn-outline px-6 py-2.5 text-xs tracking-widest">
                  Resources
                </Link>
                <Link href="/tools/self-care-quiz" className="retro-btn-outline px-6 py-2.5 text-xs tracking-widest">
                  Take the self-care quiz
                </Link>
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  )
}
