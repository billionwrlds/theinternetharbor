import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const sections = [
  {
    title: "Acceptance of Terms",
    content: "By accessing or using Safe Harbor, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.",
  },
  {
    title: "User Accounts",
    content: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must be at least 13 years old to use this service. You agree to provide accurate information and to update it as necessary. We reserve the right to suspend or terminate accounts that violate these terms.",
  },
  {
    title: "User Content",
    content: "You retain ownership of content you post on Safe Harbor. By posting content, you grant us a non-exclusive license to display, distribute, and use your content in connection with the service. You are solely responsible for your content and must ensure it does not violate any laws or third-party rights. We reserve the right to remove content that violates our Community Guidelines.",
  },
  {
    title: "Prohibited Conduct",
    content: "You agree not to: harass, bully, or threaten other users; post illegal, harmful, or offensive content; impersonate others or misrepresent your affiliation; attempt to access accounts or systems without authorization; use the service for commercial purposes without permission; or circumvent any security measures.",
  },
  {
    title: "Health Disclaimer",
    content: "Safe Harbor is a peer support community and is not a substitute for professional mental health care. Content on this platform should not be considered medical or psychological advice. If you are experiencing a mental health emergency, please contact emergency services or a crisis hotline immediately. We encourage all users to seek appropriate professional help when needed.",
  },
  {
    title: "Privacy",
    content: "Your use of Safe Harbor is also governed by our Privacy Policy. By using our service, you consent to the collection and use of your information as described in that policy.",
  },
  {
    title: "Intellectual Property",
    content: "The Safe Harbor name, logo, and all related trademarks are our property. The service and its original content (excluding user content) are protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express permission.",
  },
  {
    title: "Limitation of Liability",
    content: "Safe Harbor is provided \"as is\" without warranties of any kind. We are not liable for any damages arising from your use of the service, including but not limited to direct, indirect, incidental, or consequential damages. We do not guarantee the accuracy, completeness, or usefulness of any content on the platform.",
  },
  {
    title: "Changes to Terms",
    content: "We reserve the right to modify these terms at any time. We will notify users of significant changes via email or a prominent notice on the platform. Your continued use of the service after changes constitutes acceptance of the new terms.",
  },
  {
    title: "Termination",
    content: "We may terminate or suspend your account at any time for violations of these terms or for any other reason at our discretion. Upon termination, your right to use the service ceases immediately. Provisions that by their nature should survive termination will remain in effect.",
  },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-heading text-4xl md:text-5xl text-foreground mb-4">Terms of Service</h1>
            <p className="text-sm text-muted-foreground">Last updated: October 2024</p>
          </div>

          {/* Sections */}
          <div className="space-y-6">
            {sections.map((section, index) => (
              <div key={index} className="terminal-window">
                <div className="terminal-header">
                  <span className="text-xs text-muted-foreground tracking-wider">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className="p-6">
                  <h2 className="font-heading text-xl text-foreground mb-4">{section.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{section.content}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Related Links */}
          <div className="mt-12 flex flex-wrap gap-4">
            <Link href="/privacy" className="retro-btn-outline px-4 py-2 text-xs tracking-widest">
              Privacy Policy
            </Link>
            <Link href="/guidelines" className="retro-btn-outline px-4 py-2 text-xs tracking-widest">
              Community Guidelines
            </Link>
          </div>

          {/* Contact */}
          <div className="mt-8 bg-secondary border border-border p-6">
            <h2 className="font-heading text-xl text-foreground mb-4">Questions?</h2>
            <p className="text-sm text-muted-foreground">
              If you have any questions about these Terms, please contact us at{" "}
              <a href="mailto:legal@safeharbor.com" className="text-primary hover:text-primary/80">
                legal@safeharbor.com
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
