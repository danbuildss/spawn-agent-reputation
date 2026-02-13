import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import FeaturedAgents from '@/components/FeaturedAgents'
import RecentlyAdded from '@/components/RecentlyAdded'
import AgentDirectory from '@/components/AgentDirectory'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'
import { AgentsProvider } from '@/components/AgentsProvider'

export default function Home() {
  return (
    <AgentsProvider>
      <main className="min-h-screen bg-background">
        <Navigation />
        <Hero />
        <Stats />
        <FeaturedAgents />
        <RecentlyAdded />
        <AgentDirectory />
        <FAQ />
        <Footer />
      </main>
    </AgentsProvider>
  )
}
