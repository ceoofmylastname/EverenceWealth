'use client'

const VOLATILITY_MATH = [
    { loss: '50%', recovery: '100%', barHeight: 'h-32' },
    { loss: '30%', recovery: '43%', barHeight: 'h-24' },
    { loss: '20%', recovery: '25%', barHeight: 'h-16' },
]

export default function ZeroHero() {
    return (
        <section className="relative overflow-hidden bg-[#1A4D3E] py-24 md:py-40">
            {/* Background mesh */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <div className="mx-auto max-w-6xl px-6">
                {/* Header */}
                <div className="mb-16 text-center">
                    <span className="mb-4 inline-block font-space-grotesk text-sm font-bold tracking-[0.2em] text-emerald-300">
                        / ZERO IS YOUR HERO
                    </span>
                    <h2 className="scroll-reveal relative mx-auto mb-4 inline-block font-space-grotesk text-4xl font-black tracking-tight text-white md:text-6xl lg:text-8xl">
                        Zero Is Your Hero
                        <svg className="indexed-slash-underline absolute -bottom-2 left-0 w-full" viewBox="0 0 300 10" preserveAspectRatio="none" height="10">
                            <path d="M0 8 L300 2" stroke="url(#slashGradZH)" strokeWidth="4" fill="none" strokeLinecap="round" />
                            <defs>
                                <linearGradient id="slashGradZH" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#1A4D3E" />
                                    <stop offset="50%" stopColor="#10B981" />
                                    <stop offset="100%" stopColor="#34D399" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </h2>
                    <p className="scroll-reveal mx-auto mt-8 max-w-2xl text-lg text-white/60">
                        Warren Buffett&apos;s Rule #1: <strong className="text-white">Never lose money.</strong> In traditional market investing, losses destroy compounding.
                    </p>
                </div>

                {/* Volatility Recovery Math */}
                <div className="scroll-reveal mb-16">
                    <h3 className="mb-8 text-center font-space-grotesk text-xl font-bold text-white/70">Volatility Recovery Math</h3>
                    <div className="mx-auto grid max-w-3xl gap-6 md:grid-cols-3">
                        {VOLATILITY_MATH.map((item) => (
                            <div key={item.loss} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-center backdrop-blur-sm">
                                <div className="mx-auto mb-4 flex items-end justify-center gap-4">
                                    <div className="flex flex-col items-center">
                                        <span className="mb-2 font-space-grotesk text-lg font-black text-red-400">-{item.loss}</span>
                                        <div className={`indexed-bar-grow w-12 rounded-t-lg bg-gradient-to-t from-red-500 to-red-400 ${item.barHeight}`} />
                                        <span className="mt-2 text-[9px] font-bold uppercase text-white/30">Loss</span>
                                    </div>
                                    <div className="mb-6 text-white/30">&rarr;</div>
                                    <div className="flex flex-col items-center">
                                        <span className="mb-2 font-space-grotesk text-lg font-black text-amber-400">+{item.recovery}</span>
                                        <div className={`indexed-bar-grow w-12 rounded-t-lg bg-gradient-to-t from-amber-500 to-amber-400 ${item.barHeight}`} style={{ animationDelay: '0.3s' }} />
                                        <span className="mt-2 text-[9px] font-bold uppercase text-white/30">To Recover</span>
                                    </div>
                                </div>
                                <p className="text-xs text-white/40">
                                    Lose {item.loss} &rarr; Requires {item.recovery} gain to break even
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Indexed Strategy Advantage */}
                <div className="scroll-reveal rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-8 shadow-[0_8px_30px_rgba(16,185,129,0.15)] backdrop-blur-sm md:p-12">
                    <h3 className="mb-8 text-center font-space-grotesk text-2xl font-black text-emerald-300 md:text-3xl">Indexed Strategy Advantage</h3>
                    <div className="grid gap-6 md:grid-cols-3">
                        {[
                            { icon: '🛡️', title: 'Floor Protection', desc: '0% is the worst you can do' },
                            { icon: '📈', title: 'Cap Participation', desc: 'Typically 10-14% annual gains' },
                            { icon: '🔒', title: 'Annual Reset', desc: 'Lock in gains, protect against future losses' },
                        ].map((item) => (
                            <div key={item.title} className="rounded-2xl bg-white/[0.06] p-6 text-center">
                                <span className="indexed-icon-float mb-3 inline-block text-4xl">{item.icon}</span>
                                <h4 className="mb-2 font-space-grotesk text-lg font-black text-white">{item.title}</h4>
                                <p className="text-sm text-white/50">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom callout */}
                <div className="scroll-reveal mx-auto mt-12 max-w-3xl text-center">
                    <div className="rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-[#1A4D3E]/20 p-8 backdrop-blur-sm">
                        <p className="text-lg text-white/70">
                            <strong className="text-emerald-300">Zero is Your Hero</strong> means you never go backwards. You compound from strength, not from recovery.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
