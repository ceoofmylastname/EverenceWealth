'use client'

const PILLARS = [
    {
        icon: '💎',
        title: 'Fee Transparency',
        subtitle: 'Killer #1 Solved',
        description: 'Zero hidden fees. You see exactly what you pay — and keep more of what you earn.',
        color: 'red',
        borderColor: 'border-red-200',
        bgColor: 'bg-red-50',
        iconBg: 'bg-red-100',
    },
    {
        icon: '🛡️',
        title: 'Volatility Protection',
        subtitle: 'Killer #2 Solved',
        description: 'Indexed strategies with a 0% floor — participate in gains, never lose to market drops.',
        color: 'amber',
        borderColor: 'border-amber-200',
        bgColor: 'bg-amber-50',
        iconBg: 'bg-amber-100',
    },
    {
        icon: '🏦',
        title: 'Tax Optimization',
        subtitle: 'Killer #3 Solved',
        description: 'Legal strategies for tax-free growth and tax-free retirement income.',
        color: 'emerald',
        borderColor: 'border-emerald-200',
        bgColor: 'bg-emerald-50',
        iconBg: 'bg-emerald-100',
    },
]

export default function SolutionSection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 to-white py-24 md:py-32">
            {/* Green top bar */}
            <div className="absolute left-0 right-0 top-0 h-2 bg-gradient-to-r from-emerald-500 to-[#1A4D3E]" />

            {/* Background decoration */}
            <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.08)_0%,transparent_70%)]" />

            <div className="mx-auto max-w-6xl px-6">
                {/* Shield icon */}
                <div className="mx-auto mb-8 flex justify-center">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-[#1A4D3E] text-4xl shadow-[0_20px_60px_rgba(16,185,129,0.3)]">
                        🛡️
                    </div>
                </div>

                {/* Section label */}
                <p className="scroll-reveal mb-4 text-center text-xs font-bold uppercase tracking-[0.3em] text-emerald-600">
                    The Everence Wealth Solution
                </p>

                {/* Headline */}
                <h2 className="scroll-reveal mx-auto mb-6 max-w-3xl text-center font-space-grotesk text-4xl font-bold text-[#1A4D3E] md:text-5xl">
                    What If You Could Eliminate{' '}
                    <span className="text-emerald-500">All Three?</span>
                </h2>

                <p className="scroll-reveal mx-auto mb-16 max-w-2xl text-center text-lg text-[#4A5565]">
                    While Wall Street profits from complexity, we use proven strategies
                    to protect your wealth from all three silent killers.
                </p>

                {/* Three pillars */}
                <div className="mb-16 grid gap-8 md:grid-cols-3">
                    {PILLARS.map((pillar, i) => (
                        <div
                            key={pillar.title}
                            className={`scroll-reveal rounded-3xl border-2 ${pillar.borderColor} ${pillar.bgColor} p-8 text-center transition-all hover:-translate-y-2 hover:shadow-xl`}
                            style={{ transitionDelay: `${i * 150}ms` }}
                        >
                            <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl ${pillar.iconBg} text-3xl`}>
                                {pillar.icon}
                            </div>
                            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                                {pillar.subtitle}
                            </p>
                            <h3 className="mb-3 font-space-grotesk text-xl font-bold text-[#1A4D3E]">
                                {pillar.title}
                            </h3>
                            <p className="text-[#4A5565]">{pillar.description}</p>
                        </div>
                    ))}
                </div>

                {/* Comparison */}
                <div className="scroll-reveal mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-lg md:p-10">
                    <h3 className="mb-8 text-center font-space-grotesk text-2xl font-bold text-[#1A4D3E]">
                        The Difference Over 30 Years
                    </h3>
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Traditional */}
                        <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-6">
                            <h4 className="mb-4 font-space-grotesk text-lg font-bold text-red-600">Traditional Approach</h4>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li className="flex items-start gap-2">
                                    <span className="mt-0.5 text-red-500">✕</span>
                                    <span>Hidden fees eating 50%+ of growth</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-0.5 text-red-500">✕</span>
                                    <span>Full market downside exposure</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-0.5 text-red-500">✕</span>
                                    <span>100% taxable withdrawals</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-0.5 text-red-500">✕</span>
                                    <span>Sequence of returns risk</span>
                                </li>
                            </ul>
                            <div className="mt-6 rounded-xl bg-red-100 p-4 text-center">
                                <span className="text-sm text-red-600">Net Result</span>
                                <div className="font-space-grotesk text-2xl font-black text-red-600">~36% Kept</div>
                            </div>
                        </div>

                        {/* Everence */}
                        <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50 p-6">
                            <h4 className="mb-4 font-space-grotesk text-lg font-bold text-emerald-700">Everence Wealth Approach</h4>
                            <ul className="space-y-3 text-sm text-gray-600">
                                <li className="flex items-start gap-2">
                                    <span className="mt-0.5 text-emerald-500">✓</span>
                                    <span>Transparent, minimal fees</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-0.5 text-emerald-500">✓</span>
                                    <span>0% floor — never lose to market drops</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-0.5 text-emerald-500">✓</span>
                                    <span>Tax-free retirement income strategies</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="mt-0.5 text-emerald-500">✓</span>
                                    <span>Protected from sequence risk</span>
                                </li>
                            </ul>
                            <div className="mt-6 rounded-xl bg-emerald-100 p-4 text-center">
                                <span className="text-sm text-emerald-700">Net Result</span>
                                <div className="font-space-grotesk text-2xl font-black text-emerald-700">~85% Kept</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
