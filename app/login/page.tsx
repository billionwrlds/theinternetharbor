"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Footer } from "@/components/footer"
import { Square, Minus, Eye, EyeOff, AtSign } from "lucide-react"
import { createClient } from "@/lib/supabase"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (signInError) {
        setError(signInError.message)
        return
      }
      router.push("/forums")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Terminal Window */}
          <div className="terminal-window">
            {/* Terminal Header */}
            <div className="terminal-header">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-primary" />
                <span className="text-xs text-muted-foreground tracking-wider">Login</span>
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
            <div className="p-8">
              {/* Title */}
              <div className="text-center mb-8">
                <h1 className="font-heading text-3xl text-foreground mb-2">Safe Harbor</h1>
                <p className="text-xs text-primary tracking-widest">Welcome back</p>
              </div>

              {/* Form */}
              <form className="space-y-6" onSubmit={onSubmit}>
                {error && (
                  <div className="border border-destructive/50 bg-destructive/10 p-3">
                    <p className="text-xs text-destructive tracking-wider">{error}</p>
                  </div>
                )}
                {/* Email */}
                <div>
                  <label className="block text-xs text-muted-foreground tracking-wider mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full bg-secondary border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary px-4 py-3 pr-10"
                    />
                    <AtSign className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs text-muted-foreground tracking-wider mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full bg-secondary border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary px-4 py-3 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="retro-btn w-full py-4 text-sm tracking-widest mt-8"
                  disabled={submitting}
                >
                  {submitting ? "Signing in…" : "Login"}
                </button>

                {/* Links */}
                <div className="flex items-center justify-between pt-2">
                  <Link
                    href="/signup"
                    className="text-xs text-primary hover:text-primary/80 transition-colors tracking-wider"
                  >
                    Create Account
                  </Link>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors tracking-wider"
                  >
                    Forgot Password?
                  </Link>
                </div>
              </form>

              {/* Security Status */}
              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="status-dot" />
                    <span className="text-xs text-muted-foreground">Secure Connection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-3 bg-primary" />
                    <span className="text-xs text-muted-foreground">Encrypted</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
