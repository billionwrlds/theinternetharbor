"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { ensureProfileExists } from "@/lib/profile"
import { cn } from "@/lib/utils"

type ReactionButtonProps = {
  target: "post" | "comment"
  postId: string
  commentId?: string
  count: number
  liked: boolean
  allowInteract: boolean
  onUpdated: (nextCount: number, nextLiked: boolean) => void
  className?: string
  label?: string
}

export function ReactionButton({
  target,
  postId,
  commentId,
  count,
  liked,
  allowInteract,
  onUpdated,
  className,
  label = "Support",
}: ReactionButtonProps) {
  const [busy, setBusy] = useState(false)

  async function toggle() {
    if (!allowInteract || busy) return
    setBusy(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      await ensureProfileExists(user.id)

      if (liked) {
        if (target === "post") {
          const { error } = await supabase
            .from("reactions")
            .delete()
            .eq("user_id", user.id)
            .eq("post_id", postId)
            .eq("target", "post")
          if (error) throw error
        } else if (commentId) {
          const { error } = await supabase
            .from("reactions")
            .delete()
            .eq("user_id", user.id)
            .eq("comment_id", commentId)
            .eq("target", "comment")
          if (error) throw error
        }
        onUpdated(Math.max(0, count - 1), false)
      } else {
        if (target === "post") {
          const { error } = await supabase.from("reactions").insert({
            user_id: user.id,
            target: "post",
            post_id: postId,
            type: "like",
          })
          if (error) throw error
        } else if (commentId) {
          const { error } = await supabase.from("reactions").insert({
            user_id: user.id,
            target: "comment",
            comment_id: commentId,
            type: "like",
          })
          if (error) throw error
        }
        onUpdated(count + 1, true)
      }
    } catch {
      // RLS or network — avoid console noise; parent state unchanged on hard failure
    } finally {
      setBusy(false)
    }
  }

  return (
    <button
      type="button"
      onClick={() => void toggle()}
      disabled={!allowInteract || busy}
      title={!allowInteract ? "Log in to show support" : undefined}
      className={cn(
        "retro-btn-outline px-4 py-2.5 text-xs tracking-wider flex items-center justify-center gap-2",
        liked && "border-primary text-primary bg-secondary/50",
        !allowInteract && "opacity-60 cursor-not-allowed",
        className
      )}
    >
      <Heart className={cn("w-4 h-4 shrink-0", liked && "fill-primary text-primary")} strokeWidth={2} />
      {label} ({count})
    </button>
  )
}
