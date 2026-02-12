'use client'

const STEPS = [
    { number: '01', title: 'Assess Structure', description: 'Where is your money today? Taxable, deferred, or exempt?' },
    { number: '02', title: 'Calculate Exposure', description: 'Project future tax rates. Estimate RMD amounts. Calculate total burden.' },
    { number: '03', title: 'Design Strategy', description: 'Roth conversion schedule. SER allocation. Tax-loss harvesting.' },
    { number: '04', title: 'Implement & Monitor', description: 'Open tax-exempt vehicles. Begin conversions. Adjust as laws change.' },
]

const DISCOVERS = [
    'Your current tax bucket allocation',
    'Projected tax burden at retirement',
    'RMD impact on your income',
    'Repositioning opportunities',
    'Tax-efficient withdrawal strategies',
]

export default function TaxesFinalCTA() {
    return (
        <section id="assessment" className="relative overflow-hidden bg-gradient-to-br from-[#020806] via-[#0a1f1a] to-[#1A4D3E] py-24 md:py-40">
            {/* Floating orbs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="indexed-orb-1 absolute -left-20 -top-20 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(26,77,62,0.15)_0%,transparent_60%)] blur-[60px]" />
                <div className="indexed-orb-2 absolute -bottom-20 -right-20 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.12)_0%,transparent_60%)] blur-[60px]" />
            </div>
            <div className="pointer-events-none absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

            <div className="relative z-10 mx-auto max-w-5xl px-6">
                {/* Steps */}
                <div className="mb-20">
                    <div className="mb-12 text-center">
                        <span className="mb-4 inline-block font-space-grotesk text-sm font-bold tracking-[0.2em] text-emerald-400">
                            / YOUR PATH
                        </span>
                        <h2 className="scroll-reveal font-space-grotesk text-4xl font-black tracking-tight text-white md:text-6xl">
                            Build Your Tax-Efficient Strategy
                        </h2>
                    </div>

                    <div className="grid gap-6 md:grid-cols-4">
                        {STEPS.map((step, i) => (
                            <div
                                key={step.number}
                                className="scroll-reveal rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.12]"
                                style={{ backdropFilter: 'blur(12px)', transitionDelay: `${i * 100}ms` }}
                            >
                                <span className="font-space-grotesk text-3xl font-black text-white/[0.06]">{step.number}</span>
                                <h3 className="mt-2 font-space-grotesk text-lg font-bold text-white">{step.title}</h3>
                                <p className="mt-2 text-xs text-white/40">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA section */}
                <div className="text-center">
                    {/* Shield */}
                    <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-5xl shadow-[0_0_40px_rgba(255,255,255,0.1)] backdrop-blur-sm" style={{ animation: 'killersFloat 6s ease-in-out infinite' }}>
                        🏛️
                    </div>

                    <h2 className="scroll-reveal mb-4 font-space-grotesk text-4xl font-black text-white md:text-6xl">
                        Stress-Test Your
                        <br />
                        <span className="indexed-gradient-text bg-clip-text text-transparent">Tax Strategy</span>
                    </h2>

                    <p className="scroll-reveal mx-auto mb-10 max-w-2xl text-lg text-white/40">
                        Our Financial Needs Assessment stress-tests your current structure against tax exposure, hidden fees, volatility risk, and retirement income gaps.
                    </p>

                    {/* What you'll discover */}
                    <div className="scroll-reveal mx-auto mb-12 max-w-xl">
                        <p className="mb-4 text-xs font-bold uppercase tracking-wider text-white/30">What You&apos;ll Discover</p>
                        <div className="flex flex-wrap justify-center gap-3">
                            {DISCOVERS.map((item) => (
                                <div key={item} className="flex items-center gap-2 rounded-full bg-white/[0.06] px-4 py-2 text-xs font-bold text-white/60" style={{ backdropFilter: 'blur(8px)' }}>
                                    <span className="text-emerald-400">✓</span>
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="scroll-reveal mb-6">
                        <a
                            href="#assessment"
                            className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-white px-10 py-6 font-space-grotesk text-lg font-bold text-[#1A4D3E] shadow-[0_20px_60px_rgba(255,255,255,0.15)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(255,255,255,0.2)]"
                        >
                            Schedule Your Financial Needs Assessment
                            <span className="transition-transform group-hover:translate-x-1">→</span>
                        </a>
                    </div>

                    {/* Guarantee */}
                    <p className="scroll-reveal mb-8 text-sm text-white/30">
                        Complimentary. No pressure. No sales pitch.
                        <br />
                        Just clarity on your tax options.
                    </p>

                    {/* Trust badges */}
                    <div className="scroll-reveal flex flex-wrap items-center justify-center gap-6">
                        {['Fiduciary Standard', '75+ Carrier Partners', 'Independent Broker'].map((badge) => (
                            <span key={badge} className="rounded-full border border-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white/25">
                                {badge}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Disclaimer */}
                <div className="mt-20 border-t border-white/[0.06] pt-8">
                    <p className="text-center text-[10px] leading-relaxed text-white/15">
                        Tax laws are subject to change. The information on this page is educational and should not be considered tax advice. Consult with a qualified tax professional and fiduciary financial advisor before making tax-related financial decisions. Investment performance depends on market conditions, individual circumstances, and product selection. Past performance does not guarantee future results.
                    </p>
                </div>
            </div>
        </section>
    )
}
