import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { MessageSquare, Share2, ArrowLeft } from "lucide-react"

const categoryInfo: Record<string, { title: string; description: string; color: string }> = {
  vent: {
    title: "Vent",
    description: "A space to let it all out. No judgment, just support.",
    color: "bg-red-500/20 border-red-500/50",
  },
  advice: {
    title: "Advice",
    description: "Seeking or offering guidance for life&apos;s challenges.",
    color: "bg-blue-500/20 border-blue-500/50",
  },
  wins: {
    title: "Wins",
    description: "Celebrate your victories, big or small.",
    color: "bg-green-500/20 border-green-500/50",
  },
  college: {
    title: "College Life",
    description: "Navigating the unique challenges of student life.",
    color: "bg-purple-500/20 border-purple-500/50",
  },
}

const threads = [
  {
    id: "8829-X",
    title: "Finding peace during exam season",
    posted: "2 hours ago",
    excerpt: "The library is finally empty at 3 AM. Does anyone else find the silence of these large halls more comforting than their actual room?",
    comments: 24,
    likes: 156,
  },
  {
    id: "4412-Z",
    title: "Small Win: Finished my project a week early",
    posted: "5 hours ago",
    excerpt: "Finally broke the cycle of procrastination. It feels like I can breathe again.",
    comments: 12,
    likes: 89,
  },
  {
    id: "1092-B",
    title: "Does anyone else feel overwhelmed lately?",
    posted: "8 hours ago",
    excerpt: "Just a general vent about the weight of expectations. It feels like everyone else has it figured out except me.",
    comments: 45,
    likes: 312,
  },
]

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const category = categoryInfo[slug] || { title: "Category", description: "Browse posts in this category.", color: "bg-secondary border-border" }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-background">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Back Link */}
          <Link
            href="/forums"
            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Forums
          </Link>

          {/* Category Header */}
          <div className={`terminal-window mb-8 ${category.color}`}>
            <div className="p-6">
              <h1 className="font-heading text-3xl md:text-4xl text-foreground mb-2">{category.title}</h1>
              <p className="text-sm text-muted-foreground">{category.description}</p>
              <div className="flex items-center gap-4 mt-4">
                <span className="text-xs text-muted-foreground">{threads.length} posts</span>
                <span className="text-xs text-muted-foreground">1,204 members</span>
              </div>
            </div>
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
                      <Link 
                        href={`/forums/thread/${thread.id}`}
                        className="font-heading text-lg text-foreground hover:text-primary transition-colors block mb-2"
                      >
                        {thread.title}
                      </Link>
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
            <button className="retro-btn-outline px-6 py-2.5 text-xs tracking-widest">
              Load More Posts
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
