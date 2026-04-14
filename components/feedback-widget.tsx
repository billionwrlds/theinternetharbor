"use client"

import { useEffect, useRef, useState } from "react"
import { MessageSquare, X } from "lucide-react"
import { createClient } from "@/lib/supabase"

export function FeedbackWidget() {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const firstFieldRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setSubmitted(false)
      setError(null)
      setSubmitting(false)
      setName("")
      setMessage("")
      setTimeout(() => firstFieldRef.current?.focus(), 0)
    }
  }, [open])

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const trimmed = message.trim()
    if (!trimmed) {
      setError("Message is required.")
      return
    }

    setSubmitting(true)
    try {
      const supabase = createClient()
      const { error: insertError } = await supabase
        .from("feedback")
        .insert(
          {
            name: name.trim() || null,
            message: trimmed,
            page_path: typeof window !== "undefined" ? window.location.pathname : null,
          },
          // Avoid requiring SELECT policy for inserted rows.
          { returning: "minimal" }
        )

      if (insertError) {
        setError(insertError.message)
        return
      }

      setSubmitted(true)
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
        className="fixed bottom-24 right-6 z-[70] retro-btn px-4 py-3 text-xs tracking-widest flex items-center gap-2"
      >
        <MessageSquare className="w-4 h-4" strokeWidth={2} />
        Give Feedback
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Modal */}
          <div className="terminal-window w-full max-w-md relative z-10">
            <div className="terminal-header">
              <span className="text-xs text-muted-foreground tracking-wider">Feedback</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" strokeWidth={2} />
              </button>
            </div>

            <div className="p-6">
              {submitted ? (
                <div className="text-center py-8">
                  <p className="text-foreground font-medium mb-1">Thank you!</p>
                  <p className="text-sm text-muted-foreground">
                    We got your feedback. Thanks for helping improve The Internet Harbor.
                  </p>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="retro-btn-outline mt-6 px-6 py-2.5 text-xs tracking-widest"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="space-y-4">
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
                      ref={firstFieldRef}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-secondary border border-border text-foreground focus:outline-none focus:border-primary px-4 py-3"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-muted-foreground tracking-wider mb-2">
                      Message
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      className="w-full bg-secondary border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary px-4 py-3 resize-none text-sm"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="retro-btn px-6 py-2.5 text-xs tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
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

