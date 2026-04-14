"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Settings, Heart, MessageSquare, Grid, List, Plus } from "lucide-react"
import { createClient } from "@/lib/supabase"

type ProfileRow = {
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
}

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<ProfileRow | null>(null)
  const [posts, setPosts] = useState<PostRow[]>([])
  const [postCount, setPostCount] = useState(0)

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

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("username, display_name, bio, created_at")
        .eq("id", user.id)
        .maybeSingle()

      if (cancelled) return
      if (profileError) {
        setProfile(null)
        setLoading(false)
        return
      }
      setProfile(profileData as ProfileRow)

      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("id,title,body,created_at,categories(name)")
        .eq("author_id", user.id)
        .order("created_at", { ascending: false })

      if (cancelled) return
      if (!postsError && postsData) {
        setPosts(postsData as PostRow[])
        setPostCount(postsData.length)
      }

      setLoading(false)
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [router])

  const displayName = profile?.display_name || profile?.username || "Member"
  const tagline = profile?.bio ? profile.bio.slice(0, 120) + (profile.bio.length > 120 ? "…" : "") : ""

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-background">
          <p className="text-sm text-muted-foreground">Loading profile…</p>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <aside className="lg:w-80 shrink-0">
              <div className="terminal-window mb-4">
                <div className="p-6">
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-32 h-32 bg-secondary border border-border mb-4 flex items-center justify-center">
                      <span className="text-muted-foreground text-4xl">?</span>
                    </div>
                    <span className="px-3 py-1 border border-primary text-xs text-primary tracking-wider">Member</span>
                  </div>

                  <div className="text-center mb-6">
                    <h1 className="font-heading text-2xl text-foreground mb-1">{displayName}</h1>
                    {tagline && <p className="text-xs text-primary tracking-wider line-clamp-2">{tagline}</p>}
                  </div>

                  {profile?.bio && (
                    <div className="mb-6">
                      <div className="border-l-2 border-primary pl-4">
                        <p className="text-xs text-primary tracking-wider mb-2">About Me</p>
                        <p className="font-serif text-sm text-foreground italic leading-relaxed whitespace-pre-wrap">
                          {profile.bio}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-around mb-6 py-4 border-y border-border">
                    <div className="text-center">
                      <p className="text-xs text-primary tracking-wider mb-1">Posts</p>
                      <p className="text-2xl text-primary">{postCount}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-primary tracking-wider mb-1">Joined</p>
                      <p className="text-sm text-foreground">
                        {profile?.created_at
                          ? format(new Date(profile.created_at), "MMM yyyy")
                          : "—"}
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/profile/edit"
                    className="retro-btn-outline w-full px-4 py-3 text-xs tracking-widest flex items-center justify-center gap-2"
                  >
                    <Settings className="w-4 h-4" />
                    Edit Profile
                  </Link>
                </div>
              </div>

              <div className="terminal-window">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Settings className="w-4 h-4 text-muted-foreground" />
                    <h3 className="text-xs tracking-wider text-muted-foreground">Activity</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Total posts</span>
                      <span className="text-xs text-primary">{postCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h2 className="font-heading text-3xl text-foreground">My Posts</h2>
                  <p className="text-xs text-muted-foreground tracking-wider mt-1">Your posts and contributions</p>
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
                  <p className="text-sm text-muted-foreground">You haven&apos;t posted yet.</p>
                )}
                {posts.map((post) => {
                  const cat = Array.isArray(post.categories) ? post.categories[0] : post.categories
                  const excerpt = post.body.length > 160 ? `${post.body.slice(0, 160).trim()}…` : post.body
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
                              <span className="text-xs text-muted-foreground">
                                {post.created_at
                                  ? format(new Date(post.created_at), "MMM d, yyyy")
                                  : ""}
                              </span>
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
                              —
                            </span>
                            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                              <MessageSquare className="w-4 h-4" />
                              —
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
            </div>
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
