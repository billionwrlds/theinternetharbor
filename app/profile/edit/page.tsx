"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowLeft, User, Camera, Save } from "lucide-react"

const avatarOptions = [
  { id: 1, color: "bg-primary/30" },
  { id: 2, color: "bg-blue-500/30" },
  { id: 3, color: "bg-purple-500/30" },
  { id: 4, color: "bg-orange-500/30" },
  { id: 5, color: "bg-pink-500/30" },
  { id: 6, color: "bg-green-500/30" },
]

export default function EditProfilePage() {
  const [username, setUsername] = useState("quiet_mind_22")
  const [bio, setBio] = useState("Taking it one day at a time")
  const [statusMessage, setStatusMessage] = useState("Learning to find peace in the small moments. Some days are harder than others, but I'm getting there.")
  const [selectedAvatar, setSelectedAvatar] = useState(1)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-background">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Back Link */}
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </Link>

          {/* Page Title */}
          <h1 className="font-heading text-3xl text-foreground mb-8">Edit Profile</h1>

          {/* Form */}
          <div className="terminal-window">
            <div className="terminal-header">
              <span className="text-xs text-muted-foreground tracking-wider">Profile Settings</span>
            </div>
            <div className="p-6 md:p-8">
              {/* Avatar Selection */}
              <div className="mb-8">
                <label className="block text-xs text-muted-foreground tracking-wider mb-4">
                  Avatar
                </label>
                <div className="flex items-center gap-4">
                  {/* Selected Avatar Preview */}
                  <div className={`w-24 h-24 ${avatarOptions.find(a => a.id === selectedAvatar)?.color} border-2 border-primary flex items-center justify-center shrink-0`}>
                    <User className="w-12 h-12 text-foreground" />
                  </div>
                  
                  {/* Avatar Options */}
                  <div className="flex flex-wrap gap-2">
                    {avatarOptions.map((avatar) => (
                      <button
                        key={avatar.id}
                        type="button"
                        onClick={() => setSelectedAvatar(avatar.id)}
                        className={`w-10 h-10 ${avatar.color} border transition-colors flex items-center justify-center ${
                          selectedAvatar === avatar.id
                            ? "border-primary"
                            : "border-border hover:border-muted-foreground"
                        }`}
                      >
                        <User className="w-5 h-5 text-foreground" />
                      </button>
                    ))}
                    <button
                      type="button"
                      className="w-10 h-10 bg-secondary border border-border hover:border-muted-foreground transition-colors flex items-center justify-center"
                    >
                      <Camera className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Username */}
              <div className="mb-6">
                <label className="block text-xs text-muted-foreground tracking-wider mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-secondary border border-border text-foreground focus:outline-none focus:border-primary px-4 py-3"
                />
              </div>

              {/* Bio */}
              <div className="mb-6">
                <label className="block text-xs text-muted-foreground tracking-wider mb-2">
                  Short Bio
                </label>
                <input
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="A brief description"
                  maxLength={100}
                  className="w-full bg-secondary border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary px-4 py-3"
                />
                <p className="text-xs text-muted-foreground mt-1">{bio.length}/100 characters</p>
              </div>

              {/* Status Message */}
              <div className="mb-8">
                <label className="block text-xs text-muted-foreground tracking-wider mb-2">
                  About Me
                </label>
                <textarea
                  value={statusMessage}
                  onChange={(e) => setStatusMessage(e.target.value)}
                  rows={4}
                  placeholder="Share a bit about yourself..."
                  className="w-full bg-secondary border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary px-4 py-3 resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-border">
                <Link
                  href="/profile"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </Link>
                <button className="retro-btn px-6 py-3 text-xs tracking-widest flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
