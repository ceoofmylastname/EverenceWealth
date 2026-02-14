import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'
import KillersHero from '@/components/killers/KillersHero'
import ProblemSection from '@/components/killers/ProblemSection'
import KillerFees from '@/components/killers/KillerFees'
import KillerVolatility from '@/components/killers/KillerVolatility'
import KillerTaxes from '@/components/killers/KillerTaxes'
import SolutionSection from '@/components/killers/SolutionSection'
import FinalCTA from '@/components/killers/FinalCTA'
import { webPageSchema, breadcrumbSchema, JsonLd } from '@/lib/schema'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.everencewealth.com'

export const metadata: Metadata = {
    title: 'The Silent Killers of Your Retirement | Everence Wealth',
    description: 'Discover the three silent forces — fees, volatility, and taxes — eroding your retirement portfolio, and learn how to protect your wealth.',
    alternates: { canonical: `${siteUrl}/killers` },
    openGraph: {
        title: 'The Silent Killers of Your Retirement | Everence Wealth',
        description: 'Discover the three silent forces — fees, volatility, and taxes — eroding your retirement portfolio.',
    },
}

export default function KillersPage() {
    return (
        <ScrollReveal>
            <div className="relative w-full">
                <JsonLd data={webPageSchema({ name: 'The Silent Killers of Your Retirement', description: 'Discover the three silent forces — fees, volatility, and taxes — eroding your retirement portfolio, and learn how to protect your wealth.', url: `${siteUrl}/killers` })} />
                <JsonLd data={breadcrumbSchema([{ name: 'Home', url: siteUrl }, { name: 'Silent Killers', url: `${siteUrl}/killers` }])} />
                <Navbar />
                <KillersHero />
                <main>
                    <ProblemSection />
                    <KillerFees />
                    <KillerVolatility />
                    <KillerTaxes />
                    <SolutionSection />
                    <FinalCTA />
                </main>
                <Footer />
            </div>
        </ScrollReveal>
    )
}
