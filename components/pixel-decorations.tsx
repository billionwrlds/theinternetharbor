import { cn } from "@/lib/utils"

/** Small 8-bit style corner accents for empty or plain sections */
export function PixelCornerCluster({ className }: { className?: string }) {
  return (
    <div
      className={cn("pointer-events-none flex gap-0.5 text-primary/50", className)}
      aria-hidden
    >
      <span className="w-1.5 h-1.5 bg-current" />
      <span className="w-1.5 h-1.5 bg-current opacity-70" />
      <span className="w-1.5 h-1.5 bg-current opacity-40" />
    </div>
  )
}

export function PixelFrameAccent({ className }: { className?: string }) {
  return (
    <svg
      className={cn("text-primary/35", className)}
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
    >
      <path fill="currentColor" d="M0 0h8v8H0V0zm56 0h8v8h-8V0zM0 56h8v8H0v-8zm56 0h8v8h-8v-8z" />
      <path fill="currentColor" d="M8 0h4v4H8V0zm52 0h4v4h-4V0zM0 8v4h4V8H0zm60 0h4v4h-4V8zM0 52v4h4v-4H0zm60 0h4v4h-4v-4zM8 60h4v4H8v-4zm52 0h4v4h-4v-4z" />
    </svg>
  )
}
