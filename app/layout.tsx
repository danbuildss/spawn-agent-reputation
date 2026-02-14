import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Spawn - Trust Layer for AI Agents',
  description: 'Verify AI agent reputation before you interact. Real scores based on on-chain data.',
  icons: {
    icon: '/favicon.png',
    apple: '/icon.png',
  },
  openGraph: {
    title: 'Spawn - Trust Layer for AI Agents',
    description: 'Verify AI agent reputation before you interact. Real scores based on on-chain data.',
    url: 'https://agentspawn.xyz',
    siteName: 'Spawn',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Spawn - Trust Layer for AI Agents',
    description: 'Verify AI agent reputation before you interact.',
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
      <body className={inter.className}>{children}</body>
    </html>
  )
}
