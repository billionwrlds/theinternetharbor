import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Heart, MessageSquare, Plus, Grid, List, Search } from "lucide-react"

const posts = [
  {
    id: "902",
    title: "Finding calm in the chaos: A guide",
    date: "Oct 12, 2024",
    category: "Advice",
    excerpt: "There&apos;s a specific kind of peace that comes when you stop fighting your feelings. I&apos;ve learned that accepting where I am is the first step to moving forward...",
    likes: "1.2k",
    comments: 45,
    author: "quiet_mind_22",
  },
  {
    id: "884",
    title: "The ups and downs of recovery",
    date: "Oct 5, 2024",
    category: "Reflection",
    excerpt: "Some days feel like progress, others feel like starting over. Recognizing that this is normal has been the biggest help...",
    likes: "843",
    comments: 12,
    author: "morning_coffee",
  },
  {
    id: "856",
    title: "Creating my safe space",
    date: "Sep 28, 2024",
    category: "Wins",
    excerpt: "Finally set up a corner in my room that&apos;s just for me. A place to breathe and think without distractions...",
    likes: "3.1k",
    comments: 156,
    author: "night_owl_23",
  },
  {
    id: "812",
    title: "When expectations feel too heavy",
    date: "Sep 20, 2024",
    category: "Vent",
    excerpt: "They keep asking when I&apos;ll be \"back to normal.\" What they don&apos;t understand is that I&apos;m finding my own version of okay...",
    likes: "2.4k",
    comments: 89,
    author: "kind_stranger",
  },
]

export default function LogsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-background">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-heading text-3xl md:text-4xl text-foreground">My Posts</h1>
              <p className="text-xs text-muted-foreground tracking-wider mt-1">
                Your posts and contributions to the community
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 border border-primary bg-secondary flex items-center justify-center text-foreground">
                <Grid className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 border border-border flex items-center justify-center text-muted-foreground hover:border-muted-foreground transition-colors">
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search/Filter Bar */}
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
                <button className="px-4 py-2 text-xs tracking-wider border border-primary bg-secondary text-foreground">
                  All
                </button>
                <button className="px-4 py-2 text-xs tracking-wider border border-border text-muted-foreground hover:border-muted-foreground">
                  Advice
                </button>
                <button className="px-4 py-2 text-xs tracking-wider border border-border text-muted-foreground hover:border-muted-foreground">
                  Wins
                </button>
              </div>
            </div>
          </div>

          {/* Posts List */}
          <div className="space-y-4">
            {posts.map((post) => (
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
                        <span className="text-xs text-muted-foreground">{post.date}</span>
                        <span className="tag tag-active">{post.category}</span>
                      </div>
                    </div>
                    <span className="text-xs text-primary shrink-0">#{post.id}</span>
                  </div>
                  
                  <p className="font-serif text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Heart className="w-4 h-4" />
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MessageSquare className="w-4 h-4" />
                        {post.comments}
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
            ))}
          </div>

          {/* Load More */}
          <div className="flex justify-center mt-8">
            <button className="retro-btn-outline px-6 py-2.5 text-xs tracking-widest">
              Load More Posts
            </button>
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <Link href="/forums/create" className="fixed bottom-6 right-6 w-14 h-14 retro-btn flex items-center justify-center">
        <Plus className="w-6 h-6" />
      </Link>

      <Footer />
    </div>
  )
}
