"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, User, FileText, Settings, LogIn, UserPlus, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { cn } from "@/lib/utils"

const itemClass =
  "flex items-center gap-2 px-3 py-2.5 text-xs text-foreground hover:bg-secondary/80 transition-colors tracking-wider w-full text-left"

export function UserMenu() {
  const [open, setOpen] = useState(false)
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()
    void supabase.auth.getSession().then(({ data: { session } }) => {
      setLoggedIn(!!session)
    })
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(!!session)
    })
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener("mousedown", handle)
    return () => document.removeEventListener("mousedown", handle)
  }, [open])

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    setOpen(false)
    router.refresh()
    router.push("/")
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center justify-center gap-0.5 h-8 min-w-8 px-1.5 border border-border",
          "text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
        )}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Account menu"
      >
        <User className="w-5 h-5 shrink-0" strokeWidth={2} />
        <ChevronDown className="w-3 h-3 shrink-0 opacity-70" strokeWidth={2} />
      </button>

      {open && (
          <div
            className="absolute right-0 top-full mt-1 w-52 terminal-window z-[60] py-1 shadow-lg"
            role="menu"
          >
            {loggedIn === null ? (
              <div className="px-3 py-2.5 text-xs text-muted-foreground tracking-wider">Loading…</div>
            ) : loggedIn ? (
              <>
                <Link href="/profile" className={itemClass} role="menuitem" onClick={() => setOpen(false)}>
                  <User className="w-4 h-4 text-primary shrink-0" strokeWidth={2} />
                  Profile
                </Link>
                <Link href="/logs" className={itemClass} role="menuitem" onClick={() => setOpen(false)}>
                  <FileText className="w-4 h-4 text-primary shrink-0" strokeWidth={2} />
                  My Posts
                </Link>
                <Link href="/settings" className={itemClass} role="menuitem" onClick={() => setOpen(false)}>
                  <Settings className="w-4 h-4 text-primary shrink-0" strokeWidth={2} />
                  Settings
                </Link>
                <button type="button" className={itemClass} role="menuitem" onClick={() => void signOut()}>
                  <LogOut className="w-4 h-4 text-primary shrink-0" strokeWidth={2} />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className={itemClass} role="menuitem" onClick={() => setOpen(false)}>
                  <LogIn className="w-4 h-4 text-primary shrink-0" strokeWidth={2} />
                  Login
                </Link>
                <Link href="/signup" className={itemClass} role="menuitem" onClick={() => setOpen(false)}>
                  <UserPlus className="w-4 h-4 text-primary shrink-0" strokeWidth={2} />
                  Join
                </Link>
              </>
            )}
          </div>
      )}
    </div>
  )
}
