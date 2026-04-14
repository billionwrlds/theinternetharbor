import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { FileX, ArrowLeft, Home } from "lucide-react"

export default function PostNotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-background flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500" />
                <span className="text-xs text-muted-foreground tracking-wider">Post Not Found</span>
              </div>
            </div>
            <div className="p-8">
              {/* Icon */}
              <div className="w-20 h-20 bg-red-500/10 border border-red-500/50 flex items-center justify-center mx-auto mb-6">
                <FileX className="w-10 h-10 text-red-400" />
              </div>

              {/* Message */}
              <h1 className="font-heading text-2xl text-foreground mb-2">Post Not Found</h1>
              <p className="text-sm text-muted-foreground mb-6">
                This post may have been deleted, made private, or never existed. It might also have been removed for violating our community guidelines.
              </p>

              {/* Actions */}
              <div className="space-y-3">
                <Link
                  href="/forums"
                  className="retro-btn w-full py-3 text-xs tracking-widest flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Forums
                </Link>
                <Link
                  href="/"
                  className="retro-btn-outline w-full py-3 text-xs tracking-widest flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Go Home
                </Link>
              </div>

              {/* Help */}
              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Think this is a mistake?{" "}
                  <Link href="/contact" className="text-primary hover:text-primary/80">
                    Contact support
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
