"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Search, MessageSquare, Filter, Heart } from "lucide-react"
import { createClient } from "@/lib/supabase"

type Result = {
  id: string
  title: string
  body: string
  created_at: string | null
  categories: { name: string | null } | { name: string | null }[] | null
  profiles: { username: string | null; display_name: string | null } | { username: string | null; display_name: string | null }[] | null
  comments: { count: number }[] | null
  reactions: { count: number }[] | null
}

function SearchPageContent() {
  const searchParams = useSearchParams()
  const query = (searchParams.get("q") ?? "").trim()

  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function run() {
      if (!query) {
        setResults([])
        return
      }

      setLoading(true)
      const supabase = createClient()
      const safe = query.replace(/%/g, "\\%").replace(/_/g, "\\_")
      const pattern = `%${safe}%`

      const { data, error } = await supabase
        .from("posts")
        .select(
          "id,title,body,created_at,categories(name),profiles(username,display_name),comments(count),reactions(count)"
        )
        .or(`title.ilike.${pattern},body.ilike.${pattern}`)
        .order("created_at", { ascending: false })
        .limit(50)

      if (cancelled) return
      if (error) {
        setResults([])
      } else {
        setResults((data ?? []) as Result[])
      }
      setLoading(false)
    }

    void run()
    return () => {
      cancelled = true
    }
  }, [query])

  const authorLabel = (row: Result) => {
    const p = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles
    return p?.display_name || p?.username || "Member"
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-background">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="font-heading text-3xl md:text-4xl text-foreground mb-4">Search Results</h1>

            <div className="terminal-window">
              <div className="p-4 flex flex-col sm:flex-row gap-4">
                <form className="flex-1 flex items-center gap-2 bg-secondary border border-border px-3 py-2" action="/search" method="get">
                  <Search className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
                  <input
                    type="text"
                    name="q"
                    defaultValue={query}
                    placeholder="Search posts, users, or topics..."
                    className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none flex-1"
                  />
                </form>
                <button type="button" className="retro-btn-outline px-4 py-2 text-xs tracking-widest flex items-center gap-2">
                  <Filter className="w-4 h-4" strokeWidth={2} />
                  Filters
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              {query ? (
                <>
                  {loading ? (
                    "Searching…"
                  ) : (
                    <>
                      Showing {results.length} results for &quot;<span className="text-foreground">{query}</span>&quot;
                    </>
                  )}
                </>
              ) : (
                "Enter a search term to find posts"
              )}
            </p>
            <select className="bg-secondary border border-border text-xs text-muted-foreground px-3 py-2 focus:outline-none">
              <option>Most Relevant</option>
              <option>Most Recent</option>
              <option>Most Liked</option>
            </select>
          </div>

          {query ? (
            <div className="space-y-4">
              {!loading &&
                results.map((result) => {
                  const cat = Array.isArray(result.categories) ? result.categories[0] : result.categories
                  const excerpt =
                    result.body.length > 200 ? `${result.body.slice(0, 200).trim()}…` : result.body
                  const posted = result.created_at
                    ? formatDistanceToNow(new Date(result.created_at), { addSuffix: true })
                    : ""
                  const commentsCount = Array.isArray(result.comments) ? result.comments[0]?.count ?? 0 : 0
                  const likesCount = Array.isArray(result.reactions) ? result.reactions[0]?.count ?? 0 : 0

                  return (
                    <article key={result.id} className="terminal-window">
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <Link
                              href={`/forums/thread/${result.id}`}
                              className="font-heading text-lg text-foreground hover:text-primary transition-colors block"
                            >
                              {result.title}
                            </Link>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-muted-foreground">{posted}</span>
                              <span className="text-xs text-muted-foreground">
                                by <span className="text-primary">{authorLabel(result)}</span>
                              </span>
                              {cat?.name && <span className="tag tag-active">{cat.name}</span>}
                            </div>
                          </div>
                        </div>

                        <p className="font-serif text-sm text-muted-foreground leading-relaxed mb-4">{excerpt}</p>

                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <MessageSquare className="w-4 h-4" strokeWidth={2} />
                            {commentsCount} replies
                          </span>
                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Heart className="w-4 h-4" strokeWidth={2} />
                            {likesCount} likes
                          </span>
                        </div>
                      </div>
                    </article>
                  )
                })}
            </div>
          ) : (
            <div className="terminal-window">
              <div className="p-12 text-center">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" strokeWidth={2} />
                <h2 className="font-heading text-xl text-foreground mb-2">Start Searching</h2>
                <p className="text-sm text-muted-foreground">Enter a search term above to find posts, topics, or users.</p>
              </div>
            </div>
          )}

          {query && (
            <div className="flex justify-center mt-8">
              <button type="button" className="retro-btn-outline px-6 py-2.5 text-xs tracking-widest">
                Load More Results
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 flex items-center justify-center bg-background">
            <p className="text-sm text-muted-foreground">Loading…</p>
          </main>
          <Footer />
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  )
}
