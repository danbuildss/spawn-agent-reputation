import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import FeaturedAgents from '@/components/FeaturedAgents'
import RecentlyAdded from '@/components/RecentlyAdded'
import AgentDirectory from '@/components/AgentDirectory'
import Footer from '@/components/Footer'
import { AgentsProvider } from '@/components/AgentsProvider'

export const metadata = {
  title: 'Spawn App | AI Agent Directory',
  description: 'Browse, search, and verify AI agents. Real-time reputation scores powered by TEE verification.',
}

export default function AppPage() {
  return (
    <AgentsProvider>
      <main className="min-h-screen bg-background">
        <Navigation />
        <Hero />
        <Stats />
        <FeaturedAgents />
        <RecentlyAdded />
        <AgentDirectory />
        <Footer />
      </main>
    </AgentsProvider>
  )
}
