"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { format } from "date-fns"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Reply, MoreHorizontal, Plus, Flag } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { ensureProfileExists } from "@/lib/profile"
import { ReactionButton } from "@/components/reaction-button"
import { ReportModal } from "@/components/report-modal"

type PostRow = {
  id: string
  title: string
  body: string
  created_at: string | null
  is_anonymous: boolean
  categories: { name: string | null } | { name: string | null }[] | null
  profiles: { username: string | null; display_name: string | null } | { username: string | null; display_name: string | null }[] | null
}

type CommentRow = {
  id: string
  body: string
  created_at: string | null
  profiles: { username: string | null; display_name: string | null } | { username: string | null; display_name: string | null }[] | null
}

async function loadReactionAggregates(
  supabase: ReturnType<typeof createClient>,
  postId: string,
  commentIds: string[],
  userId: string | undefined
) {
  const { count: postLikes } = await supabase
    .from("reactions")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId)
    .eq("target", "post")

  const commentCounts: Record<string, number> = {}
  if (commentIds.length > 0) {
    const { data: reactionRows } = await supabase
      .from("reactions")
      .select("comment_id")
      .eq("target", "comment")
      .in("comment_id", commentIds)

    for (const row of reactionRows ?? []) {
      if (row.comment_id) {
        commentCounts[row.comment_id] = (commentCounts[row.comment_id] ?? 0) + 1
      }
    }
  }

  let postLiked = false
  const commentLiked: Record<string, boolean> = {}
  if (userId) {
    const { data: pr } = await supabase
      .from("reactions")
      .select("id")
      .eq("user_id", userId)
      .eq("post_id", postId)
      .eq("target", "post")
      .maybeSingle()
    postLiked = !!pr
    if (commentIds.length > 0) {
      const { data: crs } = await supabase
        .from("reactions")
        .select("comment_id")
        .eq("user_id", userId)
        .eq("target", "comment")
        .in("comment_id", commentIds)
      for (const row of crs ?? []) {
        if (row.comment_id) commentLiked[row.comment_id] = true
      }
    }
  }

  return { postLikes: postLikes ?? 0, commentCounts, postLiked, commentLiked }
}

export default function ThreadPage() {
  const params = useParams()
  const id = typeof params?.id === "string" ? params.id : ""

  const [post, setPost] = useState<PostRow | null>(null)
  const [comments, setComments] = useState<CommentRow[]>([])
  const [postLikeCount, setPostLikeCount] = useState(0)
  const [postLiked, setPostLiked] = useState(false)
  const [commentLikeCounts, setCommentLikeCounts] = useState<Record<string, number>>({})
  const [commentLiked, setCommentLiked] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [replyBody, setReplyBody] = useState("")
  const [replyBusy, setReplyBusy] = useState(false)
  const [replyError, setReplyError] = useState<string | null>(null)
  const [hasSession, setHasSession] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [reportType, setReportType] = useState<"post" | "comment">("post")
  const [reportItemId, setReportItemId] = useState("")

  const loadThread = useCallback(async () => {
    if (!id) {
      setError("Invalid thread link.")
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    const supabase = createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    const userId = user?.id
    setHasSession(!!user)

    const { data: postData, error: postError } = await supabase
      .from("posts")
      .select("id,title,body,created_at,is_anonymous,categories(name),profiles(username,display_name)")
      .eq("id", id)
      .maybeSingle()

    if (postError) {
      setError(postError.message)
      setPost(null)
      setLoading(false)
      return
    }

    if (!postData) {
      setError("This post could not be found.")
      setPost(null)
      setLoading(false)
      return
    }

    setPost(postData as PostRow)

    const { data: commentsData, error: commentsError } = await supabase
      .from("comments")
      .select("id,body,created_at,profiles(username,display_name)")
      .eq("post_id", id)
      .order("created_at", { ascending: true })

    if (commentsError) {
      setError(commentsError.message)
      setComments([])
    } else {
      const list = (commentsData ?? []) as CommentRow[]
      setComments(list)
      const cids = list.map((c) => c.id)
      const agg = await loadReactionAggregates(supabase, id, cids, userId)
      setPostLikeCount(agg.postLikes)
      setPostLiked(agg.postLiked)
      setCommentLikeCounts(agg.commentCounts)
      setCommentLiked(agg.commentLiked)
    }

    setLoading(false)
  }, [id])

  useEffect(() => {
    void loadThread()
  }, [loadThread])

  async function submitReply(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setReplyError(null)
    const text = replyBody.trim()
    if (!text) {
      setReplyError("Write something first.")
      return
    }

    setReplyBusy(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        setReplyError("You must be logged in to reply.")
        return
      }

      await ensureProfileExists(user.id)

      const { error: insertError } = await supabase.from("comments").insert({
        post_id: id,
        author_id: user.id,
        body: text,
      })

      if (insertError) {
        setReplyError(insertError.message)
        return
      }

      setReplyBody("")
      await loadThread()
    } catch (err) {
      setReplyError(err instanceof Error ? err.message : "Could not post reply.")
    } finally {
      setReplyBusy(false)
    }
  }

  const category =
    post && (Array.isArray(post.categories) ? post.categories[0] : post.categories)
  const categoryName = category?.name ?? "Forum"

  const authorLabel = (opts: {
    isAnonymous?: boolean
    profiles: PostRow["profiles"] | CommentRow["profiles"]
  }) => {
    if (opts.isAnonymous) return "Anonymous"
    const p = Array.isArray(opts.profiles) ? opts.profiles[0] : opts.profiles
    return p?.display_name || p?.username || "Member"
  }

  const bodyParagraphs = post?.body ? post.body.split(/\n+/).filter(Boolean) : []

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {loading && (
            <p className="text-sm text-muted-foreground tracking-wider mb-8">Loading thread…</p>
          )}

          {error && !loading && (
            <div className="terminal-window mb-8">
              <div className="p-6">
                <p className="text-sm text-destructive">{error}</p>
                <Link href="/forums" className="inline-block mt-4 text-xs text-primary tracking-wider hover:underline">
                  Back to forums
                </Link>
              </div>
            </div>
          )}

          {!loading && post && (
            <>
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 bg-secondary border border-border text-xs text-muted-foreground tracking-wider">
                    Post #{String(post.id).slice(0, 8)}
                  </span>
                  <span className="px-3 py-1 bg-secondary border border-border text-xs text-muted-foreground tracking-wider">
                    {categoryName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {post.created_at
                      ? format(new Date(post.created_at), "MMM d, yyyy 'at' h:mm a")
                      : ""}
                  </span>
                </div>
                <h1 className="font-heading text-3xl md:text-5xl text-foreground leading-tight">
                  {post.title}
                </h1>
              </div>

              <article className="terminal-window mb-8">
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-48 shrink-0">
                      <div className="flex md:flex-col items-center md:items-start gap-4">
                        <div className="w-20 h-20 md:w-full md:h-auto md:aspect-square bg-secondary border border-border flex items-center justify-center">
                          <span className="text-muted-foreground text-2xl">?</span>
                        </div>
                        <div>
                          <p className="text-sm text-foreground">
                            {authorLabel({ isAnonymous: post.is_anonymous, profiles: post.profiles })}
                          </p>
                          {post.is_anonymous && (
                            <p className="text-xs text-primary">Posted anonymously</p>
                          )}
                        </div>
                      </div>
                      <div className="hidden md:flex flex-col gap-2 mt-6">
                        <ReactionButton
                          target="post"
                          postId={post.id}
                          count={postLikeCount}
                          liked={postLiked}
                          allowInteract={hasSession}
                          label="Support"
                          onUpdated={(c, l) => {
                            setPostLikeCount(c)
                            setPostLiked(l)
                          }}
                        />
                        <button
                          type="button"
                          className="retro-btn-outline px-4 py-2.5 text-xs tracking-wider flex items-center justify-center gap-2"
                        >
                          <Reply className="w-4 h-4" strokeWidth={2} />
                          Reply
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setReportType("post")
                            setReportItemId(post.id)
                            setReportOpen(true)
                          }}
                          className="retro-btn-outline px-4 py-2.5 text-xs tracking-wider flex items-center justify-center gap-2 text-muted-foreground"
                        >
                          <Flag className="w-4 h-4" strokeWidth={2} />
                          Report
                        </button>
                      </div>
                    </div>

                    <div className="flex-1 border-t md:border-t-0 md:border-l border-border pt-6 md:pt-0 md:pl-6">
                      <div className="space-y-4">
                        {bodyParagraphs.map((paragraph, index) => (
                          <p key={index} className="font-serif text-foreground leading-relaxed whitespace-pre-wrap">
                            {paragraph}
                          </p>
                        ))}
                      </div>

                      <div className="flex md:hidden flex-wrap gap-2 mt-6">
                        <ReactionButton
                          target="post"
                          postId={post.id}
                          count={postLikeCount}
                          liked={postLiked}
                          allowInteract={hasSession}
                          label="Support"
                          className="flex-1 min-w-[40%]"
                          onUpdated={(c, l) => {
                            setPostLikeCount(c)
                            setPostLiked(l)
                          }}
                        />
                        <button
                          type="button"
                          className="retro-btn-outline flex-1 min-w-[40%] px-4 py-2.5 text-xs tracking-wider flex items-center justify-center gap-2"
                        >
                          <Reply className="w-4 h-4" strokeWidth={2} />
                          Reply
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setReportType("post")
                            setReportItemId(post.id)
                            setReportOpen(true)
                          }}
                          className="retro-btn-outline w-full px-4 py-2.5 text-xs tracking-wider flex items-center justify-center gap-2 text-muted-foreground"
                        >
                          <Flag className="w-4 h-4" strokeWidth={2} />
                          Report post
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

              <div className="terminal-window mb-6">
                <div className="p-5">
                  <p className="text-xs text-muted-foreground tracking-wider mb-3">Add a reply</p>
                  {hasSession ? (
                    <form onSubmit={submitReply} className="space-y-3">
                      {replyError && (
                        <p className="text-xs text-destructive">{replyError}</p>
                      )}
                      <textarea
                        value={replyBody}
                        onChange={(e) => setReplyBody(e.target.value)}
                        placeholder="Write your reply…"
                        rows={4}
                        className="w-full bg-secondary border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary px-4 py-3 resize-y font-serif text-sm"
                      />
                      <button
                        type="submit"
                        disabled={replyBusy}
                        className="retro-btn px-6 py-2.5 text-xs tracking-widest"
                      >
                        {replyBusy ? "Posting…" : "Post reply"}
                      </button>
                    </form>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      <Link href="/login" className="text-primary hover:underline">
                        Log in
                      </Link>{" "}
                      to reply to this thread.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between mb-6">
                <h2 className="text-sm tracking-[0.2em] text-foreground">Replies</h2>
                <span className="text-xs text-primary">{comments.length} responses</span>
              </div>

              <div className="space-y-4">
                {comments.length === 0 && (
                  <p className="text-xs text-muted-foreground tracking-wider">No replies yet. Be the first to respond.</p>
                )}
                {comments.map((comment) => (
                  <div key={comment.id} className="terminal-window">
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-secondary border border-border shrink-0 flex items-center justify-center">
                            <span className="text-muted-foreground text-sm">?</span>
                          </div>
                          <div>
                            <span className="text-sm text-foreground">
                              {authorLabel({ profiles: comment.profiles })}
                            </span>
                            {comment.created_at && (
                              <span className="text-xs text-muted-foreground ml-2">
                                · {format(new Date(comment.created_at), "MMM d, h:mm a")}
                              </span>
                            )}
                          </div>
                        </div>
                        <button type="button" className="text-muted-foreground hover:text-foreground transition-colors">
                          <MoreHorizontal className="w-5 h-5" strokeWidth={2} />
                        </button>
                      </div>

                      <p className="font-serif text-foreground leading-relaxed mb-4 whitespace-pre-wrap">{comment.body}</p>

                      <div className="flex flex-wrap items-center gap-2">
                        <ReactionButton
                          target="comment"
                          postId={post.id}
                          commentId={comment.id}
                          count={commentLikeCounts[comment.id] ?? 0}
                          liked={commentLiked[comment.id] ?? false}
                          allowInteract={hasSession}
                          label="Like"
                          className="retro-btn-outline px-3 py-2"
                          onUpdated={(c, l) => {
                            setCommentLikeCounts((prev) => ({ ...prev, [comment.id]: c }))
                            setCommentLiked((prev) => ({ ...prev, [comment.id]: l }))
                          }}
                        />
                        <button
                          type="button"
                          className="retro-btn-outline px-3 py-2 text-xs tracking-wider flex items-center justify-center gap-2"
                        >
                          <Reply className="w-4 h-4" strokeWidth={2} />
                          Reply
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setReportType("comment")
                            setReportItemId(comment.id)
                            setReportOpen(true)
                          }}
                          className="retro-btn-outline px-3 py-2 text-xs tracking-wider flex items-center justify-center gap-2 text-muted-foreground"
                        >
                          <Flag className="w-4 h-4" strokeWidth={2} />
                          Report
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <Link href="/forums/create" className="fixed bottom-6 right-6 w-14 h-14 retro-btn flex items-center justify-center">
        <Plus className="w-6 h-6" strokeWidth={2} />
      </Link>

      <Footer />

      <ReportModal
        key={`${reportType}-${reportItemId}`}
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        type={reportType}
        itemId={reportItemId}
      />
    </div>
  )
}
