import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ChevronUp, Reply, MoreHorizontal, Plus, Flag } from "lucide-react"

const post = {
  id: "4492",
  date: "May 24, 2024 at 2:20 PM",
  title: "Finding stillness in the digital",
  titleAccent: "chaos.",
  author: {
    name: "anonymous_user",
    joinDate: "Member since March 2024",
  },
  content: [
    "The feeling of being overwhelmed isn&apos;t always about having too much to do. Sometimes, it&apos;s the only place where the noise of the outside world finally fades into something manageable. I&apos;ve spent the last three months intentionally stepping back from social media and the constant need to be \"connected.\"",
    "What I found was a sense of peace I hadn&apos;t felt in years. This community has been part of that journey. It doesn&apos;t demand my attention; it simply offers a space when I need it. Does anyone else feel that the always-online world is becoming harder to navigate?",
  ],
  tags: ["mental health", "digital detox", "self-care"],
}

const comments = [
  {
    id: 1,
    author: "quiet_mind_22",
    time: "4 min ago",
    content: "The online world is designed to keep us constantly engaged and stressed. Coming here, to a calmer space, feels like taking a deep breath for the first time in years. Thank you for putting this into words.",
    likes: 24,
    replies: [
      {
        id: 11,
        author: "morning_coffee",
        time: "2 min ago",
        content: "Exactly. The design of this community is what makes it work. No endless feeds, just real conversations.",
      },
    ],
  },
  {
    id: 2,
    author: "late_night_thoughts",
    time: "1 hour ago",
    content: "Does the quiet ever feel too heavy for you? Sometimes when I disconnect, it gets so quiet that my thoughts get louder. How do you balance solitude with the need for some connection?",
    likes: 8,
    replies: [],
  },
]

export default function ThreadPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-background">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Thread Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-secondary border border-border text-xs text-muted-foreground tracking-wider">
                Post #{post.id}
              </span>
              <span className="text-xs text-muted-foreground">{post.date}</span>
            </div>
            <h1 className="font-heading text-3xl md:text-5xl text-foreground leading-tight">
              {post.title}
            </h1>
            <p className="font-heading text-3xl md:text-5xl text-primary">
              {post.titleAccent}
            </p>
          </div>

          {/* Main Post */}
          <article className="terminal-window mb-8">
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Author Sidebar */}
                <div className="md:w-48 shrink-0">
                  <div className="flex md:flex-col items-center md:items-start gap-4">
                    <div className="w-20 h-20 md:w-full md:h-auto md:aspect-square bg-secondary border border-border flex items-center justify-center">
                      <span className="text-muted-foreground text-2xl">?</span>
                    </div>
                    <div>
                      <p className="text-sm text-foreground">{post.author.name}</p>
                      <p className="text-xs text-primary">{post.author.joinDate}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex flex-col gap-2 mt-6">
                    <button className="retro-btn-outline px-4 py-2.5 text-xs tracking-wider flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      Support
                    </button>
                    <button className="retro-btn-outline px-4 py-2.5 text-xs tracking-wider flex items-center justify-center gap-2">
                      <Reply className="w-4 h-4" />
                      Reply
                    </button>
                    <button className="retro-btn-outline px-4 py-2.5 text-xs tracking-wider flex items-center justify-center gap-2 text-muted-foreground">
                      <Flag className="w-4 h-4" />
                      Report
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 border-t md:border-t-0 md:border-l border-border pt-6 md:pt-0 md:pl-6">
                  <div className="space-y-4">
                    {post.content.map((paragraph, index) => (
                      <p key={index} className="font-serif text-foreground leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-2 mt-8 pt-6 border-t border-border">
                    {post.tags.map((tag) => (
                      <span key={tag} className="tag">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Mobile Actions */}
                  <div className="flex md:hidden gap-2 mt-6">
                    <button className="retro-btn-outline flex-1 px-4 py-2.5 text-xs tracking-wider flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      Support
                    </button>
                    <button className="retro-btn-outline flex-1 px-4 py-2.5 text-xs tracking-wider flex items-center justify-center gap-2">
                      <Reply className="w-4 h-4" />
                      Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* Comments Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm tracking-[0.2em] text-foreground">Replies</h2>
            <span className="text-xs text-primary">12 responses</span>
          </div>

          {/* Comments */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="terminal-window">
                <div className="p-5">
                  {/* Comment Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-secondary border border-border shrink-0 flex items-center justify-center">
                        <span className="text-muted-foreground text-sm">?</span>
                      </div>
                      <div>
                        <span className="text-sm text-foreground">{comment.author}</span>
                        <span className="text-xs text-muted-foreground ml-2">- {comment.time}</span>
                      </div>
                    </div>
                    <button className="text-muted-foreground hover:text-foreground transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Comment Content */}
                  <p className="font-serif text-foreground leading-relaxed mb-4">
                    {comment.content}
                  </p>

                  {/* Comment Actions */}
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                      <ChevronUp className="w-4 h-4" />
                      Like ({comment.likes})
                    </button>
                    <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                      <Reply className="w-4 h-4" />
                      Reply
                    </button>
                  </div>

                  {/* Nested Replies */}
                  {comment.replies.length > 0 && (
                    <div className="mt-4 ml-6 pl-4 border-l border-border">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="py-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-secondary border border-border shrink-0 flex items-center justify-center">
                              <span className="text-muted-foreground text-xs">?</span>
                            </div>
                            <div>
                              <span className="text-sm text-foreground">{reply.author}</span>
                              <span className="text-xs text-muted-foreground ml-2">{reply.time}</span>
                            </div>
                          </div>
                          <p className="font-serif text-sm text-muted-foreground leading-relaxed">
                            {reply.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="flex justify-center mt-8">
            <button className="retro-btn-outline px-6 py-2.5 text-xs tracking-widest">
              Load More Replies
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
