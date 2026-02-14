import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import ScrollReveal from '@/components/ScrollReveal'
import Footer from '@/components/Footer'
import PhilosophyHero from '@/components/philosophy/PhilosophyHero'
import CoreShift from '@/components/philosophy/CoreShift'
import CashFlowKing from '@/components/philosophy/CashFlowKing'
import DeploymentSection from '@/components/philosophy/DeploymentSection'
import HumanAsset from '@/components/philosophy/HumanAsset'
import SilentKillers from '@/components/philosophy/SilentKillers'
import TaxBuckets from '@/components/philosophy/TaxBuckets'
import ZeroHero from '@/components/philosophy/ZeroHero'
import EEATSection from '@/components/philosophy/EEATSection'
import PhilosophyFinalCTA from '@/components/philosophy/PhilosophyFinalCTA'
import { webPageSchema, breadcrumbSchema, JsonLd } from '@/lib/schema'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.everencewealth.com'

export const metadata: Metadata = {
    title: 'Our Philosophy | Everence Wealth - From Accumulation to Abundance',
    description: 'Everence Wealth challenges traditional "save and wait" retirement planning. Learn our philosophy of cash flow, tax efficiency, and wealth deployment.',
    alternates: { canonical: `${siteUrl}/philosophy` },
    openGraph: {
        title: 'Our Philosophy | Everence Wealth',
        description: 'Everence Wealth challenges traditional "save and wait" retirement planning. Learn our philosophy of cash flow, tax efficiency, and wealth deployment.',
    },
}

export default function PhilosophyPage() {
    return (
        <ScrollReveal>
            <div className="relative w-full">
                <JsonLd data={webPageSchema({ name: 'Our Philosophy — From Accumulation to Abundance', description: 'Everence Wealth challenges traditional retirement planning with a philosophy of cash flow, tax efficiency, and wealth deployment.', url: `${siteUrl}/philosophy` })} />
                <JsonLd data={breadcrumbSchema([{ name: 'Home', url: siteUrl }, { name: 'Our Philosophy', url: `${siteUrl}/philosophy` }])} />
                <Navbar />
                <PhilosophyHero />
                <main>
                    <CoreShift />
                    <CashFlowKing />
                    <DeploymentSection />
                    <HumanAsset />
                    <SilentKillers />
                    <TaxBuckets />
                    <ZeroHero />
                    <EEATSection />
                    <PhilosophyFinalCTA />
                </main>
                <Footer />
            </div>
        </ScrollReveal>
    )
}
