'use client'

import CountUp from '../killers/CountUp'

const KILLERS = [
    {
        number: '01',
        icon: '💸',
        title: 'Fees',
        description: 'Hidden management fees, expense ratios, and transaction costs compound over time, potentially eroding 30-40% of portfolio value over a career.',
        stat: '30-40%',
        statLabel: 'Portfolio Erosion',
        gradient: 'from-red-500/20 to-red-600/10',
        border: 'border-red-500/20',
        color: 'text-red-400',
    },
    {
        number: '02',
        icon: '📉',
        title: 'Volatility',
        description: 'Market crashes require exponentially larger gains to recover. A 50% loss requires a 100% gain just to break even — time you can\'t afford in retirement.',
        stat: '100%',
        statLabel: 'Gain Needed After 50% Loss',
        gradient: 'from-amber-500/20 to-amber-600/10',
        border: 'border-amber-500/20',
        color: 'text-amber-400',
    },
    {
        number: '03',
        icon: '🏛️',
        title: 'Taxes',
        description: 'The government\'s share of your retirement account. For most Americans in tax-deferred vehicles, this could be 30-50% of their total balance.',
        stat: '30-50%',
        statLabel: 'Claimed by IRS',
        gradient: 'from-teal-500/20 to-teal-600/10',
        border: 'border-teal-500/20',
        color: 'text-teal-400',
    },
]

export default function TaxProblem() {
    return (
        <section className="relative bg-white py-24 md:py-40">
            <div className="indexed-mesh-bg pointer-events-none absolute inset-0" />
            <div className="relative mx-auto max-w-6xl px-6">
                {/* Section 1: The Problem */}
                <div className="mb-24 text-center">
                    <span className="mb-4 inline-block font-space-grotesk text-sm font-bold tracking-[0.2em] text-red-500">
                        / THE PROBLEM
                    </span>
                    <h2 className="scroll-reveal relative mx-auto mb-6 inline-block font-space-grotesk text-4xl font-black tracking-tight text-[#1A4D3E] md:text-6xl lg:text-7xl">
                        It&apos;s Not What You Make.
                        <br />
                        <span className="text-red-500">It&apos;s What You Keep.</span>
                    </h2>
                    <div className="scroll-reveal mx-auto mt-8 max-w-2xl space-y-4 text-lg text-[#4A5565]">
                        <p>You&apos;ve spent decades building your retirement savings. You&apos;ve maxed out your 401(k). Contributed to your IRA. Watched your account balance grow.</p>
                        <p>But here&apos;s what most people don&apos;t realize until it&apos;s too late:</p>
                    </div>

                    {/* Callout Box */}
                    <div className="scroll-reveal mx-auto mt-10 max-w-xl">
                        <div className="indexed-card-3d rounded-3xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-white p-8 text-center shadow-indexed-lg">
                            <div className="mb-2 font-space-grotesk text-6xl font-black text-red-500 md:text-7xl">
                                <CountUp end={50} suffix="%" prefix="" />+
                            </div>
                            <p className="text-sm font-bold uppercase tracking-wider text-red-400">Potential Tax Burden</p>
                            <p className="mt-3 text-sm text-[#4A5565]">
                                On traditional retirement withdrawals when combining federal (up to 37%) and state taxes (up to 13.3%)
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section 2: Silent Killers */}
                <div>
                    <div className="mb-16 text-center">
                        <span className="mb-4 inline-block font-space-grotesk text-sm font-bold tracking-[0.2em] text-emerald-600">
                            / WHY RETURNS AREN&apos;T ENOUGH
                        </span>
                        <h2 className="scroll-reveal relative mx-auto mb-6 inline-block font-space-grotesk text-4xl font-black tracking-tight text-[#1A4D3E] md:text-6xl lg:text-7xl">
                            The Three Silent Killers
                            <svg className="indexed-slash-underline absolute -bottom-2 left-0 w-full" viewBox="0 0 300 10" preserveAspectRatio="none" height="10">
                                <path d="M0 8 L300 2" stroke="url(#slashGradKillers)" strokeWidth="4" fill="none" strokeLinecap="round" />
                                <defs>
                                    <linearGradient id="slashGradKillers" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#EF4444" />
                                        <stop offset="50%" stopColor="#1A4D3E" />
                                        <stop offset="100%" stopColor="#F59E0B" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </h2>
                        <p className="scroll-reveal mx-auto mt-8 max-w-xl text-lg text-[#4A5565]">
                            While everyone is chasing returns, three silent killers are quietly eroding wealth in the background.
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {KILLERS.map((killer, i) => (
                            <div
                                key={killer.title}
                                className={`indexed-card-3d scroll-reveal rounded-3xl border ${killer.border} bg-gradient-to-br ${killer.gradient} p-8 transition-all`}
                                style={{ transitionDelay: `${i * 150}ms` }}
                            >
                                <div className="mb-4 flex items-center justify-between">
                                    <span className="indexed-icon-float text-4xl">{killer.icon}</span>
                                    <span className="font-space-grotesk text-5xl font-black text-black/[0.04]">{killer.number}</span>
                                </div>
                                <h3 className={`mb-3 font-space-grotesk text-2xl font-black ${killer.color}`}>{killer.title}</h3>
                                <p className="mb-6 text-[#4A5565]">{killer.description}</p>
                                <div className="rounded-2xl bg-white/80 p-4 text-center shadow-indexed-sm" style={{ backdropFilter: 'blur(8px)' }}>
                                    <div className={`font-space-grotesk text-2xl font-black ${killer.color}`}>{killer.stat}</div>
                                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{killer.statLabel}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Insight callout */}
                    <div className="scroll-reveal mx-auto mt-12 max-w-3xl rounded-2xl border border-emerald-200 bg-emerald-50/50 p-8 text-center" style={{ backdropFilter: 'blur(8px)' }}>
                        <p className="text-lg text-[#4A5565]">
                            At Everence Wealth, we focus on <strong className="text-[#1A4D3E]">retention</strong>, not just returns.
                            Because the only number that matters is <strong className="text-[#1A4D3E]">what you actually get to keep</strong>.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
