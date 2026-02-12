'use client'

import CountUp from '../killers/CountUp'

const BUCKETS = [
    {
        icon: '🪣',
        label: 'Taxable Accounts',
        examples: 'Savings, Brokerage, CDs',
        color: 'red',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        iconBg: 'bg-red-100',
        textColor: 'text-red-600',
        treatments: [
            'Taxed on gains every year',
            'Taxed on dividends',
            'Taxed on interest',
        ],
        result: 'SLOW LEAK',
    },
    {
        icon: '⏰💣',
        label: 'Tax-Deferred',
        examples: '401(k), IRA, 403(b)',
        color: 'amber',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        iconBg: 'bg-amber-100',
        textColor: 'text-amber-600',
        treatments: [
            'Pay later (usually higher rate)',
            'RMDs force withdrawals at 73',
            'Taxed on entire balance',
        ],
        result: 'TAX TIME BOMB',
    },
    {
        icon: '🛡️✨',
        label: 'Tax-Free (Indexed)',
        examples: 'SER, IUL, Tax-Free Strategy',
        color: 'emerald',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        iconBg: 'bg-emerald-100',
        textColor: 'text-emerald-600',
        treatments: [
            'Grow 100% tax-free',
            'Withdraw 100% tax-free',
            'Pass on 100% tax-free',
        ],
        result: 'ZERO IS YOUR HERO',
    },
]

const TABLE_ROWS = [
    { label: 'Starting Balance', taxable: '$100,000', deferred: '$100,000', free: '$100,000' },
    { label: 'Growth (7% × 30yr)', taxable: '$761,226', deferred: '$761,226', free: '$761,226' },
    { label: 'Taxes Paid', taxable: '-$228,000', deferred: '-$228,000', free: '$0', highlight: true },
    { label: 'Your Net', taxable: '$533,226', deferred: '$533,226', free: '$761,226', bold: true },
]

export default function TaxAdvantages() {
    return (
        <section className="indexed-mesh-bg relative bg-gradient-to-b from-emerald-50/50 to-white py-24 md:py-40">
            <div className="mx-auto max-w-6xl px-6">
                {/* Header */}
                <div className="mb-16 text-center">
                    <span className="mb-4 inline-block font-space-grotesk text-sm font-bold tracking-[0.2em] text-emerald-600">
                        / THE TAX ADVANTAGE
                    </span>
                    <h2 className="scroll-reveal relative mx-auto mb-6 inline-block font-space-grotesk text-4xl font-black tracking-tight text-[#1A4D3E] md:text-6xl lg:text-8xl">
                        100% Tax-Free Growth
                        <svg className="indexed-slash-underline absolute -bottom-2 left-0 w-full" viewBox="0 0 300 10" preserveAspectRatio="none" height="10">
                            <path d="M0 8 L300 2" stroke="url(#slashGrad5)" strokeWidth="4" fill="none" strokeLinecap="round" />
                            <defs>
                                <linearGradient id="slashGrad5" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#1A4D3E" />
                                    <stop offset="50%" stopColor="#10B981" />
                                    <stop offset="100%" stopColor="#34D399" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </h2>
                    <p className="scroll-reveal mx-auto mt-8 max-w-xl text-lg text-[#4A5565]">
                        Not tax-deferred. Not tax-advantaged. <strong className="text-[#1A4D3E]">Tax-FREE.</strong>
                    </p>
                </div>

                {/* 3 Buckets */}
                <div className="mb-16 grid gap-8 md:grid-cols-3">
                    {BUCKETS.map((bucket, i) => (
                        <div
                            key={bucket.label}
                            className={`indexed-card-3d scroll-reveal rounded-3xl border-2 ${bucket.borderColor} ${bucket.bgColor} p-8 transition-all hover:-translate-y-2 hover:shadow-xl`}
                            style={{ transitionDelay: `${i * 150}ms` }}
                        >
                            <div className={`mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl ${bucket.iconBg} text-3xl`}>
                                {bucket.icon}
                            </div>
                            <h3 className={`mb-1 font-space-grotesk text-xl font-bold ${bucket.textColor}`}>{bucket.label}</h3>
                            <p className="mb-6 text-sm text-gray-500">{bucket.examples}</p>

                            <div className="mb-6 space-y-2">
                                {bucket.treatments.map((t) => (
                                    <p key={t} className="rounded-lg bg-white/60 px-3 py-2 text-sm text-gray-600">{t}</p>
                                ))}
                            </div>

                            <div className={`rounded-xl ${bucket.iconBg} px-4 py-3 text-center font-space-grotesk text-sm font-black ${bucket.textColor}`}>
                                {bucket.result}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Comparison Table */}
                <div className="indexed-card-3d scroll-reveal overflow-hidden rounded-3xl bg-white shadow-indexed-lg">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                            <thead>
                                <tr className="bg-[#1A4D3E] text-white">
                                    <th className="px-6 py-4 text-left text-sm font-bold">Comparison</th>
                                    <th className="px-6 py-4 text-center text-sm font-bold">Taxable</th>
                                    <th className="px-6 py-4 text-center text-sm font-bold">Tax-Deferred</th>
                                    <th className="px-6 py-4 text-center text-sm font-bold">Tax-Free</th>
                                </tr>
                            </thead>
                            <tbody>
                                {TABLE_ROWS.map((row) => (
                                    <tr key={row.label} className={`border-b border-gray-100 ${row.bold ? 'bg-emerald-50' : ''}`}>
                                        <td className={`px-6 py-4 text-sm ${row.bold ? 'font-bold text-[#1A4D3E]' : 'text-gray-600'}`}>{row.label}</td>
                                        <td className={`px-6 py-4 text-center font-space-grotesk text-sm ${row.highlight ? 'font-bold text-red-500' : row.bold ? 'font-bold text-gray-700' : 'text-gray-700'}`}>{row.taxable}</td>
                                        <td className={`px-6 py-4 text-center font-space-grotesk text-sm ${row.highlight ? 'font-bold text-amber-500' : row.bold ? 'font-bold text-gray-700' : 'text-gray-700'}`}>{row.deferred}</td>
                                        <td className={`px-6 py-4 text-center font-space-grotesk text-sm ${row.highlight ? 'font-bold text-emerald-500' : row.bold ? 'font-bold text-emerald-700' : 'text-gray-700'}`}>{row.free}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Savings callout */}
                <div className="scroll-reveal mt-12 text-center">
                    <div className="indexed-gradient-text mx-auto inline-block bg-clip-text font-space-grotesk text-4xl font-black text-transparent md:text-5xl">
                        <CountUp end={228000} prefix="$" /> saved
                    </div>
                    <p className="mt-2 text-lg text-[#4A5565]">in taxes over 30 years with tax-free strategies</p>
                </div>
            </div>
        </section>
    )
}
