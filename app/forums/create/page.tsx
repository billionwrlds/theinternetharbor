"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Terminal, X, Minus, Square, Send } from "lucide-react"

const categories = [
  { id: "vent", label: "Vent" },
  { id: "advice", label: "Advice" },
  { id: "wins", label: "Wins" },
  { id: "college", label: "College Life" },
]

export default function CreatePostPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [postAnonymously, setPostAnonymously] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("vent")

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
            <div className="p-6 md:p-8">
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
                <button className="retro-btn px-8 py-3 text-sm tracking-widest flex items-center gap-3">
                  Post
                  <Send className="w-4 h-4" />
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
