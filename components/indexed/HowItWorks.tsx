'use client'

const STEPS = [
    {
        step: '01',
        icon: '💵',
        title: 'You Invest',
        description: 'You contribute to your indexed account — lump sum or monthly contributions.',
    },
    {
        step: '02',
        icon: '📊',
        title: 'Linked to Index',
        description: 'Your account is linked to a market index (S&P 500, Nasdaq, etc.) — without direct market exposure.',
    },
    {
        step: '03',
        icon: '📈',
        title: 'Market Gains',
        description: 'When the market goes up, you get credited a return (up to cap or uncapped strategies available).',
    },
    {
        step: '04',
        icon: '🛡️',
        title: 'Market Drops',
        description: 'When the market drops, you get 0% — no loss to your principal. The floor protects you.',
    },
    {
        step: '05',
        icon: '🔒',
        title: 'Annual Reset',
        description: 'Each year, your gains lock in as a new floor. You never give back growth — it compounds forever.',
    },
]

export default function HowItWorks() {
    return (
        <section className="indexed-mesh-bg relative bg-gradient-to-b from-[#F9FAFB] to-white py-24 md:py-40">
            <div className="mx-auto max-w-4xl px-6">
                {/* Header */}
                <div className="mb-16 text-center">
                    <span className="mb-4 inline-block font-space-grotesk text-sm font-bold tracking-[0.2em] text-emerald-600">
                        / THE MECHANISM
                    </span>
                    <h2 className="scroll-reveal relative mx-auto mb-6 inline-block font-space-grotesk text-4xl font-black tracking-tight text-[#1A4D3E] md:text-6xl lg:text-8xl">
                        How Indexing Works
                        <svg className="indexed-slash-underline absolute -bottom-2 left-0 w-full" viewBox="0 0 300 10" preserveAspectRatio="none" height="10">
                            <path d="M0 8 L300 2" stroke="url(#slashGrad8)" strokeWidth="4" fill="none" strokeLinecap="round" />
                            <defs>
                                <linearGradient id="slashGrad8" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#1A4D3E" />
                                    <stop offset="50%" stopColor="#10B981" />
                                    <stop offset="100%" stopColor="#34D399" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </h2>
                    <p className="scroll-reveal mx-auto mt-8 max-w-xl text-lg text-[#4A5565]">
                        The wholesale strategy explained simply
                    </p>
                </div>

                {/* Timeline */}
                <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-8 top-0 hidden h-full w-px bg-gradient-to-b from-emerald-300 via-emerald-500 to-emerald-300 md:left-12 md:block" />

                    <div className="space-y-8">
                        {STEPS.map((step, i) => (
                            <div
                                key={step.step}
                                className="scroll-reveal flex gap-6 md:gap-8"
                                style={{ transitionDelay: `${i * 100}ms` }}
                            >
                                {/* Step circle */}
                                <div className="relative flex-shrink-0">
                                    <div className="indexed-icon-float flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-[#1A4D3E] text-3xl shadow-[0_8px_30px_rgba(16,185,129,0.3)] md:h-24 md:w-24">
                                        {step.icon}
                                    </div>
                                    <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white font-space-grotesk text-[10px] font-black text-[#1A4D3E] shadow">
                                        {step.step}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="indexed-card-3d flex-1 rounded-2xl bg-white p-6">
                                    <h3 className="mb-2 font-space-grotesk text-xl font-bold text-[#1A4D3E]">{step.title}</h3>
                                    <p className="text-[#4A5565]">{step.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
