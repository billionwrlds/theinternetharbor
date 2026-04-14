"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { NotificationDropdown } from "./notification-dropdown"

const navItems = [
  { href: "/forums", label: "Forums" },
  { href: "/logs", label: "My Posts" },
  { href: "/resources", label: "Resources" },
  { href: "/crisis", label: "Get Help" },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-foreground hover:text-primary transition-colors">
          <span className="font-heading text-lg tracking-wide">Safe Harbor</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm tracking-wider transition-colors relative py-4",
                pathname === item.href || pathname.startsWith(item.href + "/")
                  ? "text-foreground border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link 
            href="/search"
            className="hidden sm:flex items-center gap-2 bg-secondary border border-border px-3 py-1.5 hover:border-muted-foreground transition-colors"
          >
            <Search className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground w-24">Search...</span>
          </Link>
          <NotificationDropdown />
          <Link
            href="/profile"
            className="w-8 h-8 border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
          >
            <User className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav className="md:hidden flex items-center justify-center gap-6 py-2 border-t border-border">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-xs tracking-wider transition-colors",
              pathname === item.href || pathname.startsWith(item.href + "/")
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
