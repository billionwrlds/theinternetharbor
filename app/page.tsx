"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MessageSquare, FileText, Heart } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { PixelCornerCluster, PixelFrameAccent } from "@/components/pixel-decorations"

const cardIcons = [MessageSquare, FileText, Heart] as const

type HomePost = {
  id: string
  title: string
  body: string
  created_at: string | null
  is_anonymous: boolean
  profiles: { username: string | null; display_name: string | null } | { username: string | null; display_name: string | null }[] | null
}

export default function HomePage() {
  const [recentPosts, setRecentPosts] = useState<HomePost[]>([])
  const [memberCount, setMemberCount] = useState<number | null>(null)
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const supabase = createClient()
      const [{ data: postsData }, { count }] = await Promise.all([
        supabase
          .from("posts")
          .select("id,title,body,created_at,is_anonymous,profiles(username,display_name)")
          .order("created_at", { ascending: false })
          .limit(3),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
      ])
      if (cancelled) return
      setRecentPosts((postsData ?? []) as HomePost[])
      setMemberCount(count ?? 0)
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const supabase = createClient()
    void supabase.auth.getSession().then(({ data: { session } }) => {
      setLoggedIn(!!session)
    })
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session)
    })
    return () => subscription.unsubscribe()
  }, [])

  const authorLabel = (post: HomePost) => {
    if (post.is_anonymous) return "Anonymous Sailor"
    const p = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles
    return p?.display_name || p?.username || "Member"
  }

  const memberSince = (post: HomePost) => {
    if (!post.created_at) return ""
    try {
      return `Member post · ${formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}`
    } catch {
      return ""
    }
  }

  const displayCards =
    recentPosts.length > 0
      ? recentPosts.map((post, i) => ({
          key: post.id,
          icon: cardIcons[i % cardIcons.length],
          content: post.body.length > 180 ? `${post.body.slice(0, 180).trim()}…` : post.body,
          user: authorLabel(post),
          memberSince: memberSince(post),
          time: post.created_at
            ? formatDistanceToNow(new Date(post.created_at), { addSuffix: true })
            : "",
        }))
      : [0, 1, 2].map((i) => ({
          key: `empty-${i}`,
          icon: cardIcons[i % cardIcons.length],
          content: "No posts yet. Visit the forums to start the conversation.",
          user: "—",
          memberSince: "",
          time: "",
        }))

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="relative h-[500px] md:h-[550px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] min-w-full min-h-full pixel-media">
            <Image
              src="/images/harbor-hero.jpg"
              alt="Harbor at dusk"
              fill
              className="object-cover contrast-[1.08] brightness-[1.02]"
              priority
              sizes="100vw"
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />

        <PixelFrameAccent className="absolute top-6 left-4 z-[2] hidden sm:block opacity-60" />
        <PixelFrameAccent className="absolute bottom-20 right-4 z-[2] hidden sm:block opacity-60 rotate-180" />
        <PixelCornerCluster className="absolute top-24 right-8 z-[2] hidden md:flex flex-col gap-1" />

        <div className="relative z-10 text-center px-4">
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl text-foreground mb-2">A Safe Space</h1>
          <p className="font-heading text-3xl md:text-5xl lg:text-6xl text-primary italic">for Your Mind</p>

          <div className="flex items-center justify-center gap-4 mt-10">
            {loggedIn ? (
              <Link href="/forums" className="retro-btn px-8 py-3 text-sm tracking-widest flex items-center gap-2">
                Go to Forums
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </Link>
            ) : (
              <>
                <Link
                  href="/signup"
                  className="retro-btn px-8 py-3 text-sm tracking-widest flex items-center gap-2"
                >
                  Join
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </Link>
                <Link href="/login" className="retro-btn-outline px-8 py-3 text-sm tracking-widest">
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <section className="flex-1 bg-background py-12 md:py-16 relative">
        <PixelCornerCluster className="absolute left-4 top-8 hidden lg:flex flex-col gap-1" />
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 bg-primary" />
              <h2 className="text-sm tracking-[0.2em] text-muted-foreground">Recent Posts</h2>
            </div>
            <Link
              href="/forums"
              className="text-xs text-primary hover:text-primary/80 transition-colors tracking-wider"
            >
              View All
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {displayCards.map((post) => (
              <article key={post.key} className="terminal-window p-0 relative overflow-hidden">
                <div className="absolute top-2 right-2 opacity-40 pointer-events-none hidden sm:block">
                  <PixelCornerCluster className="flex-col gap-0.5" />
                </div>
                <div className="terminal-header">
                  <span className="text-xs text-muted-foreground">{post.time || "—"}</span>
                  <post.icon className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
                </div>
                <div className="p-5">
                  <p className="font-serif text-sm text-foreground leading-relaxed mb-6">{post.content}</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-secondary border border-border flex items-center justify-center text-xs text-muted-foreground">
                      {post.user.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs text-foreground">{post.user}</p>
                      <p className="text-xs text-primary">{post.memberSince || "Community"}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary border-y border-border py-6 relative overflow-hidden">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.07] pointer-events-none">
          <PixelFrameAccent className="w-32 h-32 text-primary" />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="status-dot" />
              <div>
                <p className="text-xs tracking-wider text-foreground">Community Online</p>
                <p className="text-xs text-primary">
                  {memberCount !== null ? `${memberCount} members` : "—"} active now
                </p>
              </div>
            </div>
            <div className="flex items-center gap-8 md:gap-12">
              <div className="text-center">
                <p className="text-2xl md:text-3xl text-foreground">24/7</p>
                <p className="text-xs text-primary tracking-wider">Support</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl text-foreground">100%</p>
                <p className="text-xs text-primary tracking-wider">Anonymous</p>
              </div>
              <div className="text-center">
                <p className="text-2xl md:text-3xl text-foreground">Free</p>
                <p className="text-xs text-primary tracking-wider">Always</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
