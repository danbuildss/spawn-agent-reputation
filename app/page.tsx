import LandingNav from '@/components/landing/LandingNav'
import LandingHero from '@/components/landing/LandingHero'
import Features from '@/components/landing/Features'
import LandingFooter from '@/components/landing/LandingFooter'

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <LandingNav />
      <LandingHero />
      <Features />
      <LandingFooter />
    </main>
  )
}
