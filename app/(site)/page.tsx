import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import WakeUpCall from '@/components/WakeUpCall'
import SilentKillers from '@/components/SilentKillers'
import TaxBuckets from '@/components/TaxBuckets'
import IndexedAdvantage from '@/components/IndexedAdvantage'
import WealthPhilosophy from '@/components/WealthPhilosophy'
import FiduciaryDifference from '@/components/FiduciaryDifference'
import TheGap from '@/components/TheGap'
import About from '@/components/About'
import Stats from '@/components/Stats'
import Assessment from '@/components/Assessment'
import FAQ from '@/components/FAQ'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'
import BlogSection from '@/components/BlogSection'
import ScrollReveal from '@/components/ScrollReveal'
import CursorGlow from '@/components/CursorGlow'

export const revalidate = 60

export default function Home() {
  return (
    <ScrollReveal>
      <div className="relative w-full bg-[#020806]">
        <CursorGlow />
        <Navbar />
        <Hero />
        <main>
          <WakeUpCall />
          <SilentKillers />
          <TaxBuckets />
          <IndexedAdvantage />
          <WealthPhilosophy />
          <FiduciaryDifference />
          <TheGap />
          <About />
          <Stats />
          <BlogSection />
          <Assessment />
          <FAQ />
          <CTA />
        </main>
        <Footer />
      </div>
    </ScrollReveal>
  )
}
