"use client"

import { useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import {
  Phone,
  ExternalLink,
  BookOpen,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  MessageSquare,
  Brain,
  Heart,
  Smile,
  Activity,
  BarChart2,
} from "lucide-react"

// ─── Crisis Resources ───────────────────────────────────────────────
const crisisResources = [
  {
    name: "988 Suicide & Crisis Lifeline",
    contact: "Call or Text 988",
    href: "tel:988",
    description: "Free, confidential support 24/7 for anyone in emotional distress or suicidal crisis.",
    badge: "24/7",
    color: "red",
  },
  {
    name: "Crisis Text Line",
    contact: "Text HOME to 741741",
    href: "sms:741741?body=HOME",
    description: "Free, 24/7 crisis counseling via text message. Available in the US, UK, Canada, and Ireland.",
    badge: "Free",
    color: "red",
  },
  {
    name: "NAMI Helpline",
    contact: "1-800-950-6264",
    href: "tel:18009506264",
    description: "Mental health information, referrals, and support from the National Alliance on Mental Illness.",
    badge: "M–F 10am–10pm ET",
    color: "orange",
  },
  {
    name: "Trevor Project (LGBTQ+)",
    contact: "1-866-488-7386",
    href: "tel:18664887386",
    description: "Crisis intervention and suicide prevention for LGBTQ+ young people under 25.",
    badge: "24/7",
    color: "orange",
  },
]

// ─── Articles ───────────────────────────────────────────────────────
type Article = {
  title: string
  description: string
  source: string
  href: string
  category: string
}

const articles: Article[] = [
  {
    title: "What Is Anxiety?",
    description: "An overview of anxiety disorders, their symptoms, and evidence-based treatment approaches from the National Institute of Mental Health.",
    source: "nimh.nih.gov",
    href: "https://www.nimh.nih.gov/health/topics/anxiety-disorders",
    category: "Anxiety",
  },
  {
    title: "Managing Anxiety and Stress",
    description: "Practical strategies for managing everyday anxiety, including breathing techniques, grounding, and when to seek professional help.",
    source: "adaa.org",
    href: "https://adaa.org/tips",
    category: "Anxiety",
  },
  {
    title: "Depression: What You Need to Know",
    description: "A plain-language guide covering symptoms, causes, and treatment options for depression from the NIMH.",
    source: "nimh.nih.gov",
    href: "https://www.nimh.nih.gov/health/publications/depression",
    category: "Depression",
  },
  {
    title: "Understanding Depression",
    description: "NAMI's guide to recognizing depression, how it differs from ordinary sadness, and effective treatments available.",
    source: "nami.org",
    href: "https://www.nami.org/About-Mental-Illness/Mental-Health-Conditions/Depression",
    category: "Depression",
  },
  {
    title: "Mental Health in College: A Survival Guide",
    description: "Advice for navigating academic pressure, social change, and mental wellness during the college years.",
    source: "psychologytoday.com",
    href: "https://www.psychologytoday.com/us/blog/the-college-experience",
    category: "College Life",
  },
  {
    title: "Adjusting to College Life",
    description: "NAMI's resource on the unique mental health challenges college students face and how campus support systems can help.",
    source: "nami.org",
    href: "https://www.nami.org/Your-Journey/Teens-Young-Adults/Navigating-a-Mental-Health-Crisis/College-Students",
    category: "College Life",
  },
  {
    title: "The Science of Self-Care",
    description: "Research-backed self-care practices that have measurable effects on mental and physical well-being.",
    source: "psychologytoday.com",
    href: "https://www.psychologytoday.com/us/blog/click-here-happiness/201812/self-care-12-ways-take-better-care-yourself",
    category: "Self Care",
  },
  {
    title: "5 Steps to Improve Your Mental Fitness",
    description: "Simple daily habits — sleep, movement, connection, mindfulness, and purpose — that build long-term mental resilience.",
    source: "nimh.nih.gov",
    href: "https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health",
    category: "Self Care",
  },
  {
    title: "Healthy Relationships and Mental Health",
    description: "How social connections shape our mental health, and what makes a relationship supportive rather than harmful.",
    source: "psychologytoday.com",
    href: "https://www.psychologytoday.com/us/basics/relationships",
    category: "Relationships",
  },
  {
    title: "Setting Boundaries for Your Mental Health",
    description: "A practical guide to recognizing when boundaries are needed and how to communicate them clearly and compassionately.",
    source: "nami.org",
    href: "https://www.nami.org/Blogs/NAMI-Blog/October-2021/Setting-Boundaries-for-Your-Mental-Health",
    category: "Relationships",
  },
]

const categories = ["All", "Anxiety", "Depression", "College Life", "Self Care", "Relationships"]

// ─── Glossary ───────────────────────────────────────────────────────
const glossaryTerms = [
  {
    term: "Anxiety",
    definition:
      "A natural stress response involving worry, fear, or nervousness. When it becomes persistent and interferes with daily life, it may indicate an anxiety disorder. It is one of the most common and treatable mental health conditions.",
  },
  {
    term: "Depression",
    definition:
      "More than ordinary sadness — depression is a persistent low mood lasting weeks or months, often accompanied by loss of interest, fatigue, and hopelessness. It is a medical condition, not a character flaw, and responds well to treatment.",
  },
  {
    term: "PTSD (Post-Traumatic Stress Disorder)",
    definition:
      "A condition that can develop after experiencing or witnessing a traumatic event. Symptoms include flashbacks, nightmares, hypervigilance, and avoidance of reminders. Effective treatments include trauma-focused therapy.",
  },
  {
    term: "OCD (Obsessive-Compulsive Disorder)",
    definition:
      "A disorder characterized by unwanted, intrusive thoughts (obsessions) and repetitive behaviors or mental acts (compulsions) performed to reduce distress. It is not about being overly tidy — it can cause significant suffering.",
  },
  {
    term: "Bipolar Disorder",
    definition:
      "A mood disorder involving extreme shifts between manic (elevated, energized) and depressive episodes. With the right treatment, including medication and therapy, most people with bipolar disorder live full, productive lives.",
  },
  {
    term: "ADHD (Attention-Deficit/Hyperactivity Disorder)",
    definition:
      "A neurodevelopmental disorder involving difficulty sustaining attention, impulsivity, and/or hyperactivity. It affects adults as well as children and can coexist with anxiety and depression.",
  },
  {
    term: "Panic Attack",
    definition:
      "A sudden surge of intense fear with physical symptoms like racing heart, shortness of breath, dizziness, and chest tightness. Though frightening, panic attacks are not physically dangerous. Grounding techniques can help.",
  },
  {
    term: "Grounding",
    definition:
      "Techniques used to bring your focus back to the present moment when feeling overwhelmed or dissociated. Common methods include the 5-4-3-2-1 sensory technique, deep breathing, and holding something cold or textured.",
  },
  {
    term: "CBT (Cognitive Behavioral Therapy)",
    definition:
      "A widely researched, evidence-based form of talk therapy that helps you identify and reshape unhelpful thought patterns. It is effective for anxiety, depression, OCD, PTSD, and many other conditions.",
  },
  {
    term: "Mindfulness",
    definition:
      "The practice of paying deliberate, non-judgmental attention to the present moment. Regular mindfulness practice has been shown to reduce anxiety, improve mood, and build emotional resilience.",
  },
  {
    term: "Burnout",
    definition:
      "A state of chronic physical and emotional exhaustion often caused by prolonged stress, particularly from work or caregiving. Signs include cynicism, detachment, and a feeling that nothing you do matters.",
  },
  {
    term: "Trigger",
    definition:
      "A stimulus — a sound, smell, situation, or word — that provokes an intense emotional reaction, often connected to a past difficult experience. Identifying triggers is an important step in therapy and self-care.",
  },
]

// ─── Glossary Item ──────────────────────────────────────────────────
function GlossaryItem({ term, definition }: { term: string; definition: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between py-4 px-2 text-left hover:bg-secondary/40 transition-colors"
      >
        <span className="font-heading text-base text-foreground">{term}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" strokeWidth={2} />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" strokeWidth={2} />
        )}
      </button>
      {open && (
        <p className="px-2 pb-4 text-sm text-muted-foreground leading-relaxed">{definition}</p>
      )}
    </div>
  )
}

// ─── Page ───────────────────────────────────────────────────────────
export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState("All")

  const filteredArticles =
    activeCategory === "All" ? articles : articles.filter((a) => a.category === activeCategory)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-background">
        <div className="max-w-5xl mx-auto px-4 py-12">

          {/* Page Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-3">
              <span className="w-2 h-2 bg-primary" />
              <span className="text-xs tracking-[0.2em] text-muted-foreground uppercase">Mental Health Hub</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl text-foreground mb-4">Resources</h1>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Crisis hotlines, curated articles, and a plain-language glossary. Nothing here is medical advice — when in doubt, talk to a qualified professional.
            </p>
          </div>

          {/* ── SECTION 1: Crisis Resources ── */}
          <section className="mb-12" aria-label="Crisis resources">
            <div className="terminal-window border-red-500/60" style={{ borderColor: "rgba(239,68,68,0.5)" }}>
              <div className="terminal-header" style={{ background: "linear-gradient(to bottom, rgba(239,68,68,0.15), rgba(239,68,68,0.08))", borderColor: "rgba(239,68,68,0.4)" }}>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400" strokeWidth={2} />
                  <span className="text-xs text-red-300 tracking-wider uppercase">Crisis Resources — Available Now</span>
                </div>
                <span className="w-2 h-2 bg-red-400 animate-pulse" />
              </div>
              <div className="p-6">
                <p className="text-sm text-muted-foreground mb-6">
                  If you are in crisis or immediate danger, use these resources. They are staffed by trained professionals, not forum volunteers. <strong className="text-foreground">Call 911 if there is immediate danger.</strong>
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {crisisResources.map((resource) => (
                    <div
                      key={resource.name}
                      className="border border-red-500/30 bg-red-500/5 p-4 flex flex-col gap-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-heading text-base text-foreground leading-tight">{resource.name}</h3>
                        <span className="text-[10px] tracking-widest px-2 py-0.5 border border-red-500/40 text-red-300 shrink-0 whitespace-nowrap">
                          {resource.badge}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{resource.description}</p>
                      <a
                        href={resource.href}
                        className="inline-flex items-center gap-2 text-sm text-red-300 hover:text-red-200 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5" strokeWidth={2} />
                        {resource.contact}
                      </a>
                    </div>
                  ))}
                </div>
                <div className="mt-6 pt-4 border-t border-red-500/20">
                  <Link href="/crisis" className="inline-flex items-center gap-2 text-xs text-red-300 hover:text-red-200 tracking-wider transition-colors">
                    View full crisis resources page
                    <ExternalLink className="w-3 h-3" strokeWidth={2} />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* ── SECTION 2: Articles ── */}
          <section className="mb-12" aria-label="Mental health articles">
            <div className="terminal-window">
              <div className="terminal-header">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" strokeWidth={2} />
                  <span className="text-xs text-muted-foreground tracking-wider uppercase">Articles</span>
                </div>
                <span className="text-xs text-muted-foreground">{filteredArticles.length} articles</span>
              </div>
              <div className="p-6">
                {/* Category filter */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`tag cursor-pointer transition-colors ${activeCategory === cat ? "tag-active" : ""}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Article grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredArticles.map((article) => (
                    <a
                      key={article.href}
                      href={article.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group terminal-window p-0 block hover:border-primary/50 transition-colors"
                    >
                      <div className="terminal-header">
                        <span className={`tag ${
                          article.category === "Anxiety" ? "border-yellow-600/50 text-yellow-400" :
                          article.category === "Depression" ? "border-blue-600/50 text-blue-400" :
                          article.category === "College Life" ? "border-purple-600/50 text-purple-400" :
                          article.category === "Self Care" ? "border-primary/50 text-primary" :
                          "border-pink-600/50 text-pink-400"
                        }`}>
                          {article.category}
                        </span>
                        <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" strokeWidth={2} />
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-serif text-foreground mb-2 leading-snug group-hover:text-primary transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-3">
                          {article.description}
                        </p>
                        <span className="text-[10px] tracking-widest text-muted-foreground/60 uppercase">
                          {article.source}
                        </span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── SECTION 3: Glossary ── */}
          <section className="mb-12" aria-label="Mental health glossary">
            <div className="terminal-window">
              <div className="terminal-header">
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-primary" strokeWidth={2} />
                  <span className="text-xs text-muted-foreground tracking-wider uppercase">Glossary — Plain Language</span>
                </div>
                <span className="text-xs text-muted-foreground">{glossaryTerms.length} terms</span>
              </div>
              <div className="p-6">
                <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                  Definitions written for general understanding. Not medical advice. Tap any term to expand.
                </p>
                <div>
                  {glossaryTerms.map((item) => (
                    <GlossaryItem key={item.term} term={item.term} definition={item.definition} />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ── SECTION 4: Wellness Tools Quick Links ── */}
          <section className="mb-12" aria-label="Wellness tools">
            <div className="terminal-window">
              <div className="terminal-header">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary" strokeWidth={2} />
                  <span className="text-xs text-muted-foreground tracking-wider uppercase">Wellness Tools</span>
                </div>
              </div>
              <div className="p-6">
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                  Interactive check-ins to help you understand and track your mental wellness — no sign-up required for the quiz.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Link
                    href="/tools/mood-check"
                    className="group terminal-window p-0 block hover:border-primary/50 transition-colors"
                  >
                    <div className="terminal-header">
                      <span className="tag tag-active">Daily</span>
                    </div>
                    <div className="p-4 flex gap-4 items-start">
                      <div className="w-10 h-10 bg-primary/10 border border-primary flex items-center justify-center shrink-0">
                        <Smile className="w-5 h-5 text-primary" strokeWidth={2} />
                      </div>
                      <div>
                        <h3 className="font-heading text-base text-foreground mb-1 group-hover:text-primary transition-colors">Mood Check-In</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">Track how you&apos;re feeling day by day with a 7-day mood chart.</p>
                      </div>
                    </div>
                  </Link>
                  <Link
                    href="/tools/self-care-quiz"
                    className="group terminal-window p-0 block hover:border-primary/50 transition-colors"
                  >
                    <div className="terminal-header">
                      <span className="tag tag-active">5 Questions</span>
                    </div>
                    <div className="p-4 flex gap-4 items-start">
                      <div className="w-10 h-10 bg-primary/10 border border-primary flex items-center justify-center shrink-0">
                        <BarChart2 className="w-5 h-5 text-primary" strokeWidth={2} />
                      </div>
                      <div>
                        <h3 className="font-heading text-base text-foreground mb-1 group-hover:text-primary transition-colors">Self-Care Quiz</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">Get a personalized self-care snapshot based on sleep, eating, and more.</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Bottom CTA */}
          <div className="flex flex-wrap gap-4 justify-center pt-4 border-t border-border">
            <Link href="/forums" className="retro-btn px-6 py-2.5 text-xs tracking-widest">
              Go to forums
            </Link>
            <Link href="/guidelines" className="retro-btn-outline px-6 py-2.5 text-xs tracking-widest">
              Community guidelines
            </Link>
            <Link href="/crisis" className="retro-btn-outline px-6 py-2.5 text-xs tracking-widest" style={{ borderColor: "rgba(239,68,68,0.5)", color: "rgb(252,165,165)" }}>
              Crisis help
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
