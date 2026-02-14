'use client'

const STRATEGIES = [
    {
        number: '01',
        icon: '🔄',
        title: 'Roth Conversion',
        badge: 'REPOSITION',
        description: 'Convert Traditional IRA dollars to Roth IRA. Pay taxes now at known rates. Enjoy tax-free growth and withdrawals forever. Eliminate RMDs.',
        benefits: [
            'Tax-free growth and withdrawals',
            'Eliminate future RMDs',
            'Lock in today\'s tax rates',
            'Strategic timing opportunities',
        ],
        bestFor: 'Mid-career professionals, those in lower-tax years, strategic tax planning',
        gradient: 'from-emerald-500/20 to-emerald-600/5',
        border: 'border-emerald-300/30',
        color: 'text-emerald-400',
        badgeBg: 'bg-emerald-500',
    },
    {
        number: '02',
        icon: '🛡️',
        title: 'SER (Strategic Equity Resource)',
        badge: 'HIGH NET WORTH',
        description: 'No income limitations. No contribution limits. Tax-free retirement distributions. Market index participation with downside protection. Asset protection.',
        benefits: [
            'No income or contribution limits',
            'Tax-free distributions',
            '0% floor — no market losses',
            'Creditor & lawsuit protection',
        ],
        bestFor: 'Business owners, high earners, those who\'ve maxed out Roth options',
        gradient: 'from-teal-500/20 to-teal-600/5',
        border: 'border-teal-300/30',
        color: 'text-teal-400',
        badgeBg: 'bg-teal-500',
    },
    {
        number: '03',
        icon: '📊',
        title: 'Indexed Universal Life (IUL)',
        badge: 'DUAL PURPOSE',
        description: 'Tax-free policy loans in retirement. Market-linked growth with 0% floor. Death benefit for legacy planning. Living benefits for chronic/critical illness.',
        benefits: [
            'Tax-free retirement income',
            'Market growth + 0% floor',
            'Death benefit for heirs',
            'Living benefits included',
        ],
        bestFor: 'Families seeking life insurance + retirement income combination',
        gradient: 'from-emerald-500/20 to-emerald-600/5',
        border: 'border-emerald-300/30',
        color: 'text-emerald-400',
        badgeBg: 'bg-emerald-500',
    },
]

export default function TaxSolution() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-[#020806] via-[#0a1f1a] to-[#020806] py-24 md:py-40">
            <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
            <div className="indexed-mesh-bg pointer-events-none absolute inset-0" />

            <div className="relative mx-auto max-w-6xl px-6">
                {/* Header */}
                <div className="mb-16 text-center">
                    <span className="mb-4 inline-block font-space-grotesk text-sm font-bold tracking-[0.2em] text-emerald-400">
                        / THE SOLUTION
                    </span>
                    <h2 className="scroll-reveal relative mx-auto mb-6 inline-block font-space-grotesk text-4xl font-black tracking-tight text-white md:text-6xl lg:text-7xl">
                        Defuse the Tax Bomb
                        <svg className="indexed-slash-underline absolute -bottom-2 left-0 w-full" viewBox="0 0 300 10" preserveAspectRatio="none" height="10">
                            <path d="M0 8 L300 2" stroke="url(#slashGradSolution)" strokeWidth="4" fill="none" strokeLinecap="round" />
                            <defs>
                                <linearGradient id="slashGradSolution" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#1A4D3E" />
                                    <stop offset="50%" stopColor="#10B981" />
                                    <stop offset="100%" stopColor="#10B981" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </h2>
                    <p className="scroll-reveal mx-auto mt-8 max-w-2xl text-lg text-white/80">
                        <strong className="text-white/90">Pay taxes on the seed</strong> (small amount today) to ensure <strong className="text-white/90">the harvest</strong> (large amount tomorrow) is <strong className="text-emerald-400">tax-free</strong>.
                    </p>
                </div>

                {/* Strategy Cards */}
                <div className="grid gap-8 lg:grid-cols-3">
                    {STRATEGIES.map((strategy, i) => (
                        <div
                            key={strategy.title}
                            className={`scroll-reveal rounded-3xl border ${strategy.border} bg-white/[0.03] p-1 shadow-[0_20px_60px_rgba(0,0,0,0.3)] transition-all duration-500 hover:-translate-y-3`}
                            style={{ backdropFilter: 'blur(16px)', transitionDelay: `${i * 150}ms` }}
                        >
                            {/* Gradient top bar */}
                            <div className="indexed-pillar-bar rounded-t-[1.25rem]" />

                            <div className="p-6 md:p-8">
                                {/* Header */}
                                <div className="mb-6 flex items-start justify-between">
                                    <div>
                                        <span className={`mb-2 inline-block rounded-full ${strategy.badgeBg} px-3 py-1 text-[9px] font-black tracking-wider text-white`}>
                                            {strategy.badge}
                                        </span>
                                        <h3 className="mt-2 font-space-grotesk text-xl font-black text-white">{strategy.title}</h3>
                                    </div>
                                    <span className="indexed-icon-float text-3xl">{strategy.icon}</span>
                                </div>

                                <p className="mb-6 text-sm text-white/80">{strategy.description}</p>

                                {/* Benefits */}
                                <div className="mb-6 space-y-2">
                                    {strategy.benefits.map((b) => (
                                        <div key={b} className="flex items-center gap-2 text-sm">
                                            <span className={`font-bold ${strategy.color}`}>✓</span>
                                            <span className="text-white/90">{b}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Best For */}
                                <div className="rounded-xl bg-white/[0.04] p-4" style={{ backdropFilter: 'blur(8px)' }}>
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-white/25">Best For</p>
                                    <p className="mt-1 text-xs text-white/80">{strategy.bestFor}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
