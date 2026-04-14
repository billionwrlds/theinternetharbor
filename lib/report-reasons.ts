export const REPORT_REASONS = [
  { id: "spam", label: "Spam or misleading" },
  { id: "harassment", label: "Harassment or bullying" },
  { id: "harmful", label: "Harmful or dangerous content" },
  { id: "personal", label: "Sharing personal information" },
  { id: "inappropriate", label: "Inappropriate content" },
  { id: "other", label: "Other" },
] as const

export function reportReasonLabel(id: string): string {
  return REPORT_REASONS.find((r) => r.id === id)?.label ?? id
}

export function priorityForReason(reason: string): "high" | "medium" | "low" {
  if (reason === "harassment" || reason === "harmful") return "high"
  if (reason === "spam" || reason === "inappropriate") return "medium"
  return "low"
}
