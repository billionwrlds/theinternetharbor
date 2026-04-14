import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Heart, Shield, MessageSquare, AlertTriangle, Users, Ban } from "lucide-react"

const guidelines = [
  {
    icon: Heart,
    title: "Be Kind and Supportive",
    content: "This is a space for people going through difficult times. Always approach others with empathy and compassion. Your words can make a real difference in someone&apos;s day.",
  },
  {
    icon: Shield,
    title: "Respect Privacy",
    content: "Never share personal information about yourself or others. This includes real names, locations, workplaces, schools, or any identifying details. Anonymity is key to feeling safe here.",
  },
  {
    icon: MessageSquare,
    title: "Listen More Than You Speak",
    content: "Sometimes people just need to be heard. Before offering advice, consider whether the person is looking for solutions or simply needs validation and support.",
  },
  {
    icon: AlertTriangle,
    title: "No Professional Advice",
    content: "We are not mental health professionals. While peer support is valuable, never discourage someone from seeking professional help. If someone is in crisis, direct them to appropriate resources.",
  },
  {
    icon: Users,
    title: "Create a Safe Environment",
    content: "No discrimination, harassment, bullying, or hate speech of any kind. This community welcomes everyone regardless of background, identity, or beliefs.",
  },
  {
    icon: Ban,
    title: "Zero Tolerance Policy",
    content: "Violations of these guidelines may result in content removal or account suspension. Severe violations (threats, harassment, illegal content) result in immediate permanent bans.",
  },
]

export default function GuidelinesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-heading text-4xl md:text-5xl text-foreground mb-4">Community Guidelines</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The Internet Harbor is built on mutual respect and support. These guidelines help us maintain a safe, welcoming space for everyone.
            </p>
          </div>

          {/* Guidelines */}
          <div className="space-y-6 mb-12">
            {guidelines.map((guideline, index) => (
              <div key={index} className="terminal-window">
                <div className="p-6 flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 border border-primary flex items-center justify-center shrink-0">
                    <guideline.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-heading text-xl text-foreground mb-2">{guideline.title}</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">{guideline.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Reporting Section */}
          <div className="terminal-window mb-8">
            <div className="terminal-header">
              <span className="text-xs text-muted-foreground tracking-wider">Reporting Violations</span>
            </div>
            <div className="p-6">
              <h2 className="font-heading text-xl text-foreground mb-4">How to Report</h2>
              <p className="text-sm text-muted-foreground mb-4">
                If you see content that violates these guidelines, please report it using the flag icon on any post or comment. Our moderation team reviews all reports within 24 hours.
              </p>
              <p className="text-sm text-muted-foreground">
                For urgent safety concerns, please contact us directly at{" "}
                <a href="mailto:safety@theinternetharbor.example" className="text-primary hover:text-primary/80">
                  safety@theinternetharbor.example
                </a>
              </p>
            </div>
          </div>

          {/* Crisis Resources Link */}
          <div className="bg-primary/10 border border-primary p-6 text-center">
            <h2 className="font-heading text-xl text-foreground mb-2">Need Immediate Help?</h2>
            <p className="text-sm text-muted-foreground mb-4">
              If you or someone you know is in crisis, please reach out to professional resources.
            </p>
            <Link href="/crisis" className="retro-btn px-6 py-3 text-xs tracking-widest inline-block">
              View Crisis Resources
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
