import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MessageSquare, FileText, Heart } from "lucide-react"

const recentPosts = [
  {
    id: 1,
    time: "2 hours ago",
    icon: MessageSquare,
    content: "\"Finally found a place where I can just be myself. The quiet here helps me think clearly for the first time in months.\"",
    user: "anonymous_user",
    memberSince: "Member since Oct 2024",
  },
  {
    id: 2,
    time: "4 hours ago",
    icon: FileText,
    content: "\"Thank you to whoever recommended the sleep resources. I&apos;m finally getting some rest. Small wins matter.\"",
    user: "night_owl_23",
    memberSince: "Member since Sep 2024",
  },
  {
    id: 3,
    time: "6 hours ago",
    icon: Heart,
    content: "\"To anyone reading this late at night: you&apos;re not alone. We&apos;re all here, just listening and supporting each other.\"",
    user: "kind_stranger",
    memberSince: "Member since Aug 2024",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative h-[500px] md:h-[550px] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/harbor-hero.jpg"
          alt="Peaceful harbor at dusk"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background" />
        
        <div className="relative z-10 text-center px-4">
          <h1 className="font-heading text-4xl md:text-6xl lg:text-7xl text-foreground mb-2">
            A Safe Space
          </h1>
          <p className="font-heading text-3xl md:text-5xl lg:text-6xl text-primary italic">
            for Your Mind
          </p>
          
          <div className="flex items-center justify-center gap-4 mt-10">
            <Link
              href="/signup"
              className="retro-btn px-8 py-3 text-sm tracking-widest flex items-center gap-2"
            >
              Join
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M7 17L17 7M17 7H7M17 7V17" />
              </svg>
            </Link>
            <Link
              href="/login"
              className="retro-btn-outline px-8 py-3 text-sm tracking-widest"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Posts Section */}
      <section className="flex-1 bg-background py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
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
            {recentPosts.map((post) => (
              <article
                key={post.id}
                className="terminal-window p-0"
              >
                <div className="terminal-header">
                  <span className="text-xs text-muted-foreground">{post.time}</span>
                  <post.icon className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="p-5">
                  <p className="font-serif text-sm text-foreground leading-relaxed mb-6">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-secondary border border-border flex items-center justify-center text-xs text-muted-foreground">
                      {post.user.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-xs text-foreground">{post.user}</p>
                      <p className="text-xs text-primary">{post.memberSince}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Status Bar */}
      <section className="bg-secondary border-y border-border py-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="status-dot" />
              <div>
                <p className="text-xs tracking-wider text-foreground">Community Online</p>
                <p className="text-xs text-primary">2,412 members active now</p>
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
