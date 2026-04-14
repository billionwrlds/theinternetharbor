import { Footer } from "@/components/footer"
import { Wrench, Clock, Bell } from "lucide-react"

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-lg text-center">
          <div className="terminal-window">
            <div className="terminal-header">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-yellow-500" />
                <span className="text-xs text-muted-foreground tracking-wider">System Maintenance</span>
              </div>
            </div>
            <div className="p-8">
              {/* Icon */}
              <div className="w-20 h-20 bg-yellow-500/10 border border-yellow-500/50 flex items-center justify-center mx-auto mb-6">
                <Wrench className="w-10 h-10 text-yellow-400" />
              </div>

              {/* Message */}
              <h1 className="font-heading text-3xl text-foreground mb-2">We&apos;ll Be Right Back</h1>
              <p className="text-sm text-muted-foreground mb-8">
                Safe Harbor is currently undergoing scheduled maintenance to improve your experience. We apologize for any inconvenience.
              </p>

              {/* Estimated Time */}
              <div className="bg-secondary border border-border p-4 mb-8">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-xs text-muted-foreground tracking-wider">Estimated Downtime</span>
                </div>
                <p className="font-heading text-2xl text-primary">~30 minutes</p>
              </div>

              {/* Status Updates */}
              <div className="space-y-4 text-left">
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-green-500 mt-2 shrink-0" />
                  <div>
                    <p className="text-sm text-foreground">Database optimization</p>
                    <p className="text-xs text-muted-foreground">Completed</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-yellow-500 mt-2 shrink-0 animate-pulse" />
                  <div>
                    <p className="text-sm text-foreground">Server updates</p>
                    <p className="text-xs text-muted-foreground">In progress...</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-muted-foreground mt-2 shrink-0" />
                  <div>
                    <p className="text-sm text-foreground">Security patches</p>
                    <p className="text-xs text-muted-foreground">Pending</p>
                  </div>
                </div>
              </div>

              {/* Notification Signup */}
              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-xs text-muted-foreground mb-4">
                  Want to be notified when we&apos;re back online?
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="flex-1 bg-secondary border border-border text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary px-4 py-2"
                  />
                  <button className="retro-btn px-4 py-2 text-xs tracking-widest flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Notify Me
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Crisis Resources */}
          <div className="mt-6 p-4 bg-primary/10 border border-primary">
            <p className="text-xs text-muted-foreground">
              If you need immediate support, crisis resources are always available:{" "}
              <a href="tel:988" className="text-primary hover:text-primary/80">
                Call 988
              </a>{" "}
              or{" "}
              <a href="sms:741741&body=HOME" className="text-primary hover:text-primary/80">
                Text HOME to 741741
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
