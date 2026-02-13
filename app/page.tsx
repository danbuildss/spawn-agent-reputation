import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Stats from '@/components/Stats'
import AgentDirectory from '@/components/AgentDirectory'
import FAQ from '@/components/FAQ'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <Navigation />
      <Hero />
      <Stats />
      <AgentDirectory />
      <FAQ />
      <Footer />
    </main>
  )
}
