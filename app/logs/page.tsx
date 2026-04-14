"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Heart, MessageSquare, Plus, Grid, List, Search } from "lucide-react"
import { createClient } from "@/lib/supabase"

type PostRow = {
  id: string
  title: string
  body: string
  created_at: string | null
  categories: { name: string | null } | { name: string | null }[] | null
  comments: { count: number }[] | null
  reactions: { count: number }[] | null
}

export default function LogsPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<PostRow[]>([])
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
        .from("posts")
        .select("id,title,body,created_at,categories(name),comments(count),reactions(count)")
        .eq("author_id", user.id)
        .order("created_at", { ascending: false })

      if (cancelled) return
      if (!error && data) {
        setPosts(data as PostRow[])
      }
      setLoading(false)
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [router])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-background">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-heading text-3xl md:text-4xl text-foreground">My Posts</h1>
              <p className="text-xs text-muted-foreground tracking-wider mt-1">
                Your posts and contributions to the community
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="w-10 h-10 border border-primary bg-secondary flex items-center justify-center text-foreground"
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                type="button"
                className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:border-muted-foreground transition-colors"
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="terminal-window mb-6">
            <div className="p-4 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 flex items-center gap-2 bg-secondary border border-border px-3 py-2">
                <Search className="w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search your posts..."
                  className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none flex-1"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="px-4 py-2 text-xs tracking-wider border border-primary bg-secondary text-foreground"
                >
                  All
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-xs tracking-wider border border-border text-muted-foreground hover:border-muted-foreground"
                >
                  Advice
                </button>
                <button
                  type="button"
                  className="px-4 py-2 text-xs tracking-wider border border-border text-muted-foreground hover:border-muted-foreground"
                >
                  Wins
                </button>
              </div>
            </div>
          </div>

          {loading && <p className="text-xs text-muted-foreground mb-4">Loading…</p>}

          <div className="space-y-4">
            {!loading && posts.length === 0 && (
              <p className="text-sm text-muted-foreground">You haven&apos;t created any posts yet.</p>
            )}
            {posts.map((post) => {
              const cat = Array.isArray(post.categories) ? post.categories[0] : post.categories
              const dateStr = post.created_at ? format(new Date(post.created_at), "MMM d, yyyy") : ""
              const excerpt =
                post.body.length > 160 ? `${post.body.slice(0, 160).trim()}…` : post.body
              const likesCount = Array.isArray(post.reactions) ? post.reactions[0]?.count ?? 0 : 0
              const commentsCount = Array.isArray(post.comments) ? post.comments[0]?.count ?? 0 : 0

              return (
                <article key={post.id} className="terminal-window">
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <Link
                          href={`/forums/thread/${post.id}`}
                          className="font-heading text-lg text-foreground hover:text-primary transition-colors block"
                        >
                          {post.title}
                        </Link>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-muted-foreground">{dateStr}</span>
                          {cat?.name && <span className="tag tag-active">{cat.name}</span>}
                        </div>
                      </div>
                      <span className="text-xs text-primary shrink-0">#{String(post.id).slice(0, 8)}</span>
                    </div>

                    <p className="font-serif text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                      {excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Heart className="w-4 h-4" />
                          {likesCount}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MessageSquare className="w-4 h-4" />
                          {commentsCount}
                        </span>
                      </div>
                      <Link
                        href={`/forums/thread/${post.id}`}
                        className="text-xs text-primary hover:text-primary/80 transition-colors tracking-wider"
                      >
                        Read More
                      </Link>
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

      <Link
        href="/forums/create"
        className="fixed bottom-6 right-6 w-14 h-14 retro-btn flex items-center justify-center"
      >
        <Plus className="w-6 h-6" />
      </Link>

      <Footer />
    </div>
  )
}
