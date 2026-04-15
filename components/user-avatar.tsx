"use client"

/**
 * UserAvatar
 *
 * Renders the right avatar for a user:
 *   1. Uploaded photo — only if avatar_url is a storage URL AND avatar_approved = true
 *   2. Preset colour swatch — if avatar_url starts with "preset:"
 *   3. Pixel-art placeholder — fallback for everything else
 *
 * Pass `size` as a Tailwind w-/h- value pair, e.g. "w-10 h-10".
 */

import Image from "next/image"

const PRESET_COLORS: Record<number, string> = {
  1: "bg-primary/30",
  2: "bg-blue-500/30",
  3: "bg-purple-500/30",
  4: "bg-orange-500/30",
  5: "bg-pink-500/30",
  6: "bg-green-500/30",
}

interface UserAvatarProps {
  avatarUrl: string | null | undefined
  avatarApproved: boolean | null | undefined
  size?: string
  className?: string
}

export function UserAvatar({
  avatarUrl,
  avatarApproved,
  size = "w-10 h-10",
  className = "",
}: UserAvatarProps) {
  const isUploadedAndApproved =
    !!avatarUrl &&
    !avatarUrl.startsWith("preset:") &&
    avatarApproved === true

  const presetId =
    avatarUrl?.startsWith("preset:")
      ? parseInt(avatarUrl.replace("preset:", ""), 10)
      : null

  const presetColor =
    presetId && PRESET_COLORS[presetId] ? PRESET_COLORS[presetId] : null

  if (isUploadedAndApproved) {
    return (
      <div
        className={`${size} border border-border shrink-0 overflow-hidden relative ${className}`}
      >
        <Image
          src={avatarUrl!}
          alt="User avatar"
          fill
          className="object-cover"
          unoptimized
        />
      </div>
    )
  }

  if (presetColor) {
    return (
      <div
        className={`${size} ${presetColor} border border-border shrink-0 flex items-center justify-center ${className}`}
      >
        <PixelFace />
      </div>
    )
  }

  return (
    <div
      className={`${size} bg-secondary border border-border shrink-0 flex items-center justify-center ${className}`}
    >
      <PixelFace />
    </div>
  )
}

function PixelFace() {
  return (
    <svg
      viewBox="0 0 16 16"
      className="w-[60%] h-[60%]"
      style={{ imageRendering: "pixelated" }}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* head */}
      <rect x="3" y="1" width="10" height="11" fill="currentColor" opacity="0.25" />
      {/* eyes */}
      <rect x="5" y="4" width="2" height="2" fill="currentColor" opacity="0.8" />
      <rect x="9" y="4" width="2" height="2" fill="currentColor" opacity="0.8" />
      {/* mouth */}
      <rect x="5" y="8" width="1" height="1" fill="currentColor" opacity="0.8" />
      <rect x="6" y="9" width="4" height="1" fill="currentColor" opacity="0.8" />
      <rect x="10" y="8" width="1" height="1" fill="currentColor" opacity="0.8" />
      {/* body */}
      <rect x="4" y="12" width="8" height="3" fill="currentColor" opacity="0.2" />
    </svg>
  )
}
