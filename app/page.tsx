import LandingHero from '@/components/landing/LandingHero'
import Features from '@/components/landing/Features'
import HowItWorks from '@/components/landing/HowItWorks'
import LandingStats from '@/components/landing/LandingStats'
import LandingFAQ from '@/components/landing/LandingFAQ'
import LandingFooter from '@/components/landing/LandingFooter'
import LandingNav from '@/components/landing/LandingNav'

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <LandingNav />
      <LandingHero />
      <Features />
      <HowItWorks />
      <LandingStats />
      <LandingFAQ />
      <LandingFooter />
    </main>
  )
}
