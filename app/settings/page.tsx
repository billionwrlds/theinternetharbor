"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowLeft, Mail, Lock, Bell, Shield, Trash2, Save } from "lucide-react"
import { createClient } from "@/lib/supabase"

export default function SettingsPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [notifications, setNotifications] = useState({
    replies: true,
    likes: false,
    mentions: true,
    digest: true,
  })

  useEffect(() => {
    let cancelled = false

    async function load() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (cancelled) return
      if (!user) {
        router.replace("/login")
        return
      }
      if (user.email) setEmail(user.email)
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [router])

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
          <h1 className="font-heading text-3xl text-foreground mb-8">Settings</h1>

          {/* Email Section */}
          <div className="terminal-window mb-6">
            <div className="terminal-header">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground tracking-wider">Email</span>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-xs text-muted-foreground tracking-wider mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-secondary border border-border text-foreground focus:outline-none focus:border-primary px-4 py-3"
                />
              </div>
              <button className="retro-btn-outline px-4 py-2 text-xs tracking-widest">
                Update Email
              </button>
            </div>
          </div>

          {/* Password Section */}
          <div className="terminal-window mb-6">
            <div className="terminal-header">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground tracking-wider">Password</span>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-muted-foreground mb-4">
                Change your password to keep your account secure.
              </p>
              <Link href="/reset-password" className="retro-btn-outline px-4 py-2 text-xs tracking-widest inline-block">
                Change Password
              </Link>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="terminal-window mb-6">
            <div className="terminal-header">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground tracking-wider">Notifications</span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {[
                { key: "replies", label: "Replies to my posts", description: "Get notified when someone replies to your posts" },
                { key: "likes", label: "Likes on my posts", description: "Get notified when someone likes your posts" },
                { key: "mentions", label: "Mentions", description: "Get notified when someone mentions you" },
                { key: "digest", label: "Weekly digest", description: "Receive a weekly summary of activity" },
              ].map((item) => (
                <div key={item.key} className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                    className={`w-12 h-6 border transition-colors ${
                      notifications[item.key as keyof typeof notifications]
                        ? "bg-primary border-primary"
                        : "bg-secondary border-border"
                    } relative`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-foreground transition-transform ${
                        notifications[item.key as keyof typeof notifications] ? "right-1" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy Section */}
          <div className="terminal-window mb-6">
            <div className="terminal-header">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground tracking-wider">Privacy</span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-foreground">Profile Visibility</p>
                  <p className="text-xs text-muted-foreground">Control who can see your profile and posts</p>
                </div>
                <select className="bg-secondary border border-border text-xs text-foreground px-3 py-2 focus:outline-none">
                  <option>Public</option>
                  <option>Members Only</option>
                  <option>Private</option>
                </select>
              </div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-foreground">Default Post Privacy</p>
                  <p className="text-xs text-muted-foreground">Set default privacy for new posts</p>
                </div>
                <select className="bg-secondary border border-border text-xs text-foreground px-3 py-2 focus:outline-none">
                  <option>Anonymous</option>
                  <option>Show Username</option>
                </select>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="terminal-window border-red-500/50">
            <div className="terminal-header bg-red-500/10">
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-red-400" />
                <span className="text-xs text-red-400 tracking-wider">Danger Zone</span>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-muted-foreground mb-4">
                Once you delete your account, there is no going back. Please be certain.
              </p>
              <button className="px-4 py-2 border border-red-500 text-red-400 text-xs tracking-widest hover:bg-red-500/10 transition-colors">
                Delete Account
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-8">
            <button className="retro-btn px-8 py-3 text-sm tracking-widest flex items-center gap-2">
              <Save className="w-4 h-4" />
              Save All Changes
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
