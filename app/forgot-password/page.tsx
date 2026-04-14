"use client"

import { useState } from "react"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { Square, Minus, AtSign, ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")

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
                <span className="text-xs text-muted-foreground tracking-wider">Reset Password</span>
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
              {/* Back Link */}
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>

              {/* Title */}
              <div className="text-center mb-8">
                <h1 className="font-heading text-3xl text-foreground mb-2">Forgot Password?</h1>
                <p className="text-sm text-muted-foreground">
                  No worries. Enter your email and we&apos;ll send you a reset link.
                </p>
              </div>

              {/* Form */}
              <form className="space-y-6">
                {/* Email */}
                <div>
                  <label className="block text-xs text-muted-foreground tracking-wider mb-2">
                    Email Address
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

                {/* Submit Button */}
                <button
                  type="submit"
                  className="retro-btn w-full py-4 text-sm tracking-widest"
                >
                  Send Reset Link
                </button>
              </form>

              {/* Help Text */}
              <div className="mt-8 pt-6 border-t border-border text-center">
                <p className="text-xs text-muted-foreground">
                  Remember your password?{" "}
                  <Link href="/login" className="text-primary hover:text-primary/80">
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
