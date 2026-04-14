"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Terminal, X, Minus, Square, Send } from "lucide-react"
import { createClient } from "@/lib/supabase"

const categories = [
  { id: "vent", label: "Vent", slug: "vent" },
  { id: "advice", label: "Advice", slug: "advice" },
  { id: "wins", label: "Wins", slug: "wins" },
  { id: "college", label: "College Life", slug: "college-life" },
]

export default function CreatePostPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [postAnonymously, setPostAnonymously] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("vent")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const trimmedTitle = title.trim()
    const trimmedBody = content.trim()
    if (!trimmedTitle || !trimmedBody) {
      setError("Please add a title and message.")
      return
    }

    const cat = categories.find((c) => c.id === selectedCategory)
    if (!cat) {
      setError("Invalid category.")
      return
    }

    setSubmitting(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        setError("You must be logged in to post.")
        router.push("/login")
        return
      }

      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle()

      if (!existingProfile) {
        const { error: profileError } = await supabase.from("profiles").insert({ id: user.id })
        if (profileError) {
          setError(profileError.message)
          return
        }
      }

      const { data: categoryRow, error: categoryError } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", cat.slug)
        .maybeSingle()

      if (categoryError || !categoryRow) {
        setError(categoryError?.message ?? "Category not found. Run the schema seed in Supabase.")
        return
      }

      const { data: post, error: insertError } = await supabase
        .from("posts")
        .insert({
          author_id: user.id,
          category_id: categoryRow.id,
          title: trimmedTitle,
          body: trimmedBody,
          is_anonymous: postAnonymously,
        })
        .select("id")
        .single()

      if (insertError || !post) {
        setError(insertError?.message ?? "Could not create post.")
        return
      }

      router.push(`/forums/thread/${post.id}`)
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-background flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-3xl">
          {/* Terminal Window */}
          <div className="terminal-window">
            {/* Terminal Header */}
            <div className="terminal-header">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground tracking-wider">Create New Post</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <Square className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Form Content */}
            <form className="p-6 md:p-8" onSubmit={onSubmit}>
              {error && (
                <div className="mb-6 border border-destructive/50 bg-destructive/10 p-3">
                  <p className="text-xs text-destructive tracking-wider">{error}</p>
                </div>
              )}
              {/* Category Selection */}
              <div className="mb-6">
                <label className="block text-xs text-muted-foreground tracking-wider mb-2">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-2 text-xs tracking-wider border transition-colors ${
                        selectedCategory === cat.id
                          ? "bg-secondary border-primary text-foreground"
                          : "border-border text-muted-foreground hover:border-muted-foreground"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="mb-6">
                <label className="block text-xs text-muted-foreground tracking-wider mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What&apos;s on your mind?"
                  className="w-full bg-transparent border-b border-border text-xl text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary py-3 font-heading"
                />
              </div>

              {/* Body Content */}
              <div className="mb-6">
                <label className="block text-xs text-muted-foreground tracking-wider mb-2">
                  Your Message
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Share your thoughts... This is a safe space."
                  rows={12}
                  className="w-full bg-secondary border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary p-4 font-serif leading-relaxed resize-y"
                />
              </div>

              {/* Options */}
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <button
                  type="button"
                  onClick={() => setPostAnonymously(!postAnonymously)}
                  className={`flex items-center gap-2 px-3 py-1.5 border text-xs tracking-wider transition-colors ${
                    postAnonymously
                      ? "border-primary text-primary"
                      : "border-border text-muted-foreground hover:border-muted-foreground"
                  }`}
                >
                  <span className={`w-1.5 h-3 ${postAnonymously ? "bg-primary" : "bg-muted-foreground"}`} />
                  Post Anonymously: {postAnonymously ? "Yes" : "No"}
                </button>
                <div className="flex items-center gap-2 px-3 py-1.5 border border-border text-xs text-muted-foreground tracking-wider">
                  <span className="w-1.5 h-3 bg-primary" />
                  Encrypted
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between">
                <Link
                  href="/forums"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={submitting}
                  className="retro-btn px-8 py-3 text-sm tracking-widest flex items-center gap-3"
                >
                  {submitting ? "Posting…" : "Post"}
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
