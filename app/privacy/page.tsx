import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const sections = [
  {
    title: "Information We Collect",
    content: [
      "Account information: When you create an account, we collect your email address and chosen username. Your email is never displayed publicly.",
      "Content you create: Posts, comments, and any other content you voluntarily share on the platform.",
      "Usage data: We collect anonymous analytics about how you use the platform to improve our service.",
      "Device information: Basic information about your device and browser to ensure compatibility and security.",
    ],
  },
  {
    title: "How We Use Your Information",
    content: [
      "To provide and maintain our service, including displaying your posts and enabling community features.",
      "To send you important updates about your account or changes to our service.",
      "To detect and prevent fraud, abuse, and security issues.",
      "To improve and personalize your experience on the platform.",
    ],
  },
  {
    title: "Information Sharing",
    content: [
      "We do not sell your personal information to third parties.",
      "We may share anonymized, aggregated data for research or analytics purposes.",
      "We may disclose information if required by law or to protect the safety of our users.",
      "Your public posts are visible to other registered members according to your privacy settings.",
    ],
  },
  {
    title: "Data Security",
    content: [
      "All data is encrypted in transit using TLS/SSL protocols.",
      "Passwords are hashed using industry-standard algorithms.",
      "We regularly audit our security practices and update them as needed.",
      "Access to user data is strictly limited to authorized personnel.",
    ],
  },
  {
    title: "Your Rights",
    content: [
      "Access: You can request a copy of your personal data at any time.",
      "Correction: You can update your account information through your settings.",
      "Deletion: You can delete your account, which removes your personal data from our systems.",
      "Portability: You can export your posts and data in a standard format.",
    ],
  },
  {
    title: "Cookies",
    content: [
      "We use essential cookies to keep you logged in and maintain your session.",
      "We use analytics cookies to understand how our platform is used (you can opt out in settings).",
      "We do not use advertising cookies or track you across other websites.",
    ],
  },
]

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-background">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-12">
            <h1 className="font-heading text-4xl md:text-5xl text-foreground mb-4">Privacy Policy</h1>
            <p className="text-sm text-muted-foreground">Last updated: October 2024</p>
          </div>

          {/* Introduction */}
          <div className="terminal-window mb-8">
            <div className="p-6">
              <p className="text-foreground leading-relaxed">
                At The Internet Harbor, your privacy is our priority. This policy explains what information we collect, how we use it, and your rights regarding your data. We believe in transparency and want you to feel safe using our platform.
              </p>
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <div key={index} className="terminal-window">
                <div className="terminal-header">
                  <span className="text-xs text-muted-foreground tracking-wider">{String(index + 1).padStart(2, "0")}</span>
                </div>
                <div className="p-6">
                  <h2 className="font-heading text-xl text-foreground mb-4">{section.title}</h2>
                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex gap-3 text-sm text-muted-foreground">
                        <span className="text-primary shrink-0">-</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="mt-12 bg-secondary border border-border p-6">
            <h2 className="font-heading text-xl text-foreground mb-4">Questions?</h2>
            <p className="text-sm text-muted-foreground">
              If you have any questions about this Privacy Policy, please contact us at{" "}
              <a href="mailto:privacy@theinternetharbor.example" className="text-primary hover:text-primary/80">
                privacy@theinternetharbor.example
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
