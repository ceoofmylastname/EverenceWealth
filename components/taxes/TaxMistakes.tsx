'use client'

const MISTAKES = [
    {
        number: '01',
        title: '"I\'ll Be in a Lower Tax Bracket in Retirement"',
        why: 'Many retirees discover they\'re in the same or higher bracket due to: RMDs forcing large withdrawals, Social Security taxation, pension income, investment income, and rising tax rates to fund national debt.',
        icon: '❌',
    },
    {
        number: '02',
        title: '"My 401(k) Match Is Too Good to Pass Up"',
        why: 'The employer match is valuable — but it\'s still going into a taxable account (tax-deferred). You\'re getting "free money" that the IRS will tax later. Better strategy: take the match, then reposition gains into tax-exempt vehicles.',
        icon: '❌',
    },
    {
        number: '03',
        title: '"Roth IRAs Are Only for Young People"',
        why: 'Roth conversions can be powerful at any age — especially during lower-income years, market downturns (convert at lower values), or early retirement before RMDs kick in.',
        icon: '❌',
    },
    {
        number: '04',
        title: '"I\'ll Just Deal with Taxes Later"',
        why: '"Later" means: higher tax rates (likely), forced RMDs (definite), less flexibility (locked in), and larger tax bills (compounded). The best time to fix your tax structure was 20 years ago. The second-best time is today.',
        icon: '⚠️',
    },
]

export default function TaxMistakes() {
    return (
        <section className="relative bg-white py-24 md:py-40">
            <div className="indexed-mesh-bg pointer-events-none absolute inset-0" />
            <div className="relative mx-auto max-w-4xl px-6">
                {/* Header */}
                <div className="mb-16 text-center">
                    <span className="mb-4 inline-block font-space-grotesk text-sm font-bold tracking-[0.2em] text-red-500">
                        / AVOID THESE
                    </span>
                    <h2 className="scroll-reveal relative mx-auto mb-6 inline-block font-space-grotesk text-4xl font-black tracking-tight text-[#1A4D3E] md:text-6xl lg:text-7xl">
                        Common Tax Mistakes
                        <svg className="indexed-slash-underline absolute -bottom-2 left-0 w-full" viewBox="0 0 300 10" preserveAspectRatio="none" height="10">
                            <path d="M0 8 L300 2" stroke="url(#slashGradMistakes)" strokeWidth="4" fill="none" strokeLinecap="round" />
                            <defs>
                                <linearGradient id="slashGradMistakes" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#EF4444" />
                                    <stop offset="100%" stopColor="#F59E0B" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </h2>
                </div>

                {/* Mistakes */}
                <div className="space-y-6">
                    {MISTAKES.map((mistake, i) => (
                        <div
                            key={mistake.number}
                            className="indexed-card-3d scroll-reveal rounded-3xl border border-gray-200 bg-gradient-to-r from-gray-50 to-white p-8"
                            style={{ transitionDelay: `${i * 100}ms` }}
                        >
                            <div className="flex gap-6">
                                <div className="flex-shrink-0">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-2xl">
                                        {mistake.icon}
                                    </div>
                                    <span className="mt-2 block text-center font-space-grotesk text-xs font-black text-black/10">{mistake.number}</span>
                                </div>
                                <div>
                                    <h3 className="mb-3 font-space-grotesk text-lg font-bold text-[#1A4D3E]">{mistake.title}</h3>
                                    <p className="text-[#4A5565]">{mistake.why}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
