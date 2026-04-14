import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Search, MessageSquare, Filter } from "lucide-react"

const searchResults = [
  {
    id: "8829-X",
    title: "Finding peace during exam season",
    category: "Advice",
    posted: "2 hours ago",
    excerpt: "The library is finally empty at 3 AM. Does anyone else find the silence of these large halls more comforting...",
    comments: 24,
    likes: 156,
    author: "quiet_mind_22",
  },
  {
    id: "4412-Z",
    title: "Small Win: Finished my project a week early",
    category: "Wins",
    posted: "5 hours ago",
    excerpt: "Finally broke the cycle of procrastination. It feels like I can breathe again...",
    comments: 12,
    likes: 89,
    author: "morning_coffee",
  },
  {
    id: "1092-B",
    title: "Does anyone else feel overwhelmed lately?",
    category: "Vent",
    posted: "8 hours ago",
    excerpt: "Just a general vent about the weight of expectations. It feels like everyone else has it figured out...",
    comments: 45,
    likes: 312,
    author: "night_owl_23",
  },
]

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q: query } = await searchParams

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-background">
        <div className="max-w-5xl mx-auto px-4 py-8">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="font-heading text-3xl md:text-4xl text-foreground mb-4">Search Results</h1>
            
            {/* Search Bar */}
            <div className="terminal-window">
              <div className="p-4 flex flex-col sm:flex-row gap-4">
                <div className="flex-1 flex items-center gap-2 bg-secondary border border-border px-3 py-2">
                  <Search className="w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    defaultValue={query || ""}
                    placeholder="Search posts, users, or topics..."
                    className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none flex-1"
                  />
                </div>
                <button className="retro-btn-outline px-4 py-2 text-xs tracking-widest flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
              </div>
            </div>
          </div>

          {/* Results Info */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-muted-foreground">
              {query ? (
                <>Showing {searchResults.length} results for &quot;<span className="text-foreground">{query}</span>&quot;</>
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

          {/* Results */}
          {query ? (
            <div className="space-y-4">
              {searchResults.map((result) => (
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
                          <span className="text-xs text-muted-foreground">{result.posted}</span>
                          <span className="text-xs text-muted-foreground">by <span className="text-primary">{result.author}</span></span>
                          <span className="tag tag-active">{result.category}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="font-serif text-sm text-muted-foreground leading-relaxed mb-4">
                      {result.excerpt}
                    </p>

                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MessageSquare className="w-4 h-4" />
                        {result.comments} replies
                      </span>
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        {result.likes} likes
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="terminal-window">
              <div className="p-12 text-center">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="font-heading text-xl text-foreground mb-2">Start Searching</h2>
                <p className="text-sm text-muted-foreground">
                  Enter a search term above to find posts, topics, or users.
                </p>
              </div>
            </div>
          )}

          {/* Load More */}
          {query && (
            <div className="flex justify-center mt-8">
              <button className="retro-btn-outline px-6 py-2.5 text-xs tracking-widest">
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
