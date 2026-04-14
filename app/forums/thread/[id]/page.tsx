"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ChevronUp, Reply, MoreHorizontal, Plus, Flag } from "lucide-react"
import { createClient } from "@/lib/supabase"

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

export default function ThreadPage() {
  const params = useParams()
  const id = typeof params?.id === "string" ? params.id : ""

  const [post, setPost] = useState<PostRow | null>(null)
  const [comments, setComments] = useState<CommentRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) {
      setError("Invalid thread link.")
      setLoading(false)
      return
    }

    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      const supabase = createClient()

      const { data: postData, error: postError } = await supabase
        .from("posts")
        .select("id,title,body,created_at,is_anonymous,categories(name),profiles(username,display_name)")
        .eq("id", id)
        .maybeSingle()

      if (cancelled) return

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

      if (cancelled) return

      if (commentsError) {
        setError(commentsError.message)
        setComments([])
      } else {
        setComments((commentsData ?? []) as CommentRow[])
      }

      setLoading(false)
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [id])

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
                        <button
                          type="button"
                          className="retro-btn-outline px-4 py-2.5 text-xs tracking-wider flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                          </svg>
                          Support
                        </button>
                        <button
                          type="button"
                          className="retro-btn-outline px-4 py-2.5 text-xs tracking-wider flex items-center justify-center gap-2"
                        >
                          <Reply className="w-4 h-4" />
                          Reply
                        </button>
                        <button
                          type="button"
                          className="retro-btn-outline px-4 py-2.5 text-xs tracking-wider flex items-center justify-center gap-2 text-muted-foreground"
                        >
                          <Flag className="w-4 h-4" />
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

                      <div className="flex md:hidden gap-2 mt-6">
                        <button
                          type="button"
                          className="retro-btn-outline flex-1 px-4 py-2.5 text-xs tracking-wider flex items-center justify-center gap-2"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                          </svg>
                          Support
                        </button>
                        <button
                          type="button"
                          className="retro-btn-outline flex-1 px-4 py-2.5 text-xs tracking-wider flex items-center justify-center gap-2"
                        >
                          <Reply className="w-4 h-4" />
                          Reply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>

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
                          <MoreHorizontal className="w-5 h-5" />
                        </button>
                      </div>

                      <p className="font-serif text-foreground leading-relaxed mb-4 whitespace-pre-wrap">{comment.body}</p>

                      <div className="flex items-center gap-4">
                        <button
                          type="button"
                          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                        >
                          <ChevronUp className="w-4 h-4" />
                          Like
                        </button>
                        <button
                          type="button"
                          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Reply className="w-4 h-4" />
                          Reply
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
        <Plus className="w-6 h-6" />
      </Link>

      <Footer />
    </div>
  )
}
