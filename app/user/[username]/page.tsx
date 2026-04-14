"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Heart, MessageSquare, Grid, List, ArrowLeft } from "lucide-react"
import { createClient } from "@/lib/supabase"

type ProfileRow = {
  id: string
  username: string | null
  display_name: string | null
  bio: string | null
  created_at: string | null
}

type PostRow = {
  id: string
  title: string
  body: string
  created_at: string | null
  categories: { name: string | null } | { name: string | null }[] | null
  comments: { count: number }[] | null
  reactions: { count: number }[] | null
}

export default function PublicProfilePage() {
  const params = useParams()
  const username = typeof params?.username === "string" ? params.username : ""

  const [profile, setProfile] = useState<ProfileRow | null>(null)
  const [posts, setPosts] = useState<PostRow[]>([])
  const [totalLikes, setTotalLikes] = useState(0)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!username) {
        setNotFound(true)
        setLoading(false)
        return
      }

      const supabase = createClient()
      const { data: prof, error: pErr } = await supabase
        .from("profiles")
        .select("id,username,display_name,bio,created_at")
        .eq("username", username)
        .maybeSingle()

      if (cancelled) return
      if (pErr || !prof) {
        setNotFound(true)
        setLoading(false)
        return
      }

      setProfile(prof as ProfileRow)

      const { data: postsData } = await supabase
        .from("posts")
        .select("id,title,body,created_at,categories(name),comments(count),reactions(count)")
        .eq("author_id", prof.id)
        .order("created_at", { ascending: false })

      if (cancelled) return
      const list = (postsData ?? []) as PostRow[]
      setPosts(list)
      let likes = 0
      for (const p of list) {
        likes += Array.isArray(p.reactions) ? p.reactions[0]?.count ?? 0 : 0
      }
      setTotalLikes(likes)
      setLoading(false)
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [username])

  const displayName = profile?.display_name || profile?.username || username

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Link
            href="/forums"
            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Forums
          </Link>

          {loading && <p className="text-sm text-muted-foreground">Loading…</p>}

          {notFound && !loading && (
            <p className="text-sm text-destructive">User not found.</p>
          )}

          {!loading && profile && (
            <div className="flex flex-col lg:flex-row gap-6">
              <aside className="lg:w-80 shrink-0">
                <div className="terminal-window">
                  <div className="p-6">
                    <div className="flex flex-col items-center mb-6">
                      <div className="w-32 h-32 bg-secondary border border-border mb-4 flex items-center justify-center">
                        <span className="text-muted-foreground text-4xl">?</span>
                      </div>
                      <span className="px-3 py-1 border border-primary text-xs text-primary tracking-wider">Member</span>
                    </div>

                    <div className="text-center mb-6">
                      <h1 className="font-heading text-2xl text-foreground mb-1">{displayName}</h1>
                      <p className="text-xs text-primary tracking-wider">{profile.bio ? profile.bio.slice(0, 80) : "—"}</p>
                    </div>

                    <div className="mb-6">
                      <div className="border-l-2 border-primary pl-4">
                        <p className="text-xs text-primary tracking-wider mb-2">About</p>
                        <p className="font-serif text-sm text-foreground italic leading-relaxed">
                          {profile.bio || "No bio yet."}
                        </p>
                      </div>
                    </div>

                    <div className="flex justify-around mb-6 py-4 border-y border-border">
                      <div className="text-center">
                        <p className="text-xs text-primary tracking-wider mb-1">Posts</p>
                        <p className="text-2xl text-primary">{posts.length}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-primary tracking-wider mb-1">Likes</p>
                        <p className="text-2xl text-primary">{totalLikes}</p>
                      </div>
                    </div>

                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">
                        Member since{" "}
                        {profile.created_at ? format(new Date(profile.created_at), "MMMM yyyy") : "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </aside>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <h2 className="font-heading text-3xl text-foreground">{username}&apos;s Posts</h2>
                    <p className="text-xs text-muted-foreground tracking-wider mt-1">
                      Public posts from this member
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

                <div className="space-y-4">
                  {posts.length === 0 && (
                    <p className="text-sm text-muted-foreground">No public posts yet.</p>
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
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
