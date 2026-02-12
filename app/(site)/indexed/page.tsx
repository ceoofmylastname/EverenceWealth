import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import ScrollReveal from '@/components/ScrollReveal'
import IndexedHero from '@/components/indexed/IndexedHero'
import WholesaleVsRetail from '@/components/indexed/WholesaleVsRetail'
import ThreePillars from '@/components/indexed/ThreePillars'
import HistoricalPerformance from '@/components/indexed/HistoricalPerformance'
import TaxAdvantages from '@/components/indexed/TaxAdvantages'
import LivingBenefits from '@/components/indexed/LivingBenefits'
import IndexedCalculator from '@/components/indexed/IndexedCalculator'
import HowItWorks from '@/components/indexed/HowItWorks'
import IndexedFinalCTA from '@/components/indexed/IndexedFinalCTA'

export const metadata = {
    title: 'The Indexed Strategy — Zero Is Your Hero | Everence Wealth',
    description:
        'Discover the indexed strategy: 0% floor protection from market loss, participation in market gains, and 100% tax-free growth.',
}

export default function IndexedPage() {
    return (
        <ScrollReveal>
            <div className="relative w-full">
                <Navbar />
                <IndexedHero />
                <main>
                    <WholesaleVsRetail />
                    <ThreePillars />
                    <HistoricalPerformance />
                    <TaxAdvantages />
                    <LivingBenefits />
                    <IndexedCalculator />
                    <HowItWorks />
                    <IndexedFinalCTA />
                </main>
                <Footer />
            </div>
        </ScrollReveal>
    )
}
