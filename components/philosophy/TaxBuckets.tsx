'use client'

const BUCKETS = [
    {
        number: '01',
        title: 'Taxable',
        status: 'Pay taxes on gains annually',
        items: ['Savings accounts', 'Brokerage accounts', 'CDs, bonds'],
        color: 'text-red-500',
        bg: 'bg-red-50',
        border: 'border-red-200',
        iconBg: 'bg-red-100',
        statusBg: 'bg-red-100',
        statusColor: 'text-red-600',
    },
    {
        number: '02',
        title: 'Tax-Deferred',
        status: 'Pay taxes later (often at higher rates)',
        items: ['401(k)', 'Traditional IRA', '403(b)'],
        color: 'text-amber-500',
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        iconBg: 'bg-amber-100',
        statusBg: 'bg-amber-100',
        statusColor: 'text-amber-600',
    },
    {
        number: '03',
        title: 'Tax-Exempt',
        status: 'Never pay taxes on gains',
        items: ['Roth IRA', 'Municipal bonds', 'Indexed Universal Life (IUL)'],
        color: 'text-emerald-500',
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        iconBg: 'bg-emerald-100',
        statusBg: 'bg-emerald-100',
        statusColor: 'text-emerald-600',
    },
]

export default function TaxBuckets() {
    return (
        <section className="indexed-mesh-bg relative bg-gradient-to-b from-[#F9FAFB] to-white py-24 md:py-40">
            <div className="mx-auto max-w-6xl px-6">
                {/* Header */}
                <div className="mb-20 text-center">
                    <span className="mb-4 inline-block font-space-grotesk text-xs font-bold tracking-[0.25em] text-emerald-600">
                        / THE THREE TAX BUCKETS
                    </span>
                    <h2 className="scroll-reveal relative mx-auto mb-6 inline-block font-space-grotesk text-4xl font-black tracking-tight text-[#1A4D3E] md:text-6xl lg:text-8xl">
                        Three Tax Buckets
                        <svg className="indexed-slash-underline absolute -bottom-2 left-0 w-full md:-bottom-4" viewBox="0 0 300 10" preserveAspectRatio="none" height="10">
                            <path d="M0 8 L300 2" stroke="url(#slashGradTB)" strokeWidth="4" fill="none" strokeLinecap="round" />
                            <defs>
                                <linearGradient id="slashGradTB" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#1A4D3E" />
                                    <stop offset="50%" stopColor="#10B981" />
                                    <stop offset="100%" stopColor="#34D399" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </h2>
                    <p className="scroll-reveal mx-auto mt-10 max-w-xl text-lg text-[#4A5565]">
                        Every dollar you save exists in one of three tax environments. Take control of your tax future.
                    </p>
                </div>

                {/* Buckets */}
                <div className="grid gap-8 md:grid-cols-3">
                    {BUCKETS.map((bucket, i) => (
                        <div
                            key={bucket.title}
                            className={`indexed-card-3d scroll-reveal group relative overflow-hidden rounded-3xl border-2 ${bucket.border} ${bucket.bg} p-8 transition-all hover:-translate-y-2 hover:shadow-xl`}
                            style={{ transitionDelay: `${i * 150}ms` }}
                        >
                            <div className="indexed-pillar-bar absolute left-0 right-0 top-0 origin-left scale-x-0 group-hover:scale-x-100" />
                            <span className="pointer-events-none absolute right-4 top-2 font-space-grotesk text-[100px] font-black leading-none text-black/[0.03] md:text-[120px]">{bucket.number}</span>

                            <div className={`relative mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl ${bucket.iconBg} text-3xl`}>
                                {bucket.number === '01' ? '🪣' : bucket.number === '02' ? '⏳' : '🛡️'}
                            </div>
                            <h3 className={`mb-4 font-space-grotesk text-2xl font-black ${bucket.color}`}>{bucket.title}</h3>

                            <div className="mb-6 space-y-2">
                                {bucket.items.map((item) => (
                                    <div key={item} className="flex items-center gap-2 text-sm text-[#4A5565]">
                                        <span className={`text-xs ${bucket.color}`}>&#8226;</span>
                                        {item}
                                    </div>
                                ))}
                            </div>

                            <div className={`rounded-xl ${bucket.statusBg} p-4 text-center`}>
                                <p className={`text-sm font-bold ${bucket.statusColor}`}>{bucket.status}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Strategic Question */}
                <div className="scroll-reveal mx-auto mt-16 max-w-2xl text-center">
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-8" style={{ backdropFilter: 'blur(8px)' }}>
                        <p className="mb-2 text-sm font-bold uppercase tracking-wider text-emerald-600">The Strategic Question</p>
                        <p className="font-space-grotesk text-xl font-bold text-[#1A4D3E] md:text-2xl">
                            Which bucket gives you the most control?
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
