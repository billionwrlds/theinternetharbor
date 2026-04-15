"use client"

import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MessageSquare, Bookmark, Plus, Share2, Users, Heart, Search } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useEffect, useMemo, useState } from "react"
import { createClient } from "@/lib/supabase"

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
  comments: { count: number }[] | null
  reactions: { count: number }[] | null
}

export default function ForumsPage() {
  const [categories, setCategories] = useState<CategoryRow[]>([])
  const [posts, setPosts] = useState<PostRow[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [memberCount, setMemberCount] = useState<number | null>(null)
  const [categoryPostCounts, setCategoryPostCounts] = useState<Record<number, number>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const supabase = createClient()
        const safeQuery = searchQuery.trim().replace(/%/g, "\\%").replace(/_/g, "\\_")
        const pattern = `%${safeQuery}%`

        const [
          { data: cats, error: catsError },
          { data: postsData, error: postsError },
          { count: profilesCount, error: profilesCountError },
        ] = await Promise.all([
          supabase.from("categories").select("id,name,slug,sort_order").order("sort_order", { ascending: true }),
          safeQuery
            ? supabase
                .from("posts")
                .select(
                  "id,title,body,created_at,is_anonymous,categories(name,slug),profiles(username,display_name,avatar_url),comments(count),reactions(count)"
                )
                .or(`title.ilike.${pattern},body.ilike.${pattern}`)
                .order("created_at", { ascending: false })
                .limit(50)
            : supabase
                .from("posts")
                .select(
                  "id,title,body,created_at,is_anonymous,categories(name,slug),profiles(username,display_name,avatar_url),comments(count),reactions(count)"
                )
                .order("created_at", { ascending: false })
                .limit(25),
          supabase.from("profiles").select("*", { count: "exact", head: true }),
        ])

        if (cancelled) return

        if (catsError || postsError) {
          setError(catsError?.message || postsError?.message || "Failed to load forums")
          setCategories([])
          setPosts([])
          setLoading(false)
          return
        }

        if (!profilesCountError && profilesCount !== null) {
          setMemberCount(profilesCount)
        }

        const catList = (cats ?? []) as CategoryRow[]
        setCategories(catList)
        setPosts((postsData ?? []) as PostRow[])

        const counts: Record<number, number> = {}
        for (const cat of catList) {
          const { count } = await supabase
            .from("posts")
            .select("*", { count: "exact", head: true })
            .eq("category_id", cat.id)
          if (!cancelled) counts[cat.id] = count ?? 0
        }
        if (!cancelled) setCategoryPostCounts(counts)

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

    const t = setTimeout(() => void load(), 200)
    return () => {
      cancelled = true
      clearTimeout(t)
    }
  }, [searchQuery])

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
                      <link.icon className="w-4 h-4" strokeWidth={2} />
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
                      <span className="text-xs text-muted-foreground">Members</span>
                      <span className="text-xs text-primary">{memberCount ?? "—"}</span>
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

              {/* Search */}
              <div className="terminal-window mb-6">
                <div className="p-4">
                  <div className="flex items-center gap-2 bg-secondary border border-border px-3 py-2">
                    <Search className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search posts by title or content…"
                      className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none flex-1 min-w-0"
                    />
                    {searchQuery.trim() && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
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
                    {categoryPostCounts[cat.id] !== undefined ? ` (${categoryPostCounts[cat.id]})` : ""}
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
                  const commentsCount = Array.isArray(post.comments) ? post.comments[0]?.count ?? 0 : 0
                  const likesCount = Array.isArray(post.reactions) ? post.reactions[0]?.count ?? 0 : 0

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
                                <MessageSquare className="w-4 h-4" strokeWidth={2} />
                                {commentsCount}
                              </span>
                              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Heart className="w-4 h-4" strokeWidth={2} />
                                {likesCount}
                              </span>
                            </div>
                            <button className="text-muted-foreground hover:text-foreground transition-colors">
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
