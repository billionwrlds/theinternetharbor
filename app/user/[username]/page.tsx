import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Heart, MessageSquare, Grid, List, ArrowLeft } from "lucide-react"

const user = {
  name: "quiet_mind_22",
  bio: "Taking it one day at a time",
  status: "Online",
  statusMessage: "Learning to find peace in the small moments.",
  posts: 128,
  likes: "4.2k",
  joinDate: "March 2024",
}

const posts = [
  {
    id: "902",
    title: "Finding calm in the chaos: A guide",
    date: "Oct 12, 2024",
    category: "Advice",
    excerpt: "There&apos;s a specific kind of peace that comes when you stop fighting your feelings...",
    likes: "1.2k",
    comments: 45,
  },
  {
    id: "884",
    title: "The ups and downs of recovery",
    date: "Oct 5, 2024",
    category: "Reflection",
    excerpt: "Some days feel like progress, others feel like starting over...",
    likes: "843",
    comments: 12,
  },
  {
    id: "856",
    title: "Creating my safe space",
    date: "Sep 28, 2024",
    category: "Wins",
    excerpt: "Finally set up a corner in my room that&apos;s just for me...",
    likes: "3.1k",
    comments: 156,
  },
]

export default async function PublicProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Back Link */}
          <Link
            href="/forums"
            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Forums
          </Link>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Profile Sidebar */}
            <aside className="lg:w-80 shrink-0">
              {/* User Card */}
              <div className="terminal-window">
                <div className="p-6">
                  {/* Avatar */}
                  <div className="flex flex-col items-center mb-6">
                    <div className="w-32 h-32 bg-secondary border border-border mb-4 flex items-center justify-center">
                      <span className="text-muted-foreground text-4xl">?</span>
                    </div>
                    <span className="px-3 py-1 border border-primary text-xs text-primary tracking-wider">
                      {user.status}
                    </span>
                  </div>

                  {/* Name & Bio */}
                  <div className="text-center mb-6">
                    <h1 className="font-heading text-2xl text-foreground mb-1">{username}</h1>
                    <p className="text-xs text-primary tracking-wider">{user.bio}</p>
                  </div>

                  {/* Status Message */}
                  <div className="mb-6">
                    <div className="border-l-2 border-primary pl-4">
                      <p className="text-xs text-primary tracking-wider mb-2">About</p>
                      <p className="font-serif text-sm text-foreground italic leading-relaxed">
                        {user.statusMessage}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex justify-around mb-6 py-4 border-y border-border">
                    <div className="text-center">
                      <p className="text-xs text-primary tracking-wider mb-1">Posts</p>
                      <p className="text-2xl text-primary">{user.posts}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-primary tracking-wider mb-1">Likes</p>
                      <p className="text-2xl text-primary">{user.likes}</p>
                    </div>
                  </div>

                  {/* Member Since */}
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">Member since {user.joinDate}</p>
                  </div>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                  <h2 className="font-heading text-3xl text-foreground">{username}&apos;s Posts</h2>
                  <p className="text-xs text-muted-foreground tracking-wider mt-1">
                    Public posts from this member
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

              {/* Posts */}
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
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
