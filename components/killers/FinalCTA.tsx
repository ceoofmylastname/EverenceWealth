'use client'

const BENEFITS = [
    'Discover exactly how much fees are costing you',
    'Learn your true after-tax retirement income',
    'See how volatility protection changes your outcome',
    'Get a personalized wealth protection plan',
]

export default function FinalCTA() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-[#0d2b23] to-[#020806] py-24 md:py-32">
            {/* Radial glow */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.1)_0%,transparent_70%)]" />

            <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
                {/* Eyebrow */}
                <p className="scroll-reveal mb-6 text-xs font-bold uppercase tracking-[0.3em] text-emerald-400">
                    Take Action Today
                </p>

                {/* Headline */}
                <h2 className="scroll-reveal mb-6 font-space-grotesk text-4xl font-black leading-tight text-white md:text-5xl lg:text-6xl">
                    Stop Feeding{' '}
                    <span className="bg-gradient-to-r from-red-500 to-amber-500 bg-clip-text text-transparent">
                        The Killers
                    </span>
                </h2>

                <p className="scroll-reveal mx-auto mb-12 max-w-2xl text-lg text-white/60">
                    Every day you wait, fees compound, volatility lurks, and the tax time bomb
                    ticks closer. A free assessment shows you exactly where you stand.
                </p>

                {/* Benefits */}
                <div className="scroll-reveal mx-auto mb-12 max-w-xl">
                    <div className="space-y-4">
                        {BENEFITS.map((benefit) => (
                            <div key={benefit} className="flex items-center gap-3 text-left">
                                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-sm text-emerald-400">
                                    ✓
                                </span>
                                <span className="text-white/80">{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Button */}
                <div className="scroll-reveal mb-8">
                    <a
                        href="#assessment"
                        className="group inline-flex items-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-[#1A4D3E] px-10 py-5 font-space-grotesk text-lg font-bold text-white shadow-[0_20px_60px_rgba(16,185,129,0.3)] transition-all hover:-translate-y-1 hover:shadow-[0_25px_70px_rgba(16,185,129,0.4)]"
                    >
                        Get Your Free Wealth Assessment
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                    </a>
                </div>

                {/* Trust statement */}
                <p className="scroll-reveal text-sm text-white/30">
                    No obligation &bull; 100% confidential &bull; Takes 15 minutes
                </p>
            </div>
        </section>
    )
}
