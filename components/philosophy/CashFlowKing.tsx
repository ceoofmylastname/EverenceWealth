'use client'

export default function CashFlowKing() {
    return (
        <section className="relative overflow-hidden bg-[#1A4D3E] py-24 md:py-40">
            {/* Background mesh */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="mx-auto max-w-6xl px-6">
                {/* Header */}
                <div className="mb-16 text-center">
                    <span className="mb-4 inline-block font-space-grotesk text-sm font-bold tracking-[0.2em] text-emerald-300">
                        / CASH FLOW IS KING
                    </span>
                    <h2 className="scroll-reveal relative mx-auto mb-4 inline-block font-space-grotesk text-4xl font-black tracking-tight text-white md:text-6xl lg:text-8xl">
                        Cash Flow Is King
                        <svg className="indexed-slash-underline absolute -bottom-2 left-0 w-full" viewBox="0 0 300 10" preserveAspectRatio="none" height="10">
                            <path d="M0 8 L300 2" stroke="url(#slashGradCF)" strokeWidth="4" fill="none" strokeLinecap="round" />
                            <defs>
                                <linearGradient id="slashGradCF" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#1A4D3E" />
                                    <stop offset="50%" stopColor="#10B981" />
                                    <stop offset="100%" stopColor="#34D399" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </h2>
                    <p className="scroll-reveal mx-auto mt-8 max-w-2xl text-lg text-white/90">
                        You cannot buy groceries with &ldquo;Net Worth.&rdquo; You cannot eat equity. You cannot spend valuation. True financial strength is measured by <strong className="text-emerald-300">Cash Flow</strong>.
                    </p>
                </div>

                {/* Framework Comparison */}
                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Traditional */}
                    <div className="scroll-reveal rounded-2xl border border-white/10 bg-white/[0.04] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.2)] backdrop-blur-sm transition-all hover:bg-white/[0.06]">
                        <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-white/80">Traditional Thinking</h3>
                        <div className="space-y-4">
                            {[
                                'Build a $2 million portfolio',
                                'Withdraw 4% annually ($80,000)',
                                'Hope it lasts 30 years',
                                'Pay taxes on every withdrawal',
                            ].map((item) => (
                                <div key={item} className="flex items-start gap-3 text-sm">
                                    <span className="mt-0.5 text-red-400">&#10005;</span>
                                    <span className="text-white/90">{item}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 rounded-xl bg-red-500/10 p-4 text-center">
                            <p className="text-sm font-bold text-red-400">Focused on the Balance Sheet</p>
                        </div>
                    </div>

                    {/* Everence */}
                    <div className="scroll-reveal rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 shadow-[0_8px_30px_rgba(16,185,129,0.15)] backdrop-blur-sm transition-all hover:bg-emerald-500/15">
                        <h3 className="mb-6 text-sm font-bold uppercase tracking-wider text-emerald-300">Everence Philosophy</h3>
                        <div className="space-y-4">
                            {[
                                'Design income-producing assets',
                                'Generate $80,000+ tax-efficiently',
                                'Maintain principal protection',
                                'Never outlive your cash flow',
                            ].map((item) => (
                                <div key={item} className="flex items-start gap-3 text-sm">
                                    <span className="mt-0.5 font-bold text-emerald-400">&#10003;</span>
                                    <span className="text-white/80">{item}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 rounded-xl bg-emerald-500/20 p-4 text-center">
                            <p className="text-sm font-bold text-emerald-300">Focused on the Income Statement</p>
                        </div>
                    </div>
                </div>

                {/* Bottom callout */}
                <div className="scroll-reveal mx-auto mt-12 max-w-3xl text-center">
                    <div className="rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-[#1A4D3E]/20 p-8 backdrop-blur-sm">
                        <p className="text-lg text-white/90">
                            Our goal is not just to build a big number for someday, but to generate <strong className="text-emerald-300">cash flow that covers your lifestyle today</strong>.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
