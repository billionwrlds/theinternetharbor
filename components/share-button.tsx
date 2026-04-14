"use client"

import { useState } from "react"
import { Share2, Check, Link, Twitter, Copy } from "lucide-react"

interface ShareButtonProps {
  url: string
  title: string
  className?: string
}

export function ShareButton({ url, title, className = "" }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${url}` : url

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl)
      setCopied(true)
      setTimeout(() => {
        setCopied(false)
        setIsOpen(false)
      }, 1500)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`
    window.open(twitterUrl, "_blank")
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`text-muted-foreground hover:text-foreground transition-colors ${className}`}
      >
        <Share2 className="w-4 h-4" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 bottom-full mb-2 w-48 terminal-window z-50">
            <div className="p-2">
              <button
                onClick={copyToClipboard}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-xs text-foreground hover:bg-secondary transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-primary" />
                    <span className="text-primary">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
              <button
                onClick={shareToTwitter}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-xs text-foreground hover:bg-secondary transition-colors"
              >
                <Twitter className="w-4 h-4" />
                <span>Share on Twitter</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
