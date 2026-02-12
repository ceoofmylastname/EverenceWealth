'use client'

const LEAKS = [
    { icon: '🏗️', title: 'Poor Structure', description: 'Assets in the wrong bucket', color: 'text-red-500' },
    { icon: '💸', title: 'Hidden Fees', description: 'Compounding costs eating returns', color: 'text-amber-500' },
    { icon: '📉', title: 'Volatility Exposure', description: 'Unprotected downside risk', color: 'text-[#1A4D3E]' },
    { icon: '🎯', title: 'Lack of Strategy', description: 'Reactive vs. proactive planning', color: 'text-teal-500' },
]

const QUESTIONS = [
    '"What\'s my return after fees?"',
    '"What\'s my return after taxes?"',
    '"What\'s my return after volatility?"',
]

export default function TaxPhilosophy() {
    return (
        <section className="relative bg-white py-24 md:py-40">
            <div className="indexed-mesh-bg pointer-events-none absolute inset-0" />
            <div className="relative mx-auto max-w-6xl px-6">
                {/* Header */}
                <div className="mb-16 text-center">
                    <span className="mb-4 inline-block font-space-grotesk text-sm font-bold tracking-[0.2em] text-emerald-600">
                        / OUR PHILOSOPHY
                    </span>
                    <h2 className="scroll-reveal relative mx-auto mb-6 inline-block font-space-grotesk text-4xl font-black tracking-tight text-[#1A4D3E] md:text-6xl lg:text-7xl">
                        Structure Determines Outcome
                    </h2>
                    <p className="scroll-reveal mx-auto mt-8 max-w-xl text-lg text-[#4A5565]">
                        Most financial advisors focus on investment selection. We focus on <strong className="text-[#1A4D3E]">structural design</strong>.
                    </p>
                </div>

                <div className="grid gap-12 lg:grid-cols-2">
                    {/* Four Leaks */}
                    <div className="scroll-reveal">
                        <h3 className="mb-8 font-space-grotesk text-2xl font-black text-[#1A4D3E]">The Four Leaks of Wealth</h3>
                        <div className="space-y-4">
                            {LEAKS.map((leak, i) => (
                                <div key={leak.title} className="indexed-card-3d flex items-center gap-4 rounded-2xl bg-gradient-to-r from-gray-50 to-white p-5">
                                    <div className="indexed-icon-float text-3xl">{leak.icon}</div>
                                    <div>
                                        <h4 className={`font-space-grotesk text-lg font-bold ${leak.color}`}>{leak.title}</h4>
                                        <p className="text-sm text-[#4A5565]">{leak.description}</p>
                                    </div>
                                    <span className="ml-auto font-space-grotesk text-4xl font-black text-black/[0.04]">0{i + 1}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* The Wealthy Focus */}
                    <div className="scroll-reveal">
                        <h3 className="mb-8 font-space-grotesk text-2xl font-black text-[#1A4D3E]">The Wealthy Focus on &ldquo;Net After Tax&rdquo;</h3>

                        <div className="mb-8 rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-8 shadow-indexed">
                            <p className="mb-6 text-[#4A5565]">
                                Wealthy families don&apos;t just ask: <em>&ldquo;What&apos;s my return?&rdquo;</em>
                            </p>
                            <p className="mb-4 text-sm font-bold text-[#1A4D3E]">They ask:</p>
                            <div className="space-y-3">
                                {QUESTIONS.map((q) => (
                                    <div key={q} className="rounded-xl bg-white/80 px-4 py-3 text-sm font-medium text-emerald-700 shadow-indexed-sm" style={{ backdropFilter: 'blur(4px)' }}>
                                        {q}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl bg-gradient-to-r from-[#0a1f1a] to-[#1A4D3E] p-6 text-center">
                            <p className="text-sm text-white/50">Because</p>
                            <p className="mt-1 font-space-grotesk text-lg font-bold text-white">
                                Gross returns don&apos;t pay for retirement.
                            </p>
                            <p className="indexed-gradient-text mt-1 bg-clip-text font-space-grotesk text-2xl font-black text-transparent">
                                Net returns do.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
