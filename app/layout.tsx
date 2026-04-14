import type { Metadata } from 'next'
import { Pixelify_Sans, Courier_Prime, Share_Tech_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const pixelifySans = Pixelify_Sans({ 
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

const courierPrime = Courier_Prime({ 
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-serif',
  display: 'swap',
})

const shareTechMono = Share_Tech_Mono({ 
  subsets: ['latin'],
  weight: '400',
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Internet Harbor - A Safe Harbor for the Weary',
  description: 'A mental health forum for quiet reflection. Submerged data terminal for those seeking stillness in the digital undertow.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${pixelifySans.variable} ${courierPrime.variable} ${shareTechMono.variable} bg-background`}>
      <body className="font-sans antialiased min-h-screen">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
