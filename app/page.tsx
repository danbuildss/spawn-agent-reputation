import LandingNav from '@/components/landing/LandingNav'
import LandingHero from '@/components/landing/LandingHero'
import Features from '@/components/landing/Features'
import LandingFooter from '@/components/landing/LandingFooter'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <LandingNav />
      <LandingHero />
      <Features />
      <LandingFooter />
    </main>
  )
}
