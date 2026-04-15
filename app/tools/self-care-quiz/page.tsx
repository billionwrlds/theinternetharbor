"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowLeft, ArrowRight, RefreshCw, CheckCircle } from "lucide-react"

// ─── Quiz Data ────────────────────────────────────────────────────────
interface QuizOption {
  label: string
  score: number
}

interface QuizQuestion {
  id: string
  icon: string
  category: string
  question: string
  options: QuizOption[]
}

const questions: QuizQuestion[] = [
  {
    id: "sleep",
    icon: "🌙",
    category: "Sleep",
    question: "How many hours of sleep did you get last night?",
    options: [
      { label: "Less than 5 hours", score: 1 },
      { label: "5–6 hours", score: 2 },
      { label: "7–8 hours", score: 4 },
      { label: "More than 8 hours", score: 3 },
    ],
  },
  {
    id: "eating",
    icon: "🍽",
    category: "Nutrition",
    question: "How would you describe your eating today?",
    options: [
      { label: "I skipped meals", score: 1 },
      { label: "Mostly snacks or fast food", score: 2 },
      { label: "Balanced — some real meals", score: 3 },
      { label: "Mindful and nourishing", score: 4 },
    ],
  },
  {
    id: "social",
    icon: "💬",
    category: "Connection",
    question: "Have you connected with someone today?",
    options: [
      { label: "No contact with anyone", score: 1 },
      { label: "Texted or messaged online", score: 2 },
      { label: "Phone or video call", score: 3 },
      { label: "In-person quality time", score: 4 },
    ],
  },
  {
    id: "exercise",
    icon: "🏃",
    category: "Movement",
    question: "Did you move your body today?",
    options: [
      { label: "Not at all", score: 1 },
      { label: "Light stretching or walking around", score: 2 },
      { label: "A walk or light exercise", score: 3 },
      { label: "A full workout or active session", score: 4 },
    ],
  },
  {
    id: "stress",
    icon: "🧘",
    category: "Stress",
    question: "How would you rate your stress level today?",
    options: [
      { label: "Overwhelming — I can't cope", score: 1 },
      { label: "High — it's weighing on me", score: 2 },
      { label: "Manageable — I'm handling it", score: 3 },
      { label: "Low — I feel calm and in control", score: 4 },
    ],
  },
]

// ─── Result Tiers ─────────────────────────────────────────────────────
interface ResultTier {
  min: number
  max: number
  label: string
  tagline: string
  color: string
  borderColor: string
  suggestions: string[]
}

const resultTiers: ResultTier[] = [
  {
    min: 5,
    max: 10,
    label: "Time to Recharge",
    tagline: "Your body and mind are asking for some extra care right now.",
    color: "#ff9966",
    borderColor: "rgba(255,153,102,0.4)",
    suggestions: [
      "Prioritize sleep tonight — aim for 7–8 hours if you can manage it.",
      "Eat one nourishing meal today, even if it's simple. Fuel matters.",
      "Try the 5-4-3-2-1 grounding technique to reduce stress in the moment: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.",
      "Reach out to one person today — even a short text counts as connection.",
      "Be gentle with yourself. You're doing the best you can with what you have.",
    ],
  },
  {
    min: 11,
    max: 15,
    label: "You're Doing Okay",
    tagline: "You've got a decent foundation. There's room to add one more good thing.",
    color: "#c8b88a",
    borderColor: "rgba(200,184,138,0.4)",
    suggestions: [
      "You're maintaining well — protect that by keeping one consistent sleep time this week.",
      "Add a 10-minute walk or stretch today. Small movement compounds over time.",
      "Write down one thing you're genuinely proud of from this week.",
      "Check in with a friend or someone you care about — connection strengthens what you're building.",
      "Consider trying a 5-minute mindfulness practice before bed. Apps like Insight Timer are free.",
    ],
  },
  {
    min: 16,
    max: 20,
    label: "You're Thriving",
    tagline: "You're showing up well for yourself — that's genuinely worth celebrating.",
    color: "#a8d8c8",
    borderColor: "rgba(168,216,200,0.4)",
    suggestions: [
      "Notice what's working and name it. Your habits are serving you right now.",
      "Consider sharing your approach with someone who might need encouragement.",
      "This is a great time to try something new — a class, a creative project, or a new routine.",
      "Help someone else today. Giving has its own wellbeing benefits.",
      "Keep checking in daily — awareness is what sustains thriving over time.",
    ],
  },
]

function getResult(total: number): ResultTier {
  return resultTiers.find((t) => total >= t.min && total <= t.max) ?? resultTiers[0]
}

// ─── Progress Bar ─────────────────────────────────────────────────────
function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100)
  return (
    <div className="w-full">
      <div className="flex justify-between mb-1.5">
        <span className="text-xs text-muted-foreground tracking-wider">
          Question {current} of {total}
        </span>
        <span className="text-xs text-primary">{pct}%</span>
      </div>
      <div className="h-1.5 bg-secondary border border-border overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────
export default function SelfCareQuizPage() {
  const [step, setStep] = useState<"intro" | "quiz" | "results">("intro")
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selected, setSelected] = useState<number | null>(null)

  const totalScore = answers.reduce((sum, s) => sum + s, 0)
  const result = getResult(totalScore)
  const question = questions[currentQ]

  const handleAnswer = (score: number) => {
    setSelected(score)
  }

  const handleNext = () => {
    if (selected === null) return
    const newAnswers = [...answers, selected]
    setAnswers(newAnswers)
    setSelected(null)

    if (currentQ < questions.length - 1) {
      setCurrentQ(currentQ + 1)
    } else {
      setStep("results")
    }
  }

  const handleReset = () => {
    setStep("intro")
    setCurrentQ(0)
    setAnswers([])
    setSelected(null)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-background">
        <div className="max-w-xl mx-auto px-4 py-12">

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
              <span className="text-xs tracking-[0.2em] text-muted-foreground uppercase">Wellness Tool</span>
            </div>
            <h1 className="font-heading text-3xl md:text-4xl text-foreground mb-2">Self-Care Quiz</h1>
            <p className="text-sm text-muted-foreground">5 quick questions. A personalized snapshot of your wellbeing today.</p>
          </div>

          {/* ── Intro ── */}
          {step === "intro" && (
            <div className="terminal-window">
              <div className="terminal-header">
                <span className="text-xs text-muted-foreground tracking-wider">About this quiz</span>
              </div>
              <div className="p-8">
                <div className="space-y-4 mb-8">
                  {questions.map((q, i) => (
                    <div key={q.id} className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="w-7 h-7 border border-border flex items-center justify-center text-xs text-primary shrink-0">
                        {i + 1}
                      </span>
                      <span>
                        <span className="text-foreground">{q.category}</span>{" "}
                        — {q.question}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mb-8 leading-relaxed">
                  No data is saved. This is just for you — a quick moment of self-awareness.
                  Answer honestly for the most helpful results.
                </p>
                <button
                  onClick={() => setStep("quiz")}
                  className="retro-btn px-8 py-3 text-xs tracking-widest inline-flex items-center gap-2"
                >
                  Start Quiz
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
                </button>
              </div>
            </div>
          )}

          {/* ── Quiz ── */}
          {step === "quiz" && question && (
            <div className="space-y-6">
              <ProgressBar current={currentQ + 1} total={questions.length} />

              <div className="terminal-window">
                <div className="terminal-header">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{question.icon}</span>
                    <span className="text-xs text-muted-foreground tracking-wider uppercase">{question.category}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{currentQ + 1}/{questions.length}</span>
                </div>
                <div className="p-6">
                  <h2 className="font-heading text-xl text-foreground mb-6 leading-snug">
                    {question.question}
                  </h2>
                  <div className="space-y-3">
                    {question.options.map((option) => (
                      <button
                        key={option.label}
                        onClick={() => handleAnswer(option.score)}
                        className={`w-full text-left px-4 py-3.5 border text-sm transition-all ${
                          selected === option.score
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border hover:border-primary/50 hover:bg-secondary/40 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-4 h-4 border flex items-center justify-center shrink-0 transition-colors ${
                              selected === option.score ? "border-primary bg-primary" : "border-border"
                            }`}
                          >
                            {selected === option.score && (
                              <span className="w-2 h-2 bg-primary-foreground" />
                            )}
                          </span>
                          {option.label}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => {
                    if (currentQ > 0) {
                      setCurrentQ(currentQ - 1)
                      const prev = answers[currentQ - 1]
                      setAnswers(answers.slice(0, currentQ - 1))
                      setSelected(prev ?? null)
                    } else {
                      handleReset()
                    }
                  }}
                  className="retro-btn-outline px-5 py-2.5 text-xs tracking-widest"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={selected === null}
                  className="retro-btn px-6 py-2.5 text-xs tracking-widest inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {currentQ < questions.length - 1 ? "Next" : "See Results"}
                  <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
                </button>
              </div>
            </div>
          )}

          {/* ── Results ── */}
          {step === "results" && (
            <div className="space-y-6">
              {/* Score card */}
              <div
                className="terminal-window"
                style={{ borderColor: result.borderColor }}
              >
                <div
                  className="terminal-header"
                  style={{
                    background: `linear-gradient(to bottom, ${result.color}18, ${result.color}08)`,
                    borderColor: result.borderColor,
                  }}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" style={{ color: result.color }} strokeWidth={2} />
                    <span className="text-xs tracking-wider uppercase" style={{ color: result.color }}>
                      Your Results
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{totalScore} / 20</span>
                </div>
                <div className="p-8 text-center">
                  {/* Score bar */}
                  <div className="mb-6">
                    <div className="h-2 bg-secondary border border-border overflow-hidden mb-2">
                      <div
                        className="h-full transition-all duration-700"
                        style={{
                          width: `${(totalScore / 20) * 100}%`,
                          backgroundColor: result.color,
                        }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Recharge</span>
                      <span>Okay</span>
                      <span>Thriving</span>
                    </div>
                  </div>

                  <h2 className="font-heading text-3xl mb-3" style={{ color: result.color }}>
                    {result.label}
                  </h2>
                  <p className="text-sm text-foreground leading-relaxed">{result.tagline}</p>
                </div>
              </div>

              {/* Category breakdown */}
              <div className="terminal-window">
                <div className="terminal-header">
                  <span className="text-xs text-muted-foreground tracking-wider uppercase">Your answers</span>
                </div>
                <div className="p-4 space-y-2">
                  {questions.map((q, i) => {
                    const score = answers[i] ?? 0
                    const option = q.options.find((o) => o.score === score)
                    return (
                      <div key={q.id} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                        <span className="text-base w-6 text-center">{q.icon}</span>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs text-muted-foreground">{q.category}</span>
                          <p className="text-xs text-foreground truncate">{option?.label ?? "—"}</p>
                        </div>
                        <div className="flex gap-0.5 shrink-0">
                          {[1, 2, 3, 4].map((dot) => (
                            <span
                              key={dot}
                              className="w-2 h-2"
                              style={{ background: dot <= score ? result.color : "#2a3f4f" }}
                            />
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Suggestions */}
              <div className="terminal-window">
                <div className="terminal-header">
                  <span className="text-xs text-muted-foreground tracking-wider uppercase">Personalized suggestions</span>
                </div>
                <div className="p-6 space-y-4">
                  {result.suggestions.map((tip, i) => (
                    <div key={i} className="flex gap-3">
                      <span
                        className="w-5 h-5 border text-xs flex items-center justify-center shrink-0 mt-0.5"
                        style={{ borderColor: result.borderColor, color: result.color }}
                      >
                        {i + 1}
                      </span>
                      <p className="text-sm text-muted-foreground leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={handleReset}
                  className="retro-btn px-6 py-2.5 text-xs tracking-widest inline-flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" strokeWidth={2} />
                  Take again
                </button>
                <Link href="/tools/mood-check" className="retro-btn-outline px-6 py-2.5 text-xs tracking-widest">
                  Mood check-in
                </Link>
                <Link href="/resources" className="retro-btn-outline px-6 py-2.5 text-xs tracking-widest">
                  Resources
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
