import type { Metadata } from 'next'
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
import { FAQ_ITEMS } from '@/lib/faq-data'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'
import Testimonials from '@/components/Testimonials'
import BlogSection from '@/components/BlogSection'
import ScrollReveal from '@/components/ScrollReveal'
import CursorGlow from '@/components/CursorGlow'
import { faqSchema, breadcrumbSchema, webPageSchema, JsonLd, COMPANY } from '@/lib/schema'

export const revalidate = 60

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.everencewealth.com'

export const metadata: Metadata = {
    title: 'Everence Wealth | Bridge the Retirement Gap',
    description: 'Independent fiduciary wealth management helping you bridge the retirement gap. Tax-efficient strategies, indexed life insurance, and comprehensive retirement planning in San Francisco.',
    openGraph: {
        title: 'Everence Wealth | Bridge the Retirement Gap',
        description: 'Independent fiduciary wealth management helping you bridge the retirement gap with tax-efficient strategies and indexed life insurance.',
        type: 'website',
        url: siteUrl,
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Everence Wealth | Bridge the Retirement Gap',
        description: 'Independent fiduciary wealth management helping you bridge the retirement gap with tax-efficient strategies and indexed life insurance.',
    },
    alternates: {
        canonical: siteUrl,
    },
}

export default function Home() {
  return (
    <ScrollReveal>
      <div className="relative w-full bg-[#020806]">
        <JsonLd data={webPageSchema({ name: 'Everence Wealth — Bridge the Retirement Gap', description: COMPANY.description, url: siteUrl })} />
        <JsonLd data={faqSchema(FAQ_ITEMS)} />
        <JsonLd data={breadcrumbSchema([{ name: 'Home', url: siteUrl }])} />
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
          <Testimonials />
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
