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

export const metadata = {
    title: 'The Silent Killers of Your Retirement | Everence Wealth',
    description:
        'Discover the three silent forces — fees, volatility, and taxes — eroding your retirement portfolio, and learn how to protect your wealth.',
}

export default function KillersPage() {
    return (
        <ScrollReveal>
            <div className="relative w-full">
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
