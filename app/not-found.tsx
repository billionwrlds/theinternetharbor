import Link from "next/link"
import { Footer } from "@/components/footer"
import { Home, ArrowLeft, Search } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-yellow-500" />
                <span className="text-xs text-muted-foreground tracking-wider">Error 404</span>
              </div>
            </div>
            <div className="p-8">
              {/* Error Code */}
              <div className="font-heading text-8xl text-primary mb-4">404</div>

              {/* Message */}
              <h1 className="font-heading text-2xl text-foreground mb-2">Page Not Found</h1>
              <p className="text-sm text-muted-foreground mb-8">
                The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
              </p>

              {/* Actions */}
              <div className="space-y-3">
                <Link
                  href="/"
                  className="retro-btn w-full py-3 text-xs tracking-widest flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </Link>
                <Link
                  href="/forums"
                  className="retro-btn-outline w-full py-3 text-xs tracking-widest flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Browse Forums
                </Link>
                <Link
                  href="/search"
                  className="retro-btn-outline w-full py-3 text-xs tracking-widest flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Search
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
