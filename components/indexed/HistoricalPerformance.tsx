'use client'

import CountUp from '../killers/CountUp'

const SP500_EVENTS = [
    { year: '2000', loss: '-37%' },
    { year: '2008', loss: '-51%' },
    { year: '2020', loss: '-34%' },
]

const INDEXED_EVENTS = [
    { year: '2000', result: '0%', label: 'Protected' },
    { year: '2008', result: '0%', label: 'Protected' },
    { year: '2020', result: '0%', label: 'Protected' },
]

export default function HistoricalPerformance() {
    return (
        <section className="relative bg-white py-24 md:py-40">
            {/* Subtle background pattern */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, #1A4D3E 1px, transparent 1px)', backgroundSize: '48px 48px' }} />

            <div className="mx-auto max-w-6xl px-6">
                {/* Header */}
                <div className="mb-20 text-center">
                    <span className="mb-4 inline-block font-space-grotesk text-xs font-bold tracking-[0.25em] text-emerald-600">
                        / PROVEN RESULTS
                    </span>
                    <h2 className="scroll-reveal relative mx-auto mb-6 inline-block font-space-grotesk text-4xl font-black tracking-tight text-[#1A4D3E] md:text-6xl lg:text-8xl">
                        20 Years of Data
                        <svg className="indexed-slash-underline absolute -bottom-2 left-0 w-full md:-bottom-4" viewBox="0 0 300 10" preserveAspectRatio="none" height="10">
                            <path d="M0 8 L300 2" stroke="url(#slashG4)" strokeWidth="4" fill="none" strokeLinecap="round" />
                            <defs><linearGradient id="slashG4" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#1A4D3E" /><stop offset="50%" stopColor="#10B981" /><stop offset="100%" stopColor="#34D399" /></linearGradient></defs>
                        </svg>
                    </h2>
                    <p className="scroll-reveal mx-auto mt-10 max-w-xl text-lg text-[#4A5565]">
                        1999–2020: Indexed vs S&P 500 Buy & Hold
                    </p>
                </div>

                {/* Full-Width Chart */}
                <div className="scroll-reveal mb-16">
                    <div className="indexed-chart-container rounded-3xl bg-gradient-to-br from-gray-50 to-gray-100 p-4 shadow-indexed-lg md:p-10">
                        <svg viewBox="0 0 900 380" className="w-full" preserveAspectRatio="xMidYMid meet">
                            {/* Grid */}
                            {[50, 120, 190, 260, 330].map((y) => (
                                <line key={y} x1="70" y1={y} x2="870" y2={y} stroke="#E5E7EB" strokeWidth="0.5" opacity="0.4" />
                            ))}

                            {/* Y-axis */}
                            <text x="60" y="55" fill="#9CA3AF" fontSize="10" textAnchor="end" fontFamily="monospace">$400k</text>
                            <text x="60" y="125" fill="#9CA3AF" fontSize="10" textAnchor="end" fontFamily="monospace">$300k</text>
                            <text x="60" y="195" fill="#9CA3AF" fontSize="10" textAnchor="end" fontFamily="monospace">$200k</text>
                            <text x="60" y="265" fill="#9CA3AF" fontSize="10" textAnchor="end" fontFamily="monospace">$100k</text>
                            <text x="60" y="335" fill="#9CA3AF" fontSize="10" textAnchor="end" fontFamily="monospace">$0</text>

                            {/* X-axis */}
                            {['1999', '2002', '2005', '2008', '2011', '2014', '2017', '2020'].map((yr, i) => (
                                <text key={yr} x={100 + i * 110} y="360" fill="#9CA3AF" fontSize="10" textAnchor="middle" fontFamily="monospace">{yr}</text>
                            ))}

                            {/* Green fill area */}
                            <path
                                d="M100 260 L150 250 L200 235 L250 240 L300 225 L350 220 L400 230 L450 215 L500 240 L550 230 L600 210 L650 190 L700 170 L750 155 L800 140 L840 85 L840 340 L100 340 Z"
                                fill="url(#histGreenFill)"
                                className="indexed-chart-area"
                            />
                            <defs>
                                <linearGradient id="histGreenFill" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
                                    <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                                </linearGradient>
                            </defs>

                            {/* S&P 500 line — RED with glow */}
                            <path
                                d="M100 260 L150 230 L200 275 L250 295 L300 305 L350 285 L400 260 L450 295 L500 320 L550 290 L600 260 L650 240 L700 220 L750 200 L800 175 L840 190"
                                fill="none" stroke="#EF4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                                className="indexed-chart-line" style={{ strokeDasharray: 2200, strokeDashoffset: 2200 }}
                            />
                            <path
                                d="M100 260 L150 230 L200 275 L250 295 L300 305 L350 285 L400 260 L450 295 L500 320 L550 290 L600 260 L650 240 L700 220 L750 200 L800 175 L840 190"
                                fill="none" stroke="#EF4444" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" opacity="0.06"
                                className="indexed-chart-line" style={{ strokeDasharray: 2200, strokeDashoffset: 2200 }}
                            />

                            {/* Indexed line — GREEN with glow */}
                            <path
                                d="M100 260 L150 250 L200 235 L250 240 L300 225 L350 220 L400 230 L450 215 L500 240 L550 230 L600 210 L650 190 L700 170 L750 155 L800 140 L840 85"
                                fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                                className="indexed-chart-line" style={{ strokeDasharray: 2200, strokeDashoffset: 2200, animationDelay: '0.5s' }}
                            />
                            <path
                                d="M100 260 L150 250 L200 235 L250 240 L300 225 L350 220 L400 230 L450 215 L500 240 L550 230 L600 210 L650 190 L700 170 L750 155 L800 140 L840 85"
                                fill="none" stroke="#10B981" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" opacity="0.08"
                                className="indexed-chart-line" style={{ strokeDasharray: 2200, strokeDashoffset: 2200, animationDelay: '0.5s' }}
                            />

                            {/* Crash annotations */}
                            <g>
                                <rect x="145" y="283" width="115" height="22" rx="6" fill="#FEE2E2" />
                                <text x="202" y="298" fill="#EF4444" fontSize="9" textAnchor="middle" fontWeight="bold">2000 Dot-com Crash</text>
                            </g>
                            <g>
                                <rect x="395" y="298" width="115" height="22" rx="6" fill="#FEE2E2" />
                                <text x="452" y="313" fill="#EF4444" fontSize="9" textAnchor="middle" fontWeight="bold">2008 Financial Crisis</text>
                            </g>
                            <g>
                                <rect x="770" y="200" width="100" height="22" rx="6" fill="#FEE2E2" />
                                <text x="820" y="215" fill="#EF4444" fontSize="9" textAnchor="middle" fontWeight="bold">2020 COVID Crash</text>
                            </g>

                            {/* Legend */}
                            <circle cx="280" cy="28" r="5" fill="#EF4444" />
                            <text x="292" y="32" fill="#6B7280" fontSize="11" fontWeight="600">S&P 500 Buy & Hold</text>
                            <circle cx="500" cy="28" r="5" fill="#10B981" />
                            <text x="512" y="32" fill="#6B7280" fontSize="11" fontWeight="600">Indexed Strategy (0% Floor, 12% Cap)</text>
                        </svg>
                    </div>
                </div>

                {/* Result Boxes — 3D cards */}
                <div className="grid gap-8 md:grid-cols-2">
                    <div className="indexed-card-3d scroll-reveal rounded-3xl border-2 border-red-100 bg-white p-8 md:p-10">
                        <h3 className="mb-4 font-space-grotesk text-xl font-black text-gray-900">S&P 500 Buy & Hold</h3>
                        <div className="mb-4 font-space-grotesk text-5xl font-black text-red-500 md:text-6xl">
                            <CountUp end={168000} prefix="$" />
                        </div>
                        <p className="mb-6 text-sm text-gray-500">Multiple devastating losses</p>
                        <div className="space-y-2">
                            {SP500_EVENTS.map((e) => (
                                <div key={e.year} className="flex items-center gap-3 rounded-xl bg-red-50 px-4 py-3 text-sm shadow-sm">
                                    <span className="font-bold text-gray-500">{e.year}:</span>
                                    <span className="font-bold text-red-500">Lost {e.loss}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="indexed-card-3d scroll-reveal rounded-3xl border-2 border-emerald-100 bg-white p-8 shadow-indexed-glow md:p-10">
                        <h3 className="mb-4 font-space-grotesk text-xl font-black text-gray-900">Indexed Strategy</h3>
                        <div className="indexed-gradient-text indexed-stat-glow mb-4 bg-clip-text font-space-grotesk text-5xl font-black text-transparent md:text-6xl">
                            <CountUp end={344064} prefix="$" />
                        </div>
                        <p className="mb-6 text-sm text-gray-500">Zero losses, steady growth</p>
                        <div className="space-y-2">
                            {INDEXED_EVENTS.map((e) => (
                                <div key={e.year} className="flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm shadow-sm">
                                    <span className="font-bold text-gray-500">{e.year}:</span>
                                    <span className="font-bold text-emerald-500">{e.result} ({e.label})</span>
                                    <span className="ml-auto">🛡️</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Difference Callout */}
                <div className="scroll-reveal mt-16 text-center">
                    <div className="indexed-gradient-text indexed-stat-glow mx-auto inline-block bg-clip-text font-space-grotesk text-4xl font-black text-transparent md:text-6xl">
                        <CountUp end={176064} prefix="$" /> difference
                    </div>
                    <p className="mt-3 text-xl text-[#4A5565]">
                        <strong>105% better outcome</strong> — all from avoiding losses
                    </p>
                </div>
            </div>
        </section>
    )
}
