"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MessageSquare, Bookmark, Plus, Share2, Users } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useEffect, useMemo, useState } from "react"

const sidebarLinks = [
  { icon: MessageSquare, label: "All Posts", href: "/forums", active: true },
  { icon: Users, label: "Mentors", href: "/forums/mentors", active: false },
  { icon: Bookmark, label: "Saved Posts", href: "/forums/saved", active: false },
]

type CategoryRow = {
  id: number
  name: string
  slug: string
  sort_order: number
}

type PostRow = {
  id: string
  title: string
  body: string
  created_at: string | null
  is_anonymous: boolean
  categories: { name: string | null; slug: string | null } | { name: string | null; slug: string | null }[] | null
  profiles: { username: string | null; display_name: string | null; avatar_url: string | null } | { username: string | null; display_name: string | null; avatar_url: string | null }[] | null
}

export default function ForumsPage() {
  const [categories, setCategories] = useState<CategoryRow[]>([])
  const [posts, setPosts] = useState<PostRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const supabaseUrlRaw = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrlRaw || !supabaseAnonKey) {
          if (cancelled) return
          setError("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY")
          setLoading(false)
          return
        }

        const supabaseUrl = supabaseUrlRaw.replace(/\/+$/, "")

        const headers: HeadersInit = {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        }

        const catsUrl = `${supabaseUrl}/rest/v1/categories?select=id,name,slug,sort_order&order=sort_order.asc`
        const postsUrl =
          `${supabaseUrl}/rest/v1/posts?select=id,title,body,created_at,is_anonymous,` +
          `categories(name,slug),profiles(username,display_name,avatar_url)&order=created_at.desc&limit=25`

        let catsRes: Response
        let postsRes: Response
        let catsText = ""
        let postsText = ""

        try {
          ;[catsRes, postsRes] = await Promise.all([
            fetch(catsUrl, { headers }),
            fetch(postsUrl, { headers }),
          ])
          ;[catsText, postsText] = await Promise.all([catsRes.text(), postsRes.text()])
        } catch (e) {
          if (cancelled) return
          const message = e instanceof Error ? e.message : String(e)
          setError(
            `Network error while fetching Supabase.\n` +
              `message: ${message}\n` +
              `catsUrl: ${catsUrl}\n` +
              `postsUrl: ${postsUrl}`
          )
          setCategories([])
          setPosts([])
          setLoading(false)
          return
        }

        if (cancelled) return

        if (!catsRes.ok || !postsRes.ok) {
          setError(
            `Supabase REST error: categories=${catsRes.status} posts=${postsRes.status}\n` +
              `categories: ${catsText}\nposts: ${postsText}`
          )
          setCategories([])
          setPosts([])
          setLoading(false)
          return
        }

        setCategories((JSON.parse(catsText) ?? []) as CategoryRow[])
        setPosts((JSON.parse(postsText) ?? []) as PostRow[])
        setLoading(false)
      } catch (e) {
        if (cancelled) return
        const message = e instanceof Error ? e.message : String(e)
        setError(`Unexpected error loading forums: ${message}`)
        setCategories([])
        setPosts([])
        setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  const hasError = useMemo(() => Boolean(error), [error])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <aside className="lg:w-64 shrink-0">
              <div className="terminal-window mb-4">
                <div className="terminal-header">
                  <span className="text-xs text-muted-foreground tracking-wider">Navigation</span>
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground" />
                    <span className="w-2 h-2 bg-muted-foreground" />
                  </div>
                </div>
                <nav className="p-2">
                  {sidebarLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={`flex items-center gap-3 px-3 py-2.5 text-xs tracking-wider transition-colors ${
                        link.active 
                          ? "bg-secondary text-foreground" 
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      }`}
                    >
                      <link.icon className="w-4 h-4" />
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>

              {/* Community Status */}
              <div className="terminal-window">
                <div className="p-4">
                  <h3 className="text-xs tracking-wider text-muted-foreground mb-4">Community Status</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Online Now</span>
                      <span className="text-xs text-primary">1,204</span>
                    </div>
                    <div className="w-full h-1 bg-secondary">
                      <div className="h-full bg-primary w-3/4" />
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-muted-foreground">Response Time</span>
                      <span className="text-xs text-primary">~5 min</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                <div>
                  <h1 className="font-heading text-3xl md:text-4xl text-foreground">Community Forums</h1>
                  <p className="text-xs text-muted-foreground tracking-wider mt-1">
                    A safe space to share, vent, and support each other
                  </p>
                </div>
                <Link
                  href="/forums/create"
                  className="retro-btn px-4 py-2.5 text-xs tracking-widest flex items-center gap-2 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  New Post
                </Link>
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Link
                  href="/forums"
                  className="px-4 py-2 text-xs tracking-wider border transition-colors bg-secondary border-primary text-foreground"
                >
                  All Posts
                </Link>
                {(categories ?? []).map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/forums/category/${cat.slug}`}
                    className="px-4 py-2 text-xs tracking-wider border transition-colors border-border text-muted-foreground hover:border-muted-foreground"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>

              {/* Thread List */}
              <div className="space-y-4">
                {hasError && (
                  <div className="terminal-window">
                    <div className="terminal-header">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary" />
                        <span className="text-xs text-muted-foreground">Error</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-sm text-muted-foreground">
                        Couldn&apos;t load forum posts right now. Double-check your Supabase env vars and that
                        you ran `supabase/schema.sql`.
                      </p>
                      <pre className="mt-4 text-xs text-muted-foreground whitespace-pre-wrap">
                        {String(error || "")}
                      </pre>
                    </div>
                  </div>
                )}

                {loading && (
                  <div className="terminal-window">
                    <div className="terminal-header">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary" />
                        <span className="text-xs text-muted-foreground">Loading</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-sm text-muted-foreground">Fetching posts…</p>
                    </div>
                  </div>
                )}

                {!loading && posts.length === 0 && !hasError && (
                  <div className="terminal-window">
                    <div className="terminal-header">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary" />
                        <span className="text-xs text-muted-foreground">No posts yet</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <p className="text-sm text-muted-foreground mb-4">
                        Be the first to start a thread.
                      </p>
                      <Link href="/forums/create" className="retro-btn px-4 py-2.5 text-xs tracking-widest">
                        Create a post
                      </Link>
                    </div>
                  </div>
                )}

                {!loading && !hasError && posts.map((post) => {
                  const category =
                    Array.isArray(post.categories) ? post.categories[0] : post.categories
                  const categoryName = category?.name ?? "Uncategorized"
                  const posted = post.created_at
                    ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true })
                    : ""
                  const excerpt =
                    post.body.length > 220 ? `${post.body.slice(0, 220).trim()}…` : post.body
                  const commentsCount = 0
                  const likesCount = 0

                  return (
                    <article key={post.id} className="terminal-window">
                    <div className="terminal-header">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary" />
                        <span className="text-xs text-muted-foreground">Post #{String(post.id).slice(0, 8)}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{posted}</span>
                    </div>
                    <div className="p-5">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-secondary border border-border shrink-0 flex items-center justify-center">
                          <span className="text-muted-foreground text-lg">?</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <Link 
                              href={`/forums/thread/${post.id}`}
                              className="font-heading text-lg text-foreground hover:text-primary transition-colors"
                            >
                              {post.title}
                            </Link>
                            <span className="tag shrink-0">
                              {categoryName}
                            </span>
                          </div>
                          <p className="font-serif text-sm text-muted-foreground leading-relaxed mb-4">
                            {excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <MessageSquare className="w-4 h-4" />
                                {commentsCount}
                              </span>
                              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                                {likesCount}
                              </span>
                            </div>
                            <button className="text-muted-foreground hover:text-foreground transition-colors">
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                  )
                })}
              </div>

              {/* Load More */}
              <div className="flex justify-center mt-8">
                <button className="retro-btn-outline px-6 py-2.5 text-xs tracking-widest flex items-center gap-2">
                  Load More Posts
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
