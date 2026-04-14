"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500" />
                <span className="text-xs text-muted-foreground tracking-wider">Error 500</span>
              </div>
            </div>
            <div className="p-8">
              {/* Icon */}
              <div className="w-20 h-20 bg-red-500/10 border border-red-500/50 flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-10 h-10 text-red-400" />
              </div>

              {/* Message */}
              <h1 className="font-heading text-2xl text-foreground mb-2">Something Went Wrong</h1>
              <p className="text-sm text-muted-foreground mb-8">
                We encountered an unexpected error. Our team has been notified and is working on a fix.
              </p>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={() => reset()}
                  className="retro-btn w-full py-3 text-xs tracking-widest flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
                <Link
                  href="/"
                  className="retro-btn-outline w-full py-3 text-xs tracking-widest flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </Link>
              </div>

              {/* Error Details (for development) */}
              {error.digest && (
                <div className="mt-8 pt-6 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    Error ID: <code className="text-primary">{error.digest}</code>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
