import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Spawn — Trust Layer for AI Agents',
  description: 'Know before you ape. Verified reputation scores for AI agent tokens on Base, computed inside EigenLayer TEEs.',
  icons: {
    icon: '/favicon.png',
    apple: '/icon.png',
  },
  openGraph: {
    title: 'Spawn — Trust Layer for AI Agents',
    description: 'Know before you ape. Verified reputation scores for AI agent tokens on Base, computed inside EigenLayer TEEs.',
    url: 'https://agentspawn.xyz',
    siteName: 'Spawn',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Spawn — Trust Layer for AI Agents',
    description: 'Know before you ape. Verified reputation scores for AI agent tokens on Base.',
    creator: '@danbuildss',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
