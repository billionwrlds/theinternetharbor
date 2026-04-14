"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MessageSquare, Share2, ArrowLeft, Heart } from "lucide-react"
import { createClient } from "@/lib/supabase"

const categoryInfo: Record<string, { title: string; description: string; color: string }> = {
  vent: {
    title: "Vent",
    description: "A space to let it all out. No judgment, just support.",
    color: "bg-red-500/20 border-red-500/50",
  },
  advice: {
    title: "Advice",
    description: "Seeking or offering guidance for life's challenges.",
    color: "bg-blue-500/20 border-blue-500/50",
  },
  wins: {
    title: "Wins",
    description: "Celebrate your victories, big or small.",
    color: "bg-green-500/20 border-green-500/50",
  },
  "college-life": {
    title: "College Life",
    description: "Navigating the unique challenges of student life.",
    color: "bg-purple-500/20 border-border",
  },
  college: {
    title: "College Life",
    description: "Navigating the unique challenges of student life.",
    color: "bg-purple-500/20 border-border",
  },
}

type PostRow = {
  id: string
  title: string
  body: string
  created_at: string | null
  comments: { count: number }[] | null
  reactions: { count: number }[] | null
}

export default function CategoryPage() {
  const params = useParams()
  const slug = typeof params?.slug === "string" ? params.slug : ""

  const [posts, setPosts] = useState<PostRow[]>([])
  const [memberCount, setMemberCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const category =
    categoryInfo[slug] || { title: "Category", description: "Browse posts in this category.", color: "bg-secondary border-border" }

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!slug) {
        setError("Invalid category.")
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)
      const supabase = createClient()

      const { data: catRow, error: catError } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", slug)
        .maybeSingle()

      if (cancelled) return

      if (catError || !catRow) {
        setError(catError?.message ?? "Category not found.")
        setPosts([])
        setLoading(false)
        return
      }

      const [{ data: postsData, error: postsError }, { count }] = await Promise.all([
        supabase
          .from("posts")
          .select("id,title,body,created_at,comments(count),reactions(count)")
          .eq("category_id", catRow.id)
          .order("created_at", { ascending: false }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
      ])

      if (cancelled) return

      if (postsError) {
        setError(postsError.message)
        setPosts([])
      } else {
        setPosts((postsData ?? []) as PostRow[])
      }
      setMemberCount(count ?? 0)
      setLoading(false)
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [slug])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-background">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <Link
            href="/forums"
            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            Back to Forums
          </Link>

          <div className={`terminal-window mb-8 ${category.color}`}>
            <div className="p-6">
              <h1 className="font-heading text-3xl md:text-4xl text-foreground mb-2">{category.title}</h1>
              <p className="text-sm text-muted-foreground">{category.description}</p>
              <div className="flex items-center gap-4 mt-4">
                <span className="text-xs text-muted-foreground">{loading ? "…" : `${posts.length} posts`}</span>
                <span className="text-xs text-muted-foreground">
                  {memberCount !== null ? `${memberCount} members` : "—"}
                </span>
              </div>
            </div>
          </div>

          {error && (
            <p className="text-sm text-destructive mb-4">{error}</p>
          )}

          {loading && <p className="text-xs text-muted-foreground mb-4">Loading…</p>}

          <div className="space-y-4">
            {!loading && posts.length === 0 && !error && (
              <p className="text-sm text-muted-foreground">No posts in this category yet.</p>
            )}
            {posts.map((thread) => {
              const posted = thread.created_at
                ? formatDistanceToNow(new Date(thread.created_at), { addSuffix: true })
                : ""
              const excerpt =
                thread.body.length > 220 ? `${thread.body.slice(0, 220).trim()}…` : thread.body
              const commentsCount = Array.isArray(thread.comments) ? thread.comments[0]?.count ?? 0 : 0
              const likesCount = Array.isArray(thread.reactions) ? thread.reactions[0]?.count ?? 0 : 0

              return (
                <article key={thread.id} className="terminal-window">
                  <div className="terminal-header">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 bg-primary" />
                      <span className="text-xs text-muted-foreground">Post #{String(thread.id).slice(0, 8)}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{posted}</span>
                  </div>
                  <div className="p-5">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-secondary border border-border shrink-0 flex items-center justify-center">
                        <span className="text-muted-foreground text-lg">?</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/forums/thread/${thread.id}`}
                          className="font-heading text-lg text-foreground hover:text-primary transition-colors block mb-2"
                        >
                          {thread.title}
                        </Link>
                        <p className="font-serif text-sm text-muted-foreground leading-relaxed mb-4">{excerpt}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <MessageSquare className="w-4 h-4" strokeWidth={2} />
                              {commentsCount}
                            </span>
                            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Heart className="w-4 h-4" strokeWidth={2} />
                              {likesCount}
                            </span>
                          </div>
                          <button type="button" className="text-muted-foreground hover:text-foreground transition-colors">
                            <Share2 className="w-4 h-4" strokeWidth={2} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          <div className="flex justify-center mt-8">
            <button type="button" className="retro-btn-outline px-6 py-2.5 text-xs tracking-widest">
              Load More Posts
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
