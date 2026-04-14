"use client"

import { useState } from "react"
import Link from "next/link"
import { Footer } from "@/components/footer"
import { Square, Minus, Eye, EyeOff, CheckCircle } from "lucide-react"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isReset, setIsReset] = useState(false)

  if (isReset) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md">
            <div className="terminal-window">
              <div className="terminal-header">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-primary" />
                  <span className="text-xs text-muted-foreground tracking-wider">Password Reset</span>
                </div>
              </div>
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 border border-primary flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-primary" />
                </div>
                <h1 className="font-heading text-2xl text-foreground mb-2">Password Updated</h1>
                <p className="text-sm text-muted-foreground mb-6">
                  Your password has been successfully reset. You can now login with your new password.
                </p>
                <Link href="/login" className="retro-btn px-8 py-3 text-sm tracking-widest inline-block">
                  Go to Login
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Terminal Window */}
          <div className="terminal-window">
            {/* Terminal Header */}
            <div className="terminal-header">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-primary" />
                <span className="text-xs text-muted-foreground tracking-wider">Reset Password</span>
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

            {/* Form Content */}
            <div className="p-8">
              {/* Title */}
              <div className="text-center mb-8">
                <h1 className="font-heading text-3xl text-foreground mb-2">Create New Password</h1>
                <p className="text-sm text-muted-foreground">
                  Your new password must be different from previously used passwords.
                </p>
              </div>

              {/* Form */}
              <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setIsReset(true); }}>
                {/* Password */}
                <div>
                  <label className="block text-xs text-muted-foreground tracking-wider mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="At least 12 characters"
                      className="w-full bg-secondary border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary px-4 py-3 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs text-muted-foreground tracking-wider mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your new password"
                      className="w-full bg-secondary border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary px-4 py-3 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Password Requirements */}
                <div className="bg-secondary border border-border p-4">
                  <p className="text-xs text-muted-foreground mb-2">Password requirements:</p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li className={password.length >= 12 ? "text-primary" : ""}>
                      - At least 12 characters
                    </li>
                    <li className={/[A-Z]/.test(password) ? "text-primary" : ""}>
                      - One uppercase letter
                    </li>
                    <li className={/[0-9]/.test(password) ? "text-primary" : ""}>
                      - One number
                    </li>
                  </ul>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="retro-btn w-full py-4 text-sm tracking-widest"
                >
                  Reset Password
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
