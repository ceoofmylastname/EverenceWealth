import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import ScrollReveal from '@/components/ScrollReveal'
import Footer from '@/components/Footer'
import TaxesHero from '@/components/taxes/TaxesHero'
import TaxProblem from '@/components/taxes/TaxProblem'
import ThreeBuckets from '@/components/taxes/ThreeBuckets'
import TaxTimeBomb from '@/components/taxes/TaxTimeBomb'
import TaxSolution from '@/components/taxes/TaxSolution'
import TaxPhilosophy from '@/components/taxes/TaxPhilosophy'
import TaxCaseStudy from '@/components/taxes/TaxCaseStudy'
import TaxMistakes from '@/components/taxes/TaxMistakes'
import TaxAudience from '@/components/taxes/TaxAudience'
import TaxFAQ from '@/components/taxes/TaxFAQ'
import { TAX_FAQ_ITEMS } from '@/lib/faq-data'
import TaxesFinalCTA from '@/components/taxes/TaxesFinalCTA'
import { webPageSchema, breadcrumbSchema, faqSchema, JsonLd } from '@/lib/schema'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.everencewealth.com'

export const metadata: Metadata = {
    title: 'Tax Strategy & Retirement Planning | Everence Wealth',
    description: 'Discover the Three Tax Buckets framework and how strategic tax planning can protect 30-50% of your retirement wealth from unnecessary taxation.',
    alternates: { canonical: `${siteUrl}/taxes` },
    openGraph: {
        title: 'Tax Strategy & Retirement Planning | Everence Wealth',
        description: 'Discover the Three Tax Buckets framework and how strategic tax planning can protect 30-50% of your retirement wealth.',
    },
}

export default function TaxesPage() {
    return (
        <ScrollReveal>
            <div className="relative w-full">
                <JsonLd data={webPageSchema({ name: 'Tax Strategy & Retirement Planning', description: 'Discover the Three Tax Buckets framework and how strategic tax planning can protect 30-50% of your retirement wealth from unnecessary taxation.', url: `${siteUrl}/taxes` })} />
                <JsonLd data={faqSchema(TAX_FAQ_ITEMS)} />
                <JsonLd data={breadcrumbSchema([{ name: 'Home', url: siteUrl }, { name: 'Tax Strategy', url: `${siteUrl}/taxes` }])} />
                <Navbar />
                <TaxesHero />
                <main>
                    <TaxProblem />
                    <ThreeBuckets />
                    <TaxTimeBomb />
                    <TaxSolution />
                    <TaxPhilosophy />
                    <TaxCaseStudy />
                    <TaxMistakes />
                    <TaxAudience />
                    <TaxFAQ />
                    <TaxesFinalCTA />
                </main>
                <Footer />
            </div>
        </ScrollReveal>
    )
}
