"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { NotificationDropdown } from "./notification-dropdown"
import { UserMenu } from "./user-menu"

const navItems = [
  { href: "/forums", label: "Forums" },
  { href: "/resources", label: "Resources" },
  { href: "/crisis", label: "Get Help" },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="border-b border-border bg-background sticky top-0 z-50">
      <div className="bg-primary text-primary-foreground">
        <div className="max-w-7xl mx-auto px-4 py-1.5">
          <p className="text-[11px] tracking-wider">
            Internet Harbor is in beta — you may encounter bugs and changes. Thanks for sailing with us early ⚓
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-foreground hover:text-primary transition-colors">
          <span className="font-sans text-lg tracking-wide">The Internet Harbor</span>
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
            <Search className="w-4 h-4 text-muted-foreground" strokeWidth={2} />
            <span className="text-sm text-muted-foreground w-24">Search...</span>
          </Link>
          <NotificationDropdown />
          <UserMenu />
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
