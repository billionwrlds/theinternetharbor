"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowLeft, Mail, Lock, Bell, Shield, Trash2, Save, Upload, X } from "lucide-react"
import { createClient } from "@/lib/supabase"
import { UserAvatar } from "@/components/user-avatar"

const AVATAR_OPTIONS = [
  { id: 1, color: "bg-primary/30" },
  { id: 2, color: "bg-blue-500/30" },
  { id: 3, color: "bg-purple-500/30" },
  { id: 4, color: "bg-orange-500/30" },
  { id: 5, color: "bg-pink-500/30" },
  { id: 6, color: "bg-green-500/30" },
]

const MAX_FILE_BYTES = 2 * 1024 * 1024 // 2 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"]

export default function SettingsPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [email, setEmail] = useState("")
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | null>(null)
  const [currentAvatarApproved, setCurrentAvatarApproved] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null)
  const [uploadPreview, setUploadPreview] = useState<string | null>(null)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveOk, setSaveOk] = useState<string | null>(null)

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
      const { data: { user } } = await supabase.auth.getUser()
      if (cancelled) return
      if (!user) { router.replace("/login"); return }
      if (user.email) setEmail(user.email)

      const { data: profile } = await supabase
        .from("profiles")
        .select("avatar_url, avatar_approved")
        .eq("id", user.id)
        .maybeSingle()
      if (cancelled) return
      if (profile) {
        setCurrentAvatarUrl(profile.avatar_url ?? null)
        setCurrentAvatarApproved(profile.avatar_approved ?? false)
        if (profile.avatar_url?.startsWith("preset:")) {
          const n = parseInt(profile.avatar_url.replace("preset:", ""), 10)
          if (!Number.isNaN(n) && n >= 1 && n <= 6) setSelectedPreset(n)
        }
      }
    }

    void load()
    return () => { cancelled = true }
  }, [router])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setUploadError(null)
    const file = e.target.files?.[0]
    if (!file) return

    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError("Only JPEG, PNG, GIF, or WebP images are allowed.")
      return
    }
    if (file.size > MAX_FILE_BYTES) {
      setUploadError("Image must be under 2 MB.")
      return
    }

    setSelectedPreset(null)
    setUploadFile(file)
    setUploadPreview(URL.createObjectURL(file))
  }

  function clearUpload() {
    setUploadFile(null)
    setUploadPreview(null)
    setUploadError(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  async function saveAll() {
    setSaveError(null)
    setSaveOk(null)
    setSaving(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.replace("/login"); return }

      let newAvatarUrl: string | undefined

      if (uploadFile) {
        setUploading(true)
        const ext = uploadFile.name.split(".").pop() ?? "jpg"
        const path = `${user.id}/avatar.${ext}`

        const { error: storageErr } = await supabase.storage
          .from("avatars")
          .upload(path, uploadFile, { upsert: true, contentType: uploadFile.type })

        setUploading(false)

        if (storageErr) {
          setSaveError(`Upload failed: ${storageErr.message}`)
          return
        }

        const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path)
        newAvatarUrl = urlData.publicUrl
      } else if (selectedPreset !== null) {
        newAvatarUrl = `preset:${selectedPreset}`
      }

      const updatePayload: Record<string, unknown> = { id: user.id }
      if (newAvatarUrl !== undefined) {
        updatePayload.avatar_url = newAvatarUrl
        // Uploaded photos go pending (avatar_approved = false) until an admin approves them.
        // Preset picks are always shown (avatar_approved = true).
        updatePayload.avatar_approved = uploadFile ? false : true
      }

      const { error: upsertError } = await supabase
        .from("profiles")
        .upsert(updatePayload, { onConflict: "id" })

      if (upsertError) { setSaveError(upsertError.message); return }

      if (newAvatarUrl !== undefined) {
        setCurrentAvatarUrl(newAvatarUrl)
        setCurrentAvatarApproved(uploadFile ? false : true)
      }

      clearUpload()
      setSaveOk(uploadFile
        ? "Photo uploaded! It will appear once approved."
        : "Saved.")
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Could not save.")
    } finally {
      setSaving(false)
      setUploading(false)
    }
  }

  const previewAvatarUrl = uploadPreview ?? (selectedPreset !== null ? `preset:${selectedPreset}` : currentAvatarUrl)
  const previewApproved = uploadPreview ? true : (selectedPreset !== null ? true : currentAvatarApproved)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-background">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </Link>

          <h1 className="font-heading text-3xl text-foreground mb-8">Settings</h1>

          {/* Profile Picture */}
          <div className="terminal-window mb-6">
            <div className="terminal-header">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground tracking-wider">Profile Picture</span>
              </div>
            </div>
            <div className="p-6">

              {/* Current preview */}
              <div className="flex items-center gap-5 mb-6">
                <UserAvatar
                  avatarUrl={previewAvatarUrl}
                  avatarApproved={previewApproved}
                  size="w-20 h-20"
                />
                <div>
                  <p className="text-sm text-foreground mb-1">
                    {uploadPreview
                      ? "Preview (not yet saved)"
                      : currentAvatarUrl && !currentAvatarUrl.startsWith("preset:") && !currentAvatarApproved
                        ? "Pending approval"
                        : "Current avatar"}
                  </p>
                  {currentAvatarUrl && !currentAvatarUrl.startsWith("preset:") && !currentAvatarApproved && (
                    <p className="text-xs text-primary tracking-wider">
                      Your uploaded photo is awaiting admin review.
                    </p>
                  )}
                </div>
              </div>

              {/* Upload */}
              <div className="mb-5">
                <p className="text-xs text-muted-foreground tracking-wider mb-3">Upload a photo (max 2 MB · JPEG, PNG, GIF, WebP)</p>
                {uploadPreview ? (
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-foreground truncate max-w-[200px]">{uploadFile?.name}</span>
                    <button
                      type="button"
                      onClick={clearUpload}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="retro-btn-outline px-4 py-2 text-xs tracking-widest flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Choose file
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={ALLOWED_TYPES.join(",")}
                  className="hidden"
                  onChange={handleFileChange}
                />
                {uploadError && (
                  <p className="text-xs text-destructive mt-2">{uploadError}</p>
                )}
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 border-t border-border" />
                <span className="text-xs text-muted-foreground tracking-wider">or pick a preset</span>
                <div className="flex-1 border-t border-border" />
              </div>

              {/* Presets */}
              <div className="flex flex-wrap gap-2">
                {AVATAR_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      clearUpload()
                      setSelectedPreset(opt.id)
                    }}
                    className={`w-10 h-10 ${opt.color} border transition-colors flex items-center justify-center ${
                      selectedPreset === opt.id && !uploadPreview
                        ? "border-primary"
                        : "border-border hover:border-muted-foreground"
                    }`}
                    aria-label={`Preset avatar ${opt.id}`}
                  >
                    <UserAvatar avatarUrl={`preset:${opt.id}`} avatarApproved={true} size="w-full h-full" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Email */}
          <div className="terminal-window mb-6">
            <div className="terminal-header">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground tracking-wider">Email</span>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-xs text-muted-foreground tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-secondary border border-border text-foreground focus:outline-none focus:border-primary px-4 py-3"
                />
              </div>
              <button className="retro-btn-outline px-4 py-2 text-xs tracking-widest">Update Email</button>
            </div>
          </div>

          {/* Password */}
          <div className="terminal-window mb-6">
            <div className="terminal-header">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground tracking-wider">Password</span>
              </div>
            </div>
            <div className="p-6">
              <p className="text-sm text-muted-foreground mb-4">Change your password to keep your account secure.</p>
              <Link href="/reset-password" className="retro-btn-outline px-4 py-2 text-xs tracking-widest inline-block">
                Change Password
              </Link>
            </div>
          </div>

          {/* Notifications */}
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
                    className={`w-12 h-6 border transition-colors relative ${
                      notifications[item.key as keyof typeof notifications] ? "bg-primary border-primary" : "bg-secondary border-border"
                    }`}
                  >
                    <span className={`absolute top-1 w-4 h-4 bg-foreground transition-transform ${
                      notifications[item.key as keyof typeof notifications] ? "right-1" : "left-1"
                    }`} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy */}
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
          <div className="terminal-window border-red-500/50 mb-6">
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

          {/* Save */}
          <div className="flex justify-end">
            <div className="flex items-center gap-3">
              {saveError && <p className="text-xs text-destructive tracking-wider">{saveError}</p>}
              {saveOk && <p className="text-xs text-primary tracking-wider">{saveOk}</p>}
              <button
                type="button"
                onClick={() => void saveAll()}
                disabled={saving || uploading}
                className="retro-btn px-8 py-3 text-sm tracking-widest flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {uploading ? "Uploading…" : saving ? "Saving…" : "Save All Changes"}
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
