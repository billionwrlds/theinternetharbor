"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { formatDistanceToNow, startOfDay, startOfWeek } from "date-fns"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Flag, Eye, Check, X, AlertTriangle, Clock, Filter } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { reportReasonLabel } from "@/lib/report-reasons"

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
  reviewed: "bg-blue-500/20 text-blue-400 border-blue-500/50",
  resolved: "bg-green-500/20 text-green-400 border-green-500/50",
  dismissed: "bg-muted-foreground/20 text-muted-foreground border-muted-foreground/50",
}

const priorityColors: Record<string, string> = {
  high: "text-red-400",
  medium: "text-yellow-400",
  low: "text-muted-foreground",
}

type ReportRow = {
  id: string
  status: string
  priority: string
  reason: string
  details: string | null
  created_at: string
  updated_at: string
  target_type: string
  post_id: string | null
  comment_id: string | null
  profiles:
    | { username: string | null; display_name: string | null }
    | { username: string | null; display_name: string | null }[]
    | null
  posts: { title: string } | { title: string }[] | null
  comments:
    | {
        body: string
        post_id: string
        posts: { title: string } | { title: string }[] | null
      }
    | {
        body: string
        post_id: string
        posts: { title: string } | { title: string }[] | null
      }[]
    | null
}

export default function AdminReportsPage() {
  const router = useRouter()
  const [reports, setReports] = useState<ReportRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (cancelled) return
      if (!user) {
        router.replace("/login")
        return
      }

      const { data, error } = await supabase
        .from("reports")
        .select(
          `
          id,
          status,
          priority,
          reason,
          details,
          created_at,
          updated_at,
          target_type,
          post_id,
          comment_id,
          profiles!reports_reporter_id_fkey ( username, display_name ),
          posts!reports_post_id_fkey ( title ),
          comments!reports_comment_id_fkey ( body, post_id, posts ( title ) )
        `
        )
        .order("created_at", { ascending: false })

      if (cancelled) return
      if (!error && data) {
        setReports(data as ReportRow[])
      } else {
        setReports([])
      }
      setLoading(false)
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [router])

  const stats = useMemo(() => {
    const now = new Date()
    const todayStart = startOfDay(now)
    const weekStart = startOfWeek(now, { weekStartsOn: 1 })
    let pending = 0
    let reviewedToday = 0
    let resolvedWeek = 0
    let sumHours = 0
    let sumCount = 0

    for (const r of reports) {
      if (r.status === "pending") pending += 1
      const updated = new Date(r.updated_at)
      if (r.status === "reviewed" && updated >= todayStart) reviewedToday += 1
      if (r.status === "resolved" && updated >= weekStart) resolvedWeek += 1
      if (r.status !== "pending") {
        const created = new Date(r.created_at).getTime()
        const upd = updated.getTime()
        if (upd > created) {
          sumHours += (upd - created) / (1000 * 60 * 60)
          sumCount += 1
        }
      }
    }

    const avgHours = sumCount > 0 ? sumHours / sumCount : null

    return {
      pending,
      reviewedToday,
      resolvedWeek,
      avgHours,
    }
  }, [reports])

  const displayPostTitle = (r: ReportRow) => {
    const postRow = Array.isArray(r.posts) ? r.posts[0] : r.posts
    if (r.target_type === "post" && postRow?.title) return postRow.title
    const c = Array.isArray(r.comments) ? r.comments[0] : r.comments
    const p = c?.posts
    const nestedPost = Array.isArray(p) ? p[0] : p
    if (nestedPost?.title) return nestedPost.title
    return "(untitled or deleted)"
  }

  const threadHref = (r: ReportRow) => {
    if (r.target_type === "post" && r.post_id) return `/forums/thread/${r.post_id}`
    const c = Array.isArray(r.comments) ? r.comments[0] : r.comments
    if (c?.post_id) return `/forums/thread/${c.post_id}`
    return r.post_id ? `/forums/thread/${r.post_id}` : "/forums"
  }

  const reportedByLabel = (r: ReportRow) => {
    const p = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles
    return p?.display_name || p?.username || "member"
  }

  const flaggedBody = (r: ReportRow) => {
    if (r.details?.trim()) return r.details
    if (r.target_type === "comment") {
      const c = Array.isArray(r.comments) ? r.comments[0] : r.comments
      if (c?.body) return c.body
    }
    return "—"
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-background">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Flag className="w-5 h-5 text-primary" />
                <span className="text-xs text-primary tracking-wider">Admin Panel</span>
              </div>
              <h1 className="font-heading text-3xl md:text-4xl text-foreground">Reported Content</h1>
              <p className="text-xs text-muted-foreground tracking-wider mt-1">
                Review and moderate flagged posts and comments
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {stats.pending} pending
              </span>
              <button className="retro-btn-outline px-4 py-2 text-xs tracking-widest flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Pending", value: String(stats.pending), color: "text-yellow-400" },
              { label: "Reviewed Today", value: String(stats.reviewedToday), color: "text-blue-400" },
              { label: "Resolved This Week", value: String(stats.resolvedWeek), color: "text-green-400" },
              {
                label: "Avg Response Time",
                value: stats.avgHours !== null ? `${stats.avgHours.toFixed(1)}h` : "—",
                color: "text-primary",
              },
            ].map((stat, index) => (
              <div key={index} className="terminal-window">
                <div className="p-4 text-center">
                  <p className={`font-heading text-2xl ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {loading && <p className="text-xs text-muted-foreground mb-4">Loading…</p>}

          {/* Reports List */}
          <div className="space-y-4">
            {!loading && reports.length === 0 && (
              <p className="text-sm text-muted-foreground">No reports yet.</p>
            )}
            {reports.map((report) => (
              <div key={report.id} className="terminal-window">
                <div className="terminal-header">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{String(report.id).slice(0, 8)}</span>
                    <span className={`px-2 py-0.5 text-xs border ${statusColors[report.status] ?? statusColors.pending}`}>
                      {report.status.toUpperCase()}
                    </span>
                    <span className={`flex items-center gap-1 text-xs ${priorityColors[report.priority] ?? priorityColors.low}`}>
                      <AlertTriangle className="w-3 h-3" />
                      {report.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Report Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="tag">{reportReasonLabel(report.reason)}</span>
                        <span className="text-xs text-muted-foreground">reported by {reportedByLabel(report)}</span>
                      </div>
                      <Link 
                        href={threadHref(report)}
                        className="font-heading text-lg text-foreground hover:text-primary transition-colors block mb-2"
                      >
                        {displayPostTitle(report)}
                      </Link>
                      <p className="text-sm text-muted-foreground mb-4">
                        <strong className="text-foreground">Reporter notes:</strong>{" "}
                        {report.details?.trim() || "—"}
                      </p>
                      <div className="bg-secondary border border-border p-4">
                        <p className="text-xs text-muted-foreground mb-1">Flagged Content:</p>
                        <p className="text-sm text-foreground">{flaggedBody(report)}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="lg:w-48 shrink-0 flex lg:flex-col gap-2">
                      <Link
                        href={threadHref(report)}
                        className="retro-btn-outline flex-1 lg:flex-none px-4 py-2.5 text-xs tracking-wider flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Post
                      </Link>
                      <button className="retro-btn flex-1 lg:flex-none px-4 py-2.5 text-xs tracking-wider flex items-center justify-center gap-2">
                        <Check className="w-4 h-4" />
                        Remove Content
                      </button>
                      <button className="retro-btn-outline flex-1 lg:flex-none px-4 py-2.5 text-xs tracking-wider flex items-center justify-center gap-2 text-muted-foreground">
                        <X className="w-4 h-4" />
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="flex justify-center mt-8">
            <button className="retro-btn-outline px-6 py-2.5 text-xs tracking-widest">
              Load More Reports
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
