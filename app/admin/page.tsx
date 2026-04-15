"use client"

import Link from "next/link"
import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { UserAvatar } from "@/components/user-avatar"
import { createClient } from "@/lib/supabase"
import { reportReasonLabel } from "@/lib/report-reasons"
import { Check, Flag, Users, X, Shield, RefreshCw } from "lucide-react"

type ProfileRow = {
  id: string
  username: string | null
  display_name: string | null
  avatar_url: string | null
  avatar_approved: boolean | null
  role: string | null
  created_at: string | null
}

type ReportRow = {
  id: string
  status: string
  priority: string
  reason: string
  details: string | null
  created_at: string
  target_type: string
  post_id: string | null
  comment_id: string | null
  posts: { id: string; title: string | null } | { id: string; title: string | null }[] | null
  comments:
    | {
        id: string
        body: string
        post_id: string
        posts: { id: string; title: string | null } | { id: string; title: string | null }[] | null
      }
    | {
        id: string
        body: string
        post_id: string
        posts: { id: string; title: string | null } | { id: string; title: string | null }[] | null
      }[]
    | null
}

export default function AdminDashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [pendingAvatars, setPendingAvatars] = useState<ProfileRow[]>([])
  const [reports, setReports] = useState<ReportRow[]>([])
  const [users, setUsers] = useState<ProfileRow[]>([])

  const labelFor = (p: ProfileRow) => p.display_name || p.username || "Member"

  const postTitleFor = (r: ReportRow) => {
    const post = Array.isArray(r.posts) ? r.posts[0] : r.posts
    if (r.target_type === "post") return post?.title || "(untitled or deleted)"
    const c = Array.isArray(r.comments) ? r.comments[0] : r.comments
    const nestedPost = c?.posts
    const p = Array.isArray(nestedPost) ? nestedPost[0] : nestedPost
    return p?.title || "(untitled or deleted)"
  }

  const threadHrefFor = (r: ReportRow) => {
    if (r.target_type === "post" && r.post_id) return `/forums/thread/${r.post_id}`
    const c = Array.isArray(r.comments) ? r.comments[0] : r.comments
    if (c?.post_id) return `/forums/thread/${c.post_id}`
    return "/forums"
  }

  const stats = useMemo(() => {
    return {
      pendingAvatars: pendingAvatars.length,
      pendingReports: reports.length,
      users: users.length,
    }
  }, [pendingAvatars.length, reports.length, users.length])

  async function ensureAdminOrRedirect(supabase: ReturnType<typeof createClient>) {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      router.replace("/login")
      return null
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle()

    if (profileError) {
      setError(profileError.message)
      router.replace("/forums")
      return null
    }

    if ((profile as { role?: string } | null)?.role !== "admin") {
      router.replace("/forums")
      return null
    }

    return user.id
  }

  async function loadAll() {
    setError(null)
    setLoading(true)
    const supabase = createClient()
    const adminId = await ensureAdminOrRedirect(supabase)
    if (!adminId) return

    const [pendingRes, reportsRes, usersRes] = await Promise.all([
      supabase
        .from("profiles")
        .select("id,username,display_name,avatar_url,avatar_approved,role,created_at")
        .eq("avatar_approved", false)
        .not("avatar_url", "is", null)
        .order("created_at", { ascending: true })
        .limit(50),
      supabase
        .from("reports")
        .select(
          `
          id,
          status,
          priority,
          reason,
          details,
          created_at,
          target_type,
          post_id,
          comment_id,
          posts!reports_post_id_fkey ( id, title ),
          comments!reports_comment_id_fkey ( id, body, post_id, posts ( id, title ) )
        `
        )
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(50),
      supabase
        .from("profiles")
        .select("id,username,display_name,avatar_url,avatar_approved,role,created_at")
        .order("created_at", { ascending: false })
        .limit(200),
    ])

    if (pendingRes.error) setError(pendingRes.error.message)
    if (reportsRes.error) setError(reportsRes.error.message)
    if (usersRes.error) setError(usersRes.error.message)

    setPendingAvatars((pendingRes.data ?? []) as ProfileRow[])
    setReports((reportsRes.data ?? []) as ReportRow[])
    setUsers((usersRes.data ?? []) as ProfileRow[])
    setLoading(false)
  }

  useEffect(() => {
    void loadAll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function approveAvatar(userId: string) {
    setBusy(true)
    setError(null)
    try {
      const supabase = createClient()
      const adminId = await ensureAdminOrRedirect(supabase)
      if (!adminId) return
      const { error: updError } = await supabase
        .from("profiles")
        .update({ avatar_approved: true })
        .eq("id", userId)
      if (updError) throw new Error(updError.message)
      await loadAll()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not approve avatar.")
    } finally {
      setBusy(false)
    }
  }

  async function rejectAvatar(userId: string) {
    setBusy(true)
    setError(null)
    try {
      const supabase = createClient()
      const adminId = await ensureAdminOrRedirect(supabase)
      if (!adminId) return
      const { error: updError } = await supabase
        .from("profiles")
        .update({ avatar_approved: false, avatar_url: null })
        .eq("id", userId)
      if (updError) throw new Error(updError.message)
      await loadAll()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not reject avatar.")
    } finally {
      setBusy(false)
    }
  }

  async function dismissReport(reportId: string) {
    setBusy(true)
    setError(null)
    try {
      const supabase = createClient()
      const adminId = await ensureAdminOrRedirect(supabase)
      if (!adminId) return
      const { error: updError } = await supabase
        .from("reports")
        .update({ status: "dismissed" })
        .eq("id", reportId)
      if (updError) throw new Error(updError.message)
      await loadAll()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not dismiss report.")
    } finally {
      setBusy(false)
    }
  }

  async function removeReportedContent(r: ReportRow) {
    setBusy(true)
    setError(null)
    try {
      const supabase = createClient()
      const adminId = await ensureAdminOrRedirect(supabase)
      if (!adminId) return

      if (r.target_type === "post" && r.post_id) {
        const { error: delError } = await supabase.from("posts").delete().eq("id", r.post_id)
        if (delError) throw new Error(delError.message)
      }

      if (r.target_type === "comment" && r.comment_id) {
        const { error: delError } = await supabase.from("comments").delete().eq("id", r.comment_id)
        if (delError) throw new Error(delError.message)
      }

      const { error: updError } = await supabase
        .from("reports")
        .update({ status: "resolved" })
        .eq("id", r.id)
      if (updError) throw new Error(updError.message)

      await loadAll()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not remove content.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-background">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-xs text-primary tracking-wider">Admin</span>
              </div>
              <h1 className="font-heading text-3xl md:text-4xl text-foreground">Dashboard</h1>
              <p className="text-xs text-muted-foreground tracking-wider mt-1">
                Moderate avatars and reported content
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/admin/reports"
                className="retro-btn-outline px-4 py-2 text-xs tracking-widest"
              >
                Full reports page
              </Link>
              <button
                type="button"
                onClick={() => void loadAll()}
                disabled={busy}
                className="retro-btn-outline px-4 py-2 text-xs tracking-widest flex items-center gap-2 disabled:opacity-60"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>

          {error && (
            <div className="terminal-window mb-6">
              <div className="p-4">
                <p className="text-xs text-destructive">{error}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: "Pending Avatars", value: String(stats.pendingAvatars) },
              { label: "Pending Reports", value: String(stats.pendingReports) },
              { label: "Users", value: String(stats.users) },
            ].map((s) => (
              <div key={s.label} className="terminal-window">
                <div className="p-4 text-center">
                  <p className="font-heading text-2xl text-primary">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {loading && <p className="text-xs text-muted-foreground mb-4">Loading…</p>}

          <div className="space-y-8">
            {/* Pending avatar approvals */}
            <section className="terminal-window">
              <div className="terminal-header">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground tracking-wider">Pending avatar approvals</span>
                </div>
                <span className="text-xs text-muted-foreground">{pendingAvatars.length}</span>
              </div>
              <div className="p-5">
                {pendingAvatars.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No pending avatars.</p>
                ) : (
                  <div className="space-y-3">
                    {pendingAvatars.map((p) => (
                      <div
                        key={p.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-border bg-secondary/40 p-3"
                      >
                        <div className="flex items-center gap-3">
                          <UserAvatar
                            avatarUrl={p.avatar_url}
                            avatarApproved={p.avatar_approved ?? false}
                            size="w-10 h-10"
                          />
                          <div>
                            <p className="text-sm text-foreground">{labelFor(p)}</p>
                            <p className="text-xs text-muted-foreground">{p.id.slice(0, 8)}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => void approveAvatar(p.id)}
                            className="retro-btn px-4 py-2 text-xs tracking-widest disabled:opacity-60"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => void rejectAvatar(p.id)}
                            className="retro-btn-outline px-4 py-2 text-xs tracking-widest text-muted-foreground disabled:opacity-60"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Reported posts queue */}
            <section className="terminal-window">
              <div className="terminal-header">
                <div className="flex items-center gap-2">
                  <Flag className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground tracking-wider">Reported content queue</span>
                </div>
                <span className="text-xs text-muted-foreground">{reports.length}</span>
              </div>
              <div className="p-5">
                {reports.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No pending reports.</p>
                ) : (
                  <div className="space-y-3">
                    {reports.map((r) => (
                      <div key={r.id} className="border border-border bg-secondary/40 p-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-xs text-muted-foreground mb-1">
                              {reportReasonLabel(r.reason)} · {formatDistanceToNow(new Date(r.created_at), { addSuffix: true })}
                            </p>
                            <Link
                              href={threadHrefFor(r)}
                              className="text-sm text-foreground hover:text-primary transition-colors font-heading block truncate"
                            >
                              {postTitleFor(r)}
                            </Link>
                            {r.details?.trim() && (
                              <p className="text-xs text-muted-foreground mt-2">
                                <span className="text-foreground">Reporter notes:</span> {r.details}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-2 shrink-0">
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => void removeReportedContent(r)}
                              className="retro-btn px-4 py-2 text-xs tracking-widest disabled:opacity-60"
                            >
                              Delete
                            </button>
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => void dismissReport(r.id)}
                              className="retro-btn-outline px-4 py-2 text-xs tracking-widest text-muted-foreground disabled:opacity-60"
                            >
                              Dismiss
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Users list */}
            <section className="terminal-window">
              <div className="terminal-header">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground tracking-wider">All users</span>
                </div>
                <span className="text-xs text-muted-foreground">{users.length}</span>
              </div>
              <div className="p-5">
                {users.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No users found.</p>
                ) : (
                  <div className="space-y-2">
                    {users.map((u) => (
                      <div key={u.id} className="flex items-center justify-between gap-3 border border-border bg-secondary/40 p-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <UserAvatar
                            avatarUrl={u.avatar_url}
                            avatarApproved={u.avatar_approved ?? false}
                            size="w-9 h-9"
                          />
                          <div className="min-w-0">
                            <p className="text-sm text-foreground truncate">
                              {labelFor(u)}{" "}
                              {(u.role ?? "user") === "admin" && (
                                <span className="text-xs text-primary ml-2">admin</span>
                              )}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {u.username ? `@${u.username}` : u.id.slice(0, 8)}{" "}
                              {u.created_at ? `· joined ${formatDistanceToNow(new Date(u.created_at), { addSuffix: true })}` : ""}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          disabled
                          className="retro-btn-outline px-3 py-2 text-xs tracking-widest text-muted-foreground opacity-60 cursor-not-allowed"
                          title="Role management not in scope"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

