"use client"

import { useState } from "react"
import { X, Trash2 } from "lucide-react"

interface DeleteModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void> | void
  type: "post" | "comment"
  title?: string
}

export function DeleteModal({ isOpen, onClose, onConfirm, type, title }: DeleteModalProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)
    try {
      await onConfirm()
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not delete.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      {/* Modal */}
      <div className="terminal-window w-full max-w-sm relative z-10">
        <div className="terminal-header">
          <div className="flex items-center gap-2">
            <Trash2 className="w-4 h-4 text-red-500" />
            <span className="text-xs text-muted-foreground tracking-wider">
              Delete {type === "post" ? "Post" : "Comment"}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-red-500/20 border border-red-500/50 mx-auto mb-4 flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <p className="text-foreground font-medium mb-2">
              Delete this {type}?
            </p>
            {title && (
              <p className="text-sm text-primary mb-2">&quot;{title}&quot;</p>
            )}
            <p className="text-sm text-muted-foreground">
              This action cannot be undone. All replies will also be removed.
            </p>
          </div>

          {error && (
            <p className="text-xs text-destructive tracking-wider mb-4 text-center">{error}</p>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isDeleting}
              className="retro-btn-outline flex-1 py-3 text-xs tracking-widest"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 py-3 text-xs tracking-widest bg-red-500/20 border border-red-500 text-red-400 hover:bg-red-500/30 transition-colors disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
