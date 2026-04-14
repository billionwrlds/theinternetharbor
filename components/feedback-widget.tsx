"use client"

import { useEffect, useMemo, useState } from "react"
import { X, MessageSquare } from "lucide-react"
import { createClient } from "@/lib/supabase"

export function FeedbackWidget() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSubmit = useMemo(() => message.trim().length > 0 && !submitting, [message, submitting])

  useEffect(() => {
    if (open) {
      setSubmitted(false)
      setError(null)
      setSubmitting(false)
    }
  }, [open])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const body = message.trim()
    if (!body) {
      setError("Please enter a message.")
      return
    }

    setSubmitting(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const { error: insertError } = await supabase.from("feedback").insert({
        user_id: user?.id ?? null,
        name: name.trim() || null,
        message: body,
      })

      if (insertError) {
        setError(insertError.message)
        setSubmitting(false)
        return
      }

      setSubmitted(true)
      setName("")
      setMessage("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit feedback.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-[55] retro-btn px-4 py-3 text-xs tracking-widest flex items-center gap-2 shadow-md"
      >
        <MessageSquare className="w-4 h-4" strokeWidth={2} />
        Give Feedback
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)} />

          <div className="terminal-window w-full max-w-md relative z-10">
            <div className="terminal-header">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" strokeWidth={2} />
                <span className="text-xs text-muted-foreground tracking-wider">Feedback</span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>

            <div className="p-6">
              {submitted ? (
                <div className="text-center py-6">
                  <p className="text-foreground font-medium mb-1">Thanks for the feedback.</p>
                  <p className="text-sm text-muted-foreground">
                    We read every message and use them to improve the beta.
                  </p>
                </div>
              ) : (
                <form onSubmit={(e) => void submit(e)} className="space-y-4">
                  {error && (
                    <div className="border border-destructive/50 bg-destructive/10 p-3">
                      <p className="text-xs text-destructive tracking-wider">{error}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs text-muted-foreground tracking-wider mb-2">
                      Name (optional)
                    </label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-secondary border border-border text-foreground focus:outline-none focus:border-primary px-4 py-3 text-sm"
                      placeholder="Captain Anonymous"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-muted-foreground tracking-wider mb-2">
                      Message
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-secondary border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary px-4 py-3 resize-none text-sm"
                      placeholder="What should we fix or build next?"
                      rows={5}
                      required
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="retro-btn-outline flex-1 py-3 text-xs tracking-widest"
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="retro-btn flex-1 py-3 text-xs tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!canSubmit}
                    >
                      {submitting ? "Submitting…" : "Submit"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

