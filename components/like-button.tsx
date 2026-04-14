"use client"

import { useState } from "react"
import { Heart } from "lucide-react"

interface LikeButtonProps {
  initialLikes: number
  initialLiked?: boolean
  size?: "sm" | "md"
}

export function LikeButton({ initialLikes, initialLiked = false, size = "md" }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked)
  const [likes, setLikes] = useState(initialLikes)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleLike = () => {
    if (!liked) {
      setIsAnimating(true)
      setTimeout(() => setIsAnimating(false), 600)
    }
    
    setLiked(!liked)
    setLikes(prev => liked ? prev - 1 : prev + 1)
  }

  const iconSize = size === "sm" ? "w-4 h-4" : "w-5 h-5"

  return (
    <button
      onClick={handleLike}
      className={`flex items-center gap-1.5 text-xs transition-colors relative ${
        liked ? "text-primary" : "text-muted-foreground hover:text-primary"
      }`}
    >
      <span className="relative">
        <Heart 
          className={`${iconSize} transition-transform ${liked ? "fill-primary" : ""} ${
            isAnimating ? "scale-125" : "scale-100"
          }`}
        />
        
        {/* Pixel heart burst animation */}
        {isAnimating && (
          <span className="absolute inset-0 pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <span
                key={i}
                className="absolute w-1 h-1 bg-primary animate-ping"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `rotate(${i * 60}deg) translateY(-12px)`,
                  animationDuration: "0.5s",
                  animationDelay: `${i * 50}ms`,
                }}
              />
            ))}
          </span>
        )}
      </span>
      <span>{likes}</span>
    </button>
  )
}
