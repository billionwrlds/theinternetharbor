import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BookOpen, Heart, Phone, ExternalLink, Lightbulb, Shield } from "lucide-react"

const crisisLinks = [
  { label: "988 Suicide & Crisis Lifeline (US)", href: "https://988lifeline.org/", detail: "Call or text 988 — 24/7, free, confidential." },
  { label: "Crisis Text Line", href: "https://www.crisistextline.org/", detail: "Text HOME to 741741 (US/CA)." },
  { label: "SAMHSA National Helpline", href: "https://www.samhsa.gov/find-help/national-helpline", detail: "1-800-662-HELP (4357) — treatment referral and information." },
]

const learnMore = [
  {
    term: "Anxiety",
    body: "A normal stress response that can become overwhelming — worry, tension, and physical symptoms like a racing heart. Tools like grounding, breathing, and professional support can help.",
  },
  {
    term: "Depression",
    body: "More than sadness: persistent low mood, loss of interest, fatigue, or hopelessness. It is treatable; reaching out to a clinician or trusted person is a strong step.",
  },
  {
    term: "Peer support",
    body: "Sharing experiences with others who “get it” can reduce isolation. It complements — but does not replace — care from licensed professionals.",
  },
]

const guides = [
  {
    icon: Heart,
    title: "Before you post",
    body: "You can post anonymously. Share what you’re comfortable with; avoid details that could identify you or others. It’s okay to vent, ask for advice, or celebrate small wins.",
  },
  {
    icon: Shield,
    title: "Staying safe online",
    body: "Don’t share passwords, exact locations, or contact info publicly. If someone makes you uncomfortable, use Report and check our Community Guidelines.",
  },
  {
    icon: Lightbulb,
    title: "When to seek urgent help",
    body: "If you might hurt yourself or others, or are in immediate danger, contact local emergency services or a crisis line. This site is not for emergencies.",
  },
]

export default function ResourcesPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center mb-12">
            <h1 className="font-heading text-4xl md:text-5xl text-foreground mb-4">Resources</h1>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Trusted links, plain-language definitions, and a quick guide to using The Internet Harbor. Nothing here is medical advice — when in doubt, talk to a qualified professional.
            </p>
          </div>

          <div className="terminal-window mb-8">
            <div className="terminal-header">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" strokeWidth={2} />
                <span className="text-xs text-muted-foreground tracking-wider">Crisis &amp; professional help</span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-muted-foreground">
                If you are in crisis, use these resources. They are staffed by trained people, not by our forum volunteers.
              </p>
              <ul className="space-y-4">
                {crisisLinks.map((item) => (
                  <li key={item.href} className="border-l-2 border-primary pl-4">
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:text-primary/80 inline-flex items-center gap-1.5 font-medium"
                    >
                      {item.label}
                      <ExternalLink className="w-3.5 h-3.5" strokeWidth={2} />
                    </a>
                    <p className="text-xs text-muted-foreground mt-1">{item.detail}</p>
                  </li>
                ))}
              </ul>
              <Link href="/crisis" className="inline-block retro-btn-outline px-4 py-2 text-xs tracking-widest mt-2">
                More crisis resources on our site
              </Link>
            </div>
          </div>

          <div className="terminal-window mb-8">
            <div className="terminal-header">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" strokeWidth={2} />
                <span className="text-xs text-muted-foreground tracking-wider">Definitions (plain language)</span>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {learnMore.map((item) => (
                <div key={item.term}>
                  <h2 className="font-heading text-xl text-foreground mb-2">{item.term}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="terminal-window mb-8">
            <div className="terminal-header">
              <span className="text-xs text-muted-foreground tracking-wider">Using the community</span>
            </div>
            <div className="p-6 space-y-6">
              {guides.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="w-12 h-12 bg-primary/10 border border-primary flex items-center justify-center shrink-0">
                    <item.icon className="w-6 h-6 text-primary" strokeWidth={2} />
                  </div>
                  <div>
                    <h2 className="font-heading text-xl text-foreground mb-2">{item.title}</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/forums" className="retro-btn px-6 py-2.5 text-xs tracking-widest">
              Go to forums
            </Link>
            <Link href="/guidelines" className="retro-btn-outline px-6 py-2.5 text-xs tracking-widest">
              Community guidelines
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
