import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Courier_Prime, Share_Tech_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const headingFont = localFont({
  src: '../public/fonts/ThePixelateforAr.woff2',
  variable: '--font-heading-loaded',
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
  title: {
    default: 'The Internet Harbor',
    template: '%s | The Internet Harbor',
  },
  description: 'A mental health forum for quiet reflection. Submerged data terminal for those seeking stillness in the digital undertow.',
  generator: 'v0.app',
  applicationName: 'The Internet Harbor',
  openGraph: {
    title: 'The Internet Harbor',
    description: 'A mental health forum for quiet reflection — peer support, resources, and community.',
    siteName: 'The Internet Harbor',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Internet Harbor',
    description: 'A mental health forum for quiet reflection — peer support, resources, and community.',
  },
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
    <html lang="en" className={`${headingFont.variable} ${courierPrime.variable} ${shareTechMono.variable} bg-background`}>
      <body className="font-serif antialiased min-h-screen">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
