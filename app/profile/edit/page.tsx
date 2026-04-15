"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowLeft, User, Camera, Save } from "lucide-react"
import { createClient } from "@/lib/supabase"

const avatarOptions = [
  { id: 1, color: "bg-primary/30" },
  { id: 2, color: "bg-blue-500/30" },
  { id: 3, color: "bg-purple-500/30" },
  { id: 4, color: "bg-orange-500/30" },
  { id: 5, color: "bg-pink-500/30" },
  { id: 6, color: "bg-green-500/30" },
]

const USERNAME_RE = /^[a-zA-Z0-9_-]{3,30}$/

export default function EditProfilePage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState(1)
  const [avatarMode, setAvatarMode] = useState<"preset" | "uploaded">("preset")
  const [uploadedAvatarUrl, setUploadedAvatarUrl] = useState<string | null>(null)
  const [uploadedPreviewUrl, setUploadedPreviewUrl] = useState<string | null>(null)
  const [uploadedPending, setUploadedPending] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("username, bio, avatar_url, avatar_approved")
        .eq("id", user.id)
        .maybeSingle()

      if (cancelled) return
      if (profileError) {
        setError(profileError.message)
        setLoading(false)
        return
      }

      if (profile) {
        setUsername(profile.username ?? "")
        setBio(profile.bio ?? "")
        if (profile.avatar_url?.startsWith("preset:")) {
          const n = parseInt(profile.avatar_url.replace("preset:", ""), 10)
          if (!Number.isNaN(n) && n >= 1 && n <= 6) setSelectedAvatar(n)
          setAvatarMode("preset")
          setUploadedAvatarUrl(null)
          setUploadedPending(false)
        } else if (profile.avatar_url) {
          setAvatarMode("uploaded")
          setUploadedAvatarUrl(profile.avatar_url)
          setUploadedPending(profile.avatar_approved === false)
        }
      }

      setLoading(false)
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [router])

  useEffect(() => {
    return () => {
      if (uploadedPreviewUrl) URL.revokeObjectURL(uploadedPreviewUrl)
    }
  }, [uploadedPreviewUrl])

  async function onPickAvatarFile(file: File | null) {
    if (!file) return
    setError(null)

    const maxBytes = 2 * 1024 * 1024
    if (file.size > maxBytes) {
      setError("Avatar must be 2MB or smaller.")
      return
    }

    if (!/^image\/(png|jpe?g|gif|webp)$/i.test(file.type)) {
      setError("Please upload a PNG, JPG, GIF, or WebP image.")
      return
    }

    setUploading(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.replace("/login")
        return
      }

      // Local preview immediately
      if (uploadedPreviewUrl) URL.revokeObjectURL(uploadedPreviewUrl)
      const preview = URL.createObjectURL(file)
      setUploadedPreviewUrl(preview)

      const ext = file.name.split(".").pop()?.toLowerCase() || "png"
      const safeExt = ["png", "jpg", "jpeg", "gif", "webp"].includes(ext) ? ext : "png"
      const objectPath = `${user.id}/${Date.now()}-${Math.random().toString(16).slice(2)}.${safeExt}`

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(objectPath, file, { upsert: false, contentType: file.type })

      if (uploadError) throw new Error(uploadError.message)

      const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(objectPath)
      const publicUrl = urlData.publicUrl

      const { error: profErr } = await supabase
        .from("profiles")
        .upsert(
          {
            id: user.id,
            avatar_url: publicUrl,
            avatar_approved: false,
          },
          { onConflict: "id" }
        )

      if (profErr) throw new Error(profErr.message)

      setAvatarMode("uploaded")
      setUploadedAvatarUrl(publicUrl)
      setUploadedPending(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.")
    } finally {
      setUploading(false)
    }
  }

  async function onSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const u = username.trim()
    if (!USERNAME_RE.test(u)) {
      setError("Username must be 3–30 characters: letters, numbers, _ or - only.")
      return
    }

    setSaving(true)
    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.replace("/login")
        return
      }

      const { error: upsertError } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          username: u,
          display_name: u,
          bio: bio.trim() || null,
          avatar_url: avatarMode === "preset" ? `preset:${selectedAvatar}` : uploadedAvatarUrl,
          // Presets should never show up in admin approval queue.
          avatar_approved: avatarMode === "preset" ? true : undefined,
        },
        { onConflict: "id" }
      )

      if (upsertError) {
        if (upsertError.code === "23505" || upsertError.message.includes("duplicate")) {
          setError("That username is already taken.")
        } else {
          setError(upsertError.message)
        }
        return
      }

      router.push("/profile")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center bg-background">
          <p className="text-sm text-muted-foreground">Loading profile…</p>
        </main>
        <Footer />
      </div>
    )
  }

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

          <h1 className="font-heading text-3xl text-foreground mb-8">Edit Profile</h1>

          <form onSubmit={onSave}>
            <div className="terminal-window">
              <div className="terminal-header">
                <span className="text-xs text-muted-foreground tracking-wider">Profile Settings</span>
              </div>
              <div className="p-6 md:p-8">
                {error && (
                  <div className="mb-6 border border-destructive/50 bg-destructive/10 p-3">
                    <p className="text-xs text-destructive">{error}</p>
                  </div>
                )}

                <div className="mb-8">
                  <label className="block text-xs text-muted-foreground tracking-wider mb-4">Avatar</label>
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-24 h-24 ${
                        avatarMode === "preset"
                          ? avatarOptions.find((a) => a.id === selectedAvatar)?.color
                          : "bg-secondary"
                      } border-2 border-primary flex items-center justify-center shrink-0 overflow-hidden relative`}
                    >
                      {avatarMode === "uploaded" && (uploadedPreviewUrl || uploadedAvatarUrl) ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={uploadedPreviewUrl ?? uploadedAvatarUrl ?? ""}
                          alt="Avatar preview"
                          className="w-full h-full object-cover"
                          style={{ imageRendering: "pixelated" }}
                        />
                      ) : (
                        <User className="w-12 h-12 text-foreground" />
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {avatarOptions.map((avatar) => (
                        <button
                          key={avatar.id}
                          type="button"
                          onClick={() => {
                            setSelectedAvatar(avatar.id)
                            setAvatarMode("preset")
                            setUploadedPending(false)
                          }}
                          className={`w-10 h-10 ${avatar.color} border transition-colors flex items-center justify-center ${
                            selectedAvatar === avatar.id ? "border-primary" : "border-border hover:border-muted-foreground"
                          }`}
                        >
                          <User className="w-5 h-5 text-foreground" />
                        </button>
                      ))}
                      <button
                        type="button"
                        disabled={uploading}
                        onClick={() => fileInputRef.current?.click()}
                        className="w-10 h-10 bg-secondary border border-border hover:border-muted-foreground transition-colors flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                        title="Upload a custom avatar (requires admin approval)"
                      >
                        <Camera className="w-5 h-5 text-muted-foreground" />
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
                        className="hidden"
                        onChange={(e) => void onPickAvatarFile(e.target.files?.[0] ?? null)}
                      />
                    </div>
                  </div>
                  {avatarMode === "uploaded" && (
                    <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                      {uploadedPending ? (
                        <span>
                          Your uploaded avatar is <span className="text-primary">pending admin approval</span>. You can keep using presets while you wait.
                        </span>
                      ) : (
                        <span>Uploaded avatar set.</span>
                      )}
                    </p>
                  )}
                  {uploading && (
                    <p className="text-xs text-muted-foreground mt-2 tracking-wider">Uploading…</p>
                  )}
                </div>

                <div className="mb-6">
                  <label className="block text-xs text-muted-foreground tracking-wider mb-2">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    className="w-full bg-secondary border border-border text-foreground focus:outline-none focus:border-primary px-4 py-3"
                  />
                </div>

                <div className="mb-8">
                  <label className="block text-xs text-muted-foreground tracking-wider mb-2">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    placeholder="Share a bit about yourself..."
                    className="w-full bg-secondary border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary px-4 py-3 resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-border">
                  <Link href="/profile" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Cancel
                  </Link>
                  <button
                    type="submit"
                    disabled={saving}
                    className="retro-btn px-6 py-3 text-xs tracking-widest flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
