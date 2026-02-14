'use client'

const BUCKETS = [
    {
        number: '01',
        icon: '🪣',
        label: 'TAXABLE',
        subtitle: '"Tax Now"',
        what: 'Savings accounts, CDs, brokerage accounts (stocks, bonds, crypto)',
        how: 'You pay taxes on both the principal (when you earn it) and the growth (every year via 1099 forms) — even if you don\'t withdraw.',
        treatments: [
            'Interest: Taxed as ordinary income',
            'Capital gains: 15-20% + state tax',
            'Dividends: Taxed annually',
        ],
        cost: 'Taxed on the seed AND the harvest. Every year.',
        use: 'Emergency funds, short-term savings, liquidity needs',
        color: 'red',
        bgGradient: 'from-red-500/10 to-red-600/5',
        borderColor: 'border-red-300/50',
        iconBg: 'bg-red-100',
        textColor: 'text-red-500',
        badgeColor: 'bg-red-500',
    },
    {
        number: '02',
        icon: '⏰💣',
        label: 'TAX-DEFERRED',
        subtitle: '"Tax Later"',
        what: '401(k), 403(b), 457 plans, Traditional IRAs',
        how: 'Tax deduction today. Money grows tax-deferred. But every dollar withdrawn is taxed as ordinary income — the highest rates.',
        treatments: [
            'RMDs forced at age 72-73',
            'All withdrawals = ordinary income',
            'Penalty up to 50% for missed RMDs',
        ],
        cost: 'The IRS is your silent partner — they own a percentage.',
        use: 'Pre-tax contributions during high-earning years (with repositioning plan)',
        color: 'amber',
        bgGradient: 'from-amber-500/10 to-amber-600/5',
        borderColor: 'border-amber-300/50',
        iconBg: 'bg-amber-100',
        textColor: 'text-amber-600',
        badgeColor: 'bg-amber-500',
    },
    {
        number: '03',
        icon: '🛡️✨',
        label: 'TAX-EXEMPT',
        subtitle: '"Tax Never"',
        what: 'Roth IRAs, SER (Strategic Equity Resource), Indexed Plans',
        how: 'Pay taxes on the seed (post-tax contributions). Money grows 100% tax-free. Withdrawals are 100% tax-free.',
        treatments: [
            'Zero taxes on growth',
            'Zero taxes on withdrawals',
            'Zero taxes on inheritance',
        ],
        cost: 'Zero is your hero. No RMDs. No impact on Social Security.',
        use: 'Long-term wealth, retirement income, legacy planning, asset protection',
        color: 'emerald',
        bgGradient: 'from-emerald-500/10 to-emerald-600/5',
        borderColor: 'border-emerald-300/50',
        iconBg: 'bg-emerald-100',
        textColor: 'text-emerald-600',
        badgeColor: 'bg-emerald-500',
    },
]

const TABLE_ROWS = [
    { label: 'Tax on Contributions', taxable: 'Yes', deferred: 'No (deduction)', exempt: 'Yes' },
    { label: 'Tax on Growth', taxable: 'Annual', deferred: 'No (deferred)', exempt: 'Never', highlight: true },
    { label: 'Tax on Withdrawals', taxable: 'Capital gains', deferred: 'Ordinary income', exempt: 'Tax-free', highlight: true },
    { label: 'RMDs Required?', taxable: 'No', deferred: 'Yes (72-73)', exempt: 'No' },
    { label: 'Income Limits', taxable: 'No', deferred: 'No', exempt: 'Yes (Roth) / No (SER)' },
    { label: 'Contribution Limits', taxable: 'No', deferred: 'Yes', exempt: 'Yes (Roth) / No (SER)' },
    { label: 'Asset Protection', taxable: 'Limited', deferred: 'Limited', exempt: 'Strong (SER)', bold: true },
]

export default function ThreeBuckets() {
    return (
        <section id="buckets" className="relative overflow-hidden bg-gradient-to-b from-[#020806] via-[#0a1f1a] to-[#020806] py-24 md:py-40">
            <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
            <div className="indexed-mesh-bg pointer-events-none absolute inset-0" />

            <div className="relative mx-auto max-w-6xl px-6">
                {/* Header */}
                <div className="mb-16 text-center">
                    <span className="mb-4 inline-block font-space-grotesk text-sm font-bold tracking-[0.2em] text-emerald-400">
                        / THE FRAMEWORK
                    </span>
                    <h2 className="scroll-reveal relative mx-auto mb-6 inline-block font-space-grotesk text-4xl font-black tracking-tight text-white md:text-6xl lg:text-7xl">
                        The Three Tax Buckets
                        <svg className="indexed-slash-underline absolute -bottom-2 left-0 w-full" viewBox="0 0 300 10" preserveAspectRatio="none" height="10">
                            <path d="M0 8 L300 2" stroke="url(#slashGradBuckets)" strokeWidth="4" fill="none" strokeLinecap="round" />
                            <defs>
                                <linearGradient id="slashGradBuckets" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#EF4444" />
                                    <stop offset="33%" stopColor="#F59E0B" />
                                    <stop offset="66%" stopColor="#1A4D3E" />
                                    <stop offset="100%" stopColor="#10B981" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </h2>
                    <p className="scroll-reveal mx-auto mt-8 max-w-xl text-lg text-white/80">
                        Every dollar you own sits in one of three tax categories. Where you put your money determines when — and how much — the government takes.
                    </p>
                </div>

                {/* Three Buckets */}
                <div className="mb-20 grid gap-8 lg:grid-cols-3">
                    {BUCKETS.map((bucket, i) => (
                        <div
                            key={bucket.label}
                            className="scroll-reveal rounded-3xl border border-white/[0.08] bg-white/[0.03] p-1 shadow-[0_20px_60px_rgba(0,0,0,0.3)] transition-all duration-500 hover:-translate-y-2"
                            style={{ backdropFilter: 'blur(16px)', transitionDelay: `${i * 150}ms` }}
                        >
                            <div className="rounded-[1.25rem] p-6 md:p-8">
                                {/* Badge */}
                                <div className="mb-6 flex items-center justify-between">
                                    <span className={`rounded-full ${bucket.badgeColor} px-3 py-1 text-[10px] font-black tracking-wider text-white`}>
                                        {bucket.label}
                                    </span>
                                    <span className="text-xs font-bold text-white/60">{bucket.subtitle}</span>
                                </div>

                                {/* Icon */}
                                <div className="indexed-icon-float mb-4 text-4xl">{bucket.icon}</div>

                                {/* What */}
                                <div className="mb-4">
                                    <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-white/70">What It Is</p>
                                    <p className="text-sm text-white/90">{bucket.what}</p>
                                </div>

                                {/* How */}
                                <div className="mb-4">
                                    <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-white/70">How It Works</p>
                                    <p className="text-sm text-white/90">{bucket.how}</p>
                                </div>

                                {/* Tax treatments */}
                                <div className="mb-4 space-y-2">
                                    {bucket.treatments.map((t) => (
                                        <div key={t} className="rounded-lg bg-white/[0.04] px-3 py-2 text-xs text-white/80">
                                            {t}
                                        </div>
                                    ))}
                                </div>

                                {/* Cost */}
                                <div className={`mb-4 rounded-xl bg-white/[0.06] p-4 text-center text-sm font-bold ${bucket.textColor}`} style={{ backdropFilter: 'blur(8px)' }}>
                                    {bucket.cost}
                                </div>

                                {/* When to use */}
                                <p className="text-[10px] font-bold uppercase tracking-wider text-white/60">
                                    Best For: <span className="text-white/80">{bucket.use}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Comparison Table */}
                <div className="scroll-reveal overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] shadow-[0_20px_60px_rgba(0,0,0,0.3)]" style={{ backdropFilter: 'blur(16px)' }}>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[650px]">
                            <thead>
                                <tr className="border-b border-white/[0.08]" style={{ background: 'rgba(255,255,255,0.04)' }}>
                                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-white/80">Feature</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-red-400">Taxable</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-amber-400">Tax-Deferred</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-emerald-400">Tax-Exempt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {TABLE_ROWS.map((row) => (
                                    <tr key={row.label} className={`border-b border-white/[0.04] ${row.bold ? 'bg-emerald-500/[0.06]' : ''}`}>
                                        <td className={`px-6 py-3.5 text-sm ${row.bold ? 'font-bold text-white/90' : 'text-white/80'}`}>{row.label}</td>
                                        <td className={`px-6 py-3.5 text-center font-space-grotesk text-sm ${row.highlight ? 'font-bold text-red-400/80' : 'text-white/80'}`}>{row.taxable}</td>
                                        <td className={`px-6 py-3.5 text-center font-space-grotesk text-sm ${row.highlight ? 'font-bold text-amber-400/80' : 'text-white/80'}`}>{row.deferred}</td>
                                        <td className={`px-6 py-3.5 text-center font-space-grotesk text-sm ${row.highlight || row.bold ? 'font-bold text-emerald-400' : 'text-white/80'}`}>{row.exempt}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    )
}
