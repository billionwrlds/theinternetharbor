"use client"

import { useState } from "react"
import { X, AlertTriangle } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { ensureProfileExists } from "@/lib/profile"
import { REPORT_REASONS, priorityForReason } from "@/lib/report-reasons"

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  type: "post" | "comment"
  itemId: string
}

export function ReportModal({ isOpen, onClose, type, itemId }: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState("")
  const [details, setDetails] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    setSubmitting(true)

    try {
      const supabase = createClient()
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        setSubmitError("You must be logged in to submit a report.")
        setSubmitting(false)
        return
      }

      await ensureProfileExists(user.id)

      const priority = priorityForReason(selectedReason)

      if (type === "post") {
        const { error: insertError } = await supabase.from("reports").insert({
          reporter_id: user.id,
          target_type: "post",
          post_id: itemId,
          reason: selectedReason,
          details: details.trim() || null,
          priority,
        })
        if (insertError) {
          setSubmitError(insertError.message)
          setSubmitting(false)
          return
        }
      } else {
        const { error: insertError } = await supabase.from("reports").insert({
          reporter_id: user.id,
          target_type: "comment",
          comment_id: itemId,
          reason: selectedReason,
          details: details.trim() || null,
          priority,
        })
        if (insertError) {
          setSubmitError(insertError.message)
          setSubmitting(false)
          return
        }
      }

      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        setSelectedReason("")
        setDetails("")
        onClose()
      }, 2000)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Could not submit report.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      {/* Modal */}
      <div className="terminal-window w-full max-w-md relative z-10">
        <div className="terminal-header">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <span className="text-xs text-muted-foreground tracking-wider">
              Report {type === "post" ? "Post" : "Comment"}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-primary/20 border border-primary mx-auto mb-4 flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <p className="text-foreground font-medium mb-1">Report Submitted</p>
              <p className="text-sm text-muted-foreground">Thank you for helping keep our community safe.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p className="text-sm text-muted-foreground mb-6">
                Help us understand what&apos;s wrong with this {type}. Your report is anonymous.
              </p>

              {submitError && (
                <div className="mb-4 border border-destructive/50 bg-destructive/10 p-3">
                  <p className="text-xs text-destructive tracking-wider">{submitError}</p>
                </div>
              )}

              {/* Reason Selection */}
              <div className="space-y-2 mb-6">
                {REPORT_REASONS.map((reason) => (
                  <label 
                    key={reason.id}
                    className={`flex items-center gap-3 p-3 border cursor-pointer transition-colors ${
                      selectedReason === reason.id
                        ? "border-primary bg-secondary"
                        : "border-border hover:border-muted-foreground"
                    }`}
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={reason.id}
                      checked={selectedReason === reason.id}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="sr-only"
                    />
                    <span className={`w-4 h-4 border flex items-center justify-center ${
                      selectedReason === reason.id ? "border-primary" : "border-muted-foreground"
                    }`}>
                      {selectedReason === reason.id && (
                        <span className="w-2 h-2 bg-primary" />
                      )}
                    </span>
                    <span className="text-sm text-foreground">{reason.label}</span>
                  </label>
                ))}
              </div>

              {/* Additional Details */}
              <div className="mb-6">
                <label className="block text-xs text-muted-foreground tracking-wider mb-2">
                  Additional Details (optional)
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Provide more context if needed..."
                  rows={3}
                  className="w-full bg-secondary border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary px-4 py-3 resize-none text-sm"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="retro-btn-outline flex-1 py-3 text-xs tracking-widest"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedReason || submitting}
                  className="retro-btn flex-1 py-3 text-xs tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting…" : "Submit Report"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
