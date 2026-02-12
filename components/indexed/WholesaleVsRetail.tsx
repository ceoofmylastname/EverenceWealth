'use client'

import CountUp from '../killers/CountUp'

const RETAIL_FEATURES = [
    { icon: '❌', text: 'No downside protection' },
    { icon: '❌', text: 'Hidden fees (2-3%)' },
    { icon: '❌', text: 'Tax time bomb' },
    { icon: '❌', text: 'Volatility trap' },
]

const INDEXED_FEATURES = [
    { icon: '✓', text: '0% floor protection' },
    { icon: '✓', text: 'Transparent, low fees' },
    { icon: '✓', text: 'Tax-free growth' },
    { icon: '✓', text: 'Annual reset locks gains' },
]

export default function WholesaleVsRetail() {
    return (
        <section id="wholesale" className="indexed-mesh-bg relative bg-gradient-to-b from-[#F9FAFB] to-white py-24 md:py-40">
            <div className="mx-auto max-w-6xl px-6">
                {/* Header */}
                <div className="mb-20 text-center">
                    <span className="mb-4 inline-block font-space-grotesk text-xs font-bold tracking-[0.25em] text-emerald-600">
                        / WHOLESALE VS RETAIL
                    </span>
                    <h2 className="scroll-reveal relative mx-auto mb-6 inline-block font-space-grotesk text-4xl font-black tracking-tight text-[#1A4D3E] md:text-6xl lg:text-8xl">
                        Wholesale vs Retail
                        <svg className="indexed-slash-underline absolute -bottom-2 left-0 w-full md:-bottom-4" viewBox="0 0 300 10" preserveAspectRatio="none" height="10">
                            <path d="M0 8 L300 2" stroke="url(#slashG2)" strokeWidth="4" fill="none" strokeLinecap="round" />
                            <defs><linearGradient id="slashG2" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#1A4D3E" /><stop offset="50%" stopColor="#10B981" /><stop offset="100%" stopColor="#34D399" /></linearGradient></defs>
                        </svg>
                    </h2>
                    <p className="scroll-reveal mx-auto mt-10 max-w-xl text-lg text-[#4A5565]">
                        Why indexed strategies outperform traditional investing
                    </p>
                </div>

                {/* Comparison Grid */}
                <div className="grid items-stretch gap-6 lg:grid-cols-[1fr_auto_1fr] lg:gap-8">
                    {/* Retail */}
                    <div className="indexed-card-3d scroll-reveal rounded-3xl border border-red-100 bg-white p-8 md:p-10">
                        <span className="mb-8 inline-block rounded-full bg-gradient-to-r from-red-500 to-red-600 px-5 py-2 text-xs font-black uppercase tracking-wider text-white shadow-[0_4px_20px_rgba(239,68,68,0.3)]">
                            Retail Investing
                        </span>

                        {/* Animated volatile chart */}
                        <div className="indexed-chart-container mb-8 rounded-2xl bg-gradient-to-br from-red-50 to-red-100/50 p-4 md:p-5">
                            <svg viewBox="0 0 300 120" className="w-full">
                                <defs>
                                    <linearGradient id="redFill" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#EF4444" stopOpacity="0.2" />
                                        <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <path d="M15 55 L55 30 L95 75 L135 45 L175 85 L215 35 L255 70 L285 40" fill="none" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="indexed-chart-line" style={{ strokeDasharray: 800, strokeDashoffset: 800 }} />
                                <path d="M15 55 L55 30 L95 75 L135 45 L175 85 L215 35 L255 70 L285 40 L285 110 L15 110 Z" fill="url(#redFill)" className="indexed-chart-area" />
                                <line x1="15" y1="55" x2="285" y2="55" stroke="#EF4444" strokeWidth="0.5" strokeDasharray="3 2" opacity="0.3" />
                                <text x="95" y="90" fill="#EF4444" fontSize="8" fontWeight="bold" textAnchor="middle" opacity="0.6">-30%</text>
                                <text x="175" y="100" fill="#EF4444" fontSize="8" fontWeight="bold" textAnchor="middle" opacity="0.6">-25%</text>
                            </svg>
                        </div>

                        <div className="mb-8 space-y-3">
                            {RETAIL_FEATURES.map((f) => (
                                <div key={f.text} className="flex items-center gap-3 rounded-xl bg-red-50 px-4 py-3 text-sm shadow-sm">
                                    <span className="text-red-500">{f.icon}</span>
                                    <span className="font-medium text-gray-700">{f.text}</span>
                                </div>
                            ))}
                        </div>

                        <div className="rounded-2xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-white p-6 text-center shadow-indexed-sm">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">30-Year Result</span>
                            <div className="font-space-grotesk text-4xl font-black text-red-500 md:text-5xl">
                                <CountUp end={168000} prefix="$" />
                            </div>
                            <p className="mt-1 text-sm text-gray-400">After fees & losses</p>
                        </div>
                    </div>

                    {/* VS Divider */}
                    <div className="flex items-center justify-center py-4 lg:flex-col lg:py-0">
                        <div className="hidden h-20 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent lg:block" />
                        <div className="indexed-vs-spin my-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#1A4D3E] via-emerald-500 to-emerald-400 shadow-[0_8px_30px_rgba(16,185,129,0.3)] md:h-24 md:w-24">
                            <span className="font-space-grotesk text-xl font-black text-white md:text-2xl">VS</span>
                        </div>
                        <div className="hidden h-20 w-px bg-gradient-to-b from-transparent via-gray-200 to-transparent lg:block" />
                    </div>

                    {/* Indexed */}
                    <div className="indexed-card-3d scroll-reveal rounded-3xl border border-emerald-100 bg-white p-8 md:p-10">
                        <span className="mb-8 inline-block rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-2 text-xs font-black uppercase tracking-wider text-white shadow-[0_4px_20px_rgba(16,185,129,0.3)]">
                            Indexed Strategy
                        </span>

                        {/* Animated smooth chart */}
                        <div className="indexed-chart-container mb-8 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-4 md:p-5">
                            <svg viewBox="0 0 300 120" className="w-full">
                                <defs>
                                    <linearGradient id="greenFillWhole" x1="0%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                                        <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                                    </linearGradient>
                                </defs>
                                <path d="M15 90 L55 78 L95 68 L135 58 L175 50 L215 42 L255 33 L285 22" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="indexed-chart-line" style={{ strokeDasharray: 800, strokeDashoffset: 800 }} />
                                <path d="M15 90 L55 78 L95 68 L135 58 L175 50 L215 42 L255 33 L285 22 L285 110 L15 110 Z" fill="url(#greenFillWhole)" className="indexed-chart-area" />
                                <line x1="15" y1="100" x2="285" y2="100" stroke="#10B981" strokeWidth="1" strokeDasharray="4 2" opacity="0.3" />
                                <text x="20" y="108" fill="#10B981" fontSize="7" fontWeight="bold" opacity="0.5">0% Floor</text>
                                <text x="135" y="50" fill="#10B981" fontSize="8" fontWeight="bold" textAnchor="middle" opacity="0.6">+12%</text>
                                <text x="255" y="26" fill="#10B981" fontSize="8" fontWeight="bold" textAnchor="middle" opacity="0.6">+11%</text>
                            </svg>
                        </div>

                        <div className="mb-8 space-y-3">
                            {INDEXED_FEATURES.map((f) => (
                                <div key={f.text} className="flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm shadow-sm">
                                    <span className="font-bold text-emerald-500">{f.icon}</span>
                                    <span className="font-medium text-gray-700">{f.text}</span>
                                </div>
                            ))}
                        </div>

                        <div className="rounded-2xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-6 text-center shadow-indexed-sm">
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">30-Year Result</span>
                            <div className="indexed-gradient-text indexed-stat-glow bg-clip-text font-space-grotesk text-4xl font-black text-transparent md:text-5xl">
                                <CountUp end={344064} prefix="$" />
                            </div>
                            <p className="mt-1 text-sm text-gray-400">Protected & compounding</p>
                        </div>
                    </div>
                </div>

                {/* Stat Explosion */}
                <div className="scroll-reveal mt-20 overflow-hidden rounded-3xl bg-gradient-to-r from-[#1A4D3E] via-emerald-600 to-emerald-500 p-12 text-center shadow-[0_20px_80px_rgba(16,185,129,0.2)] md:p-20">
                    <div className="indexed-stat-glow font-space-grotesk text-7xl font-black text-white md:text-9xl lg:text-[160px]">
                        <CountUp end={105} suffix="%" />
                    </div>
                    <p className="mt-4 text-xl font-bold text-white/70 md:text-2xl">
                        Better performance over 20 years (1999–2020)
                    </p>
                </div>
            </div>
        </section>
    )
}
