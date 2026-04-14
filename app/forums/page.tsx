import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MessageSquare, Bookmark, Plus, Share2, Users } from "lucide-react"

const categories = [
  { id: "all", label: "All Posts", active: true },
  { id: "vent", label: "Vent", active: false },
  { id: "advice", label: "Advice", active: false },
  { id: "wins", label: "Wins", active: false },
  { id: "college", label: "College Life", active: false },
]

const threads = [
  {
    id: "8829-X",
    title: "Finding peace during exam season",
    category: "Advice",
    posted: "2 hours ago",
    excerpt: "The library is finally empty at 3 AM. Does anyone else find the silence of these large halls more comforting than their actual room? Looking for tips on maintaining focus without burnout...",
    comments: 24,
    likes: 156,
  },
  {
    id: "4412-Z",
    title: "Small Win: Finished my project a week early",
    category: "Wins",
    posted: "5 hours ago",
    excerpt: "Finally broke the cycle of procrastination. It feels like I can breathe again. Going to spend the whole weekend relaxing and celebrating this small victory...",
    comments: 12,
    likes: 89,
  },
  {
    id: "1092-B",
    title: "Does anyone else feel overwhelmed lately?",
    category: "Vent",
    posted: "8 hours ago",
    excerpt: "Just a general vent about the weight of expectations. It feels like everyone else has it figured out except me. Hard to explain the feeling of being stuck...",
    comments: 45,
    likes: 312,
  },
]

const sidebarLinks = [
  { icon: MessageSquare, label: "All Posts", href: "/forums", active: true },
  { icon: Users, label: "Mentors", href: "/forums/mentors", active: false },
  { icon: Bookmark, label: "Saved Posts", href: "/forums/saved", active: false },
]

export default function ForumsPage() {
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
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={cat.id === "all" ? "/forums" : `/forums/category/${cat.id}`}
                    className={`px-4 py-2 text-xs tracking-wider border transition-colors ${
                      cat.active
                        ? "bg-secondary border-primary text-foreground"
                        : "border-border text-muted-foreground hover:border-muted-foreground"
                    }`}
                  >
                    {cat.label}
                  </Link>
                ))}
              </div>

              {/* Thread List */}
              <div className="space-y-4">
                {threads.map((thread) => (
                  <article key={thread.id} className="terminal-window">
                    <div className="terminal-header">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-primary" />
                        <span className="text-xs text-muted-foreground">Post #{thread.id}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{thread.posted}</span>
                    </div>
                    <div className="p-5">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-secondary border border-border shrink-0 flex items-center justify-center">
                          <span className="text-muted-foreground text-lg">?</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <Link 
                              href={`/forums/thread/${thread.id}`}
                              className="font-heading text-lg text-foreground hover:text-primary transition-colors"
                            >
                              {thread.title}
                            </Link>
                            <span className={`tag shrink-0 ${
                              thread.category === "Advice" ? "tag-active" : ""
                            }`}>
                              {thread.category}
                            </span>
                          </div>
                          <p className="font-serif text-sm text-muted-foreground leading-relaxed mb-4">
                            {thread.excerpt}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <MessageSquare className="w-4 h-4" />
                                {thread.comments}
                              </span>
                              <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                                </svg>
                                {thread.likes}
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
                ))}
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
