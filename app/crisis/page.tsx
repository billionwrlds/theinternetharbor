import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Phone, MessageSquare, Globe, Heart, AlertTriangle } from "lucide-react"

const emergencyResources = [
  {
    name: "National Suicide Prevention Lifeline",
    phone: "988",
    description: "Free, confidential support 24/7 for people in distress.",
    region: "USA",
  },
  {
    name: "Crisis Text Line",
    phone: "Text HOME to 741741",
    description: "Free, 24/7 crisis support via text message.",
    region: "USA",
  },
  {
    name: "International Association for Suicide Prevention",
    phone: "Visit Website",
    url: "https://www.iasp.info/resources/Crisis_Centres/",
    description: "Find crisis centers around the world.",
    region: "International",
  },
]

const additionalResources = [
  {
    name: "SAMHSA National Helpline",
    phone: "1-800-662-4357",
    description: "Treatment referrals and information for mental health and substance use disorders.",
  },
  {
    name: "NAMI Helpline",
    phone: "1-800-950-6264",
    description: "Mental health support, resources, and local services.",
  },
  {
    name: "Trevor Project",
    phone: "1-866-488-7386",
    description: "Crisis support for LGBTQ+ youth.",
  },
  {
    name: "Veterans Crisis Line",
    phone: "988, then press 1",
    description: "Support for veterans and their loved ones.",
  },
]

export default function CrisisPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Emergency Banner */}
          <div className="bg-red-500/10 border-2 border-red-500 p-6 mb-8">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-red-400 shrink-0" />
              <div>
                <h2 className="font-heading text-xl text-foreground mb-2">If you are in immediate danger</h2>
                <p className="text-foreground mb-4">
                  Call emergency services (911 in the US) or go to your nearest emergency room.
                </p>
                <a href="tel:911" className="inline-block px-6 py-3 bg-red-500 text-white text-sm tracking-widest font-bold">
                  Call 911
                </a>
              </div>
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-heading text-4xl md:text-5xl text-foreground mb-4">Crisis Resources</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              If you&apos;re struggling, you don&apos;t have to face it alone. These resources provide immediate, professional support.
            </p>
          </div>

          {/* Emergency Resources */}
          <div className="mb-12">
            <h2 className="font-heading text-2xl text-foreground mb-6 flex items-center gap-2">
              <Phone className="w-6 h-6 text-primary" />
              Immediate Help
            </h2>
            <div className="space-y-4">
              {emergencyResources.map((resource, index) => (
                <div key={index} className="terminal-window">
                  <div className="terminal-header">
                    <span className="text-xs text-muted-foreground tracking-wider">{resource.region}</span>
                    <span className="w-2 h-2 bg-green-500 animate-pulse" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-heading text-lg text-foreground mb-2">{resource.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                    {resource.url ? (
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="retro-btn px-6 py-3 text-xs tracking-widest inline-flex items-center gap-2"
                      >
                        <Globe className="w-4 h-4" />
                        {resource.phone}
                      </a>
                    ) : (
                      <a
                        href={`tel:${resource.phone.replace(/\D/g, "")}`}
                        className="retro-btn px-6 py-3 text-xs tracking-widest inline-flex items-center gap-2"
                      >
                        <Phone className="w-4 h-4" />
                        {resource.phone}
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Resources */}
          <div className="mb-12">
            <h2 className="font-heading text-2xl text-foreground mb-6 flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-primary" />
              Additional Support
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {additionalResources.map((resource, index) => (
                <div key={index} className="terminal-window">
                  <div className="p-6">
                    <h3 className="font-heading text-lg text-foreground mb-2">{resource.name}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{resource.description}</p>
                    <a
                      href={`tel:${resource.phone.replace(/\D/g, "")}`}
                      className="text-primary hover:text-primary/80 text-sm flex items-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      {resource.phone}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Self-Care Reminder */}
          <div className="bg-primary/10 border border-primary p-6">
            <div className="flex items-start gap-4">
              <Heart className="w-8 h-8 text-primary shrink-0" />
              <div>
                <h2 className="font-heading text-xl text-foreground mb-2">You Matter</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Whatever you&apos;re going through, your feelings are valid and there is help available. Reaching out takes courage, and it&apos;s the first step toward feeling better. The Internet Harbor community is here to support you, but please also consider speaking with a professional who can provide personalized care.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
