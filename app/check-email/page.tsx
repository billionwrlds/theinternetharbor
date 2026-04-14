import Link from "next/link"
import { Footer } from "@/components/footer"
import { Mail, ArrowLeft, RefreshCw } from "lucide-react"

export default function CheckEmailPage() {
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
                <span className="text-xs text-muted-foreground tracking-wider">Email Verification</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 text-center">
              {/* Icon */}
              <div className="w-20 h-20 bg-primary/10 border border-primary flex items-center justify-center mx-auto mb-6">
                <Mail className="w-10 h-10 text-primary" />
              </div>

              {/* Title */}
              <h1 className="font-heading text-3xl text-foreground mb-2">Check Your Email</h1>
              <p className="text-sm text-muted-foreground mb-6">
                We&apos;ve sent a verification link to your email address. Click the link to verify your account and get started.
              </p>

              {/* Email Preview */}
              <div className="bg-secondary border border-border p-4 mb-6">
                <p className="text-xs text-muted-foreground">Email sent to:</p>
                <p className="text-sm text-foreground font-mono">user@example.com</p>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button className="retro-btn-outline w-full px-4 py-3 text-xs tracking-widest flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Resend Email
                </button>
              </div>

              {/* Help Text */}
              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-xs text-muted-foreground mb-4">
                  Didn&apos;t receive the email? Check your spam folder or try a different email address.
                </p>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Use a different email
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
