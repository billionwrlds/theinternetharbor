import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Flag, Eye, Check, X, AlertTriangle, Clock, Filter } from "lucide-react"

const reports = [
  {
    id: "RPT-001",
    status: "pending",
    priority: "high",
    type: "Harassment",
    postTitle: "Does anyone else feel overwhelmed lately?",
    postId: "1092-B",
    reportedBy: "anonymous",
    reportedAt: "2 hours ago",
    reason: "User is sending aggressive messages in comments.",
    flaggedContent: "The comment contains personal attacks and threatening language toward other users.",
  },
  {
    id: "RPT-002",
    status: "pending",
    priority: "medium",
    type: "Spam",
    postTitle: "Check out this amazing opportunity!",
    postId: "5521-A",
    reportedBy: "quiet_mind_22",
    reportedAt: "5 hours ago",
    reason: "Promotional content / spam",
    flaggedContent: "Post appears to be advertising external services unrelated to mental health support.",
  },
  {
    id: "RPT-003",
    status: "reviewed",
    priority: "low",
    type: "Off-topic",
    postTitle: "Best pizza places in New York?",
    postId: "7832-C",
    reportedBy: "morning_coffee",
    reportedAt: "1 day ago",
    reason: "Content not relevant to community purpose",
    flaggedContent: "Post is asking about restaurants, which doesn&apos;t fit the community guidelines.",
  },
]

const statusColors: Record<string, string> = {
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
  reviewed: "bg-blue-500/20 text-blue-400 border-blue-500/50",
  resolved: "bg-green-500/20 text-green-400 border-green-500/50",
  dismissed: "bg-muted-foreground/20 text-muted-foreground border-muted-foreground/50",
}

const priorityColors: Record<string, string> = {
  high: "text-red-400",
  medium: "text-yellow-400",
  low: "text-muted-foreground",
}

export default function AdminReportsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-background">
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Flag className="w-5 h-5 text-primary" />
                <span className="text-xs text-primary tracking-wider">Admin Panel</span>
              </div>
              <h1 className="font-heading text-3xl md:text-4xl text-foreground">Reported Content</h1>
              <p className="text-xs text-muted-foreground tracking-wider mt-1">
                Review and moderate flagged posts and comments
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{reports.filter(r => r.status === "pending").length} pending</span>
              <button className="retro-btn-outline px-4 py-2 text-xs tracking-widest flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Pending", value: 2, color: "text-yellow-400" },
              { label: "Reviewed Today", value: 5, color: "text-blue-400" },
              { label: "Resolved This Week", value: 23, color: "text-green-400" },
              { label: "Avg Response Time", value: "2.4h", color: "text-primary" },
            ].map((stat, index) => (
              <div key={index} className="terminal-window">
                <div className="p-4 text-center">
                  <p className={`font-heading text-2xl ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Reports List */}
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="terminal-window">
                <div className="terminal-header">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{report.id}</span>
                    <span className={`px-2 py-0.5 text-xs border ${statusColors[report.status]}`}>
                      {report.status.toUpperCase()}
                    </span>
                    <span className={`flex items-center gap-1 text-xs ${priorityColors[report.priority]}`}>
                      <AlertTriangle className="w-3 h-3" />
                      {report.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {report.reportedAt}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Report Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="tag">{report.type}</span>
                        <span className="text-xs text-muted-foreground">reported by {report.reportedBy}</span>
                      </div>
                      <Link 
                        href={`/forums/thread/${report.postId}`}
                        className="font-heading text-lg text-foreground hover:text-primary transition-colors block mb-2"
                      >
                        {report.postTitle}
                      </Link>
                      <p className="text-sm text-muted-foreground mb-4">
                        <strong className="text-foreground">Reason:</strong> {report.reason}
                      </p>
                      <div className="bg-secondary border border-border p-4">
                        <p className="text-xs text-muted-foreground mb-1">Flagged Content:</p>
                        <p className="text-sm text-foreground">{report.flaggedContent}</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="lg:w-48 shrink-0 flex lg:flex-col gap-2">
                      <Link
                        href={`/forums/thread/${report.postId}`}
                        className="retro-btn-outline flex-1 lg:flex-none px-4 py-2.5 text-xs tracking-wider flex items-center justify-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Post
                      </Link>
                      <button className="retro-btn flex-1 lg:flex-none px-4 py-2.5 text-xs tracking-wider flex items-center justify-center gap-2">
                        <Check className="w-4 h-4" />
                        Remove Content
                      </button>
                      <button className="retro-btn-outline flex-1 lg:flex-none px-4 py-2.5 text-xs tracking-wider flex items-center justify-center gap-2 text-muted-foreground">
                        <X className="w-4 h-4" />
                        Dismiss
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="flex justify-center mt-8">
            <button className="retro-btn-outline px-6 py-2.5 text-xs tracking-widest">
              Load More Reports
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
