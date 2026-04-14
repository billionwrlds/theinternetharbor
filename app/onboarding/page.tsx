"use client"

import { useState } from "react"
import { Footer } from "@/components/footer"
import { Square, Minus, User, Camera, ChevronRight } from "lucide-react"

const avatarOptions = [
  { id: 1, color: "bg-primary/30" },
  { id: 2, color: "bg-blue-500/30" },
  { id: 3, color: "bg-purple-500/30" },
  { id: 4, color: "bg-orange-500/30" },
  { id: 5, color: "bg-pink-500/30" },
  { id: 6, color: "bg-green-500/30" },
]

export default function OnboardingPage() {
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState(1)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg">
          {/* Terminal Window */}
          <div className="terminal-window">
            {/* Terminal Header */}
            <div className="terminal-header">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-primary" />
                <span className="text-xs text-muted-foreground tracking-wider">Set Up Your Profile</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <Minus className="w-4 h-4" />
                </button>
                <button className="text-muted-foreground hover:text-foreground transition-colors">
                  <Square className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Title */}
              <div className="text-center mb-8">
                <h1 className="font-heading text-3xl text-foreground mb-2">Welcome to Safe Harbor</h1>
                <p className="text-sm text-muted-foreground">
                  Let&apos;s set up your profile. Don&apos;t worry, you can always change this later.
                </p>
              </div>

              {/* Avatar Selection */}
              <div className="mb-8">
                <label className="block text-xs text-muted-foreground tracking-wider mb-4">
                  Choose an Avatar
                </label>
                <div className="flex items-center gap-4">
                  {/* Selected Avatar Preview */}
                  <div className={`w-20 h-20 ${avatarOptions.find(a => a.id === selectedAvatar)?.color} border-2 border-primary flex items-center justify-center shrink-0`}>
                    <User className="w-10 h-10 text-foreground" />
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

              {/* Form */}
              <form className="space-y-5">
                {/* Username */}
                <div>
                  <label className="block text-xs text-muted-foreground tracking-wider mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    className="w-full bg-secondary border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary px-4 py-3"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    This is how other members will see you. You can use your real name or stay anonymous.
                  </p>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-xs text-muted-foreground tracking-wider mb-2">
                    Short Bio (optional)
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us a little about yourself..."
                    rows={3}
                    className="w-full bg-secondary border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary px-4 py-3 resize-none"
                  />
                </div>

                {/* Privacy Notice */}
                <div className="bg-secondary border border-border p-4">
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground">Privacy First:</strong> Your email is never shown publicly. You can post anonymously at any time, and you control what others can see on your profile.
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="retro-btn w-full py-4 text-sm tracking-widest flex items-center justify-center gap-2"
                >
                  Complete Setup
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Skip */}
                <div className="text-center">
                  <button type="button" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                    Skip for now
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
