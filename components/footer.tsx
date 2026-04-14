import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background py-6">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-heading text-sm text-foreground">The Internet Harbor</span>
          <span className="text-muted-foreground text-xs hidden sm:inline">
            &copy; 2026 The Internet Harbor. All rights reserved.
          </span>
        </div>
        <span className="text-muted-foreground text-xs sm:hidden">
          &copy; 2026 The Internet Harbor. All rights reserved.
        </span>
        <nav className="flex items-center gap-6">
          <Link
            href="/privacy"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors tracking-wider"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors tracking-wider"
          >
            Terms
          </Link>
          <Link
            href="/guidelines"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors tracking-wider"
          >
            Guidelines
          </Link>
          <Link
            href="/crisis"
            className="text-xs text-primary hover:text-primary/80 transition-colors tracking-wider"
          >
            Crisis Help
          </Link>
        </nav>
      </div>
    </footer>
  )
}
