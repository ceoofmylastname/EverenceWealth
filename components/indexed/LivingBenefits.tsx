'use client'

const BENEFITS = [
    {
        icon: '🏛️',
        title: 'Creditor Protected',
        description: 'Unlike IRAs (which lost protection in 2014), indexed plans are shielded from lawsuits, creditors, and bankruptcies.',
        stat: '100% Protected',
        gradient: 'from-teal-100 to-teal-50',
    },
    {
        icon: '🏥',
        title: 'Access While Living',
        description: 'Terminal, critical, or chronic illness riders let you access death benefit while alive — no waiting.',
        stat: 'Peace of Mind',
        gradient: 'from-emerald-100 to-emerald-50',
    },
    {
        icon: '🏡',
        title: 'Biological Hedge',
        description: 'Pay for nursing home or in-home care without draining your nest egg. Your policy becomes your LTC fund.',
        stat: '$5,000+/mo Available',
        gradient: 'from-emerald-100 to-emerald-50',
    },
    {
        icon: '💰',
        title: 'Lifetime Income',
        description: 'Convert your account to guaranteed income you can never outlive. Pension-like security.',
        stat: 'Income for Life',
        gradient: 'from-amber-100 to-amber-50',
    },
]

const TRADITIONAL = [
    { icon: '❌', text: 'No asset protection' },
    { icon: '❌', text: 'No living benefits' },
    { icon: '❌', text: 'No LTC access' },
    { icon: '❌', text: 'No guarantees' },
    { icon: '❌', text: 'Tax time bomb' },
]

const INDEXED = [
    { icon: '✓', text: 'Fully protected' },
    { icon: '✓', text: 'Living benefits included' },
    { icon: '✓', text: 'LTC rider available' },
    { icon: '✓', text: 'Guaranteed income option' },
    { icon: '✓', text: 'Tax-free' },
]

export default function LivingBenefits() {
    return (
        <section className="relative bg-white py-24 md:py-40">
            <div className="mx-auto max-w-6xl px-6">
                {/* Header */}
                <div className="mb-16 text-center">
                    <span className="mb-4 inline-block font-space-grotesk text-sm font-bold tracking-[0.2em] text-emerald-600">
                        / BEYOND GROWTH
                    </span>
                    <h2 className="scroll-reveal relative mx-auto mb-6 inline-block font-space-grotesk text-4xl font-black tracking-tight text-[#1A4D3E] md:text-6xl lg:text-8xl">
                        Living Benefits
                        <svg className="indexed-slash-underline absolute -bottom-2 left-0 w-full" viewBox="0 0 300 10" preserveAspectRatio="none" height="10">
                            <path d="M0 8 L300 2" stroke="url(#slashGrad6)" strokeWidth="4" fill="none" strokeLinecap="round" />
                            <defs>
                                <linearGradient id="slashGrad6" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#1A4D3E" />
                                    <stop offset="50%" stopColor="#10B981" />
                                    <stop offset="100%" stopColor="#34D399" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </h2>
                    <p className="scroll-reveal mx-auto mt-8 max-w-xl text-lg text-[#4A5565]">
                        Wealth protection traditional accounts can&apos;t match
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="mb-16 grid gap-8 md:grid-cols-2">
                    {BENEFITS.map((benefit, i) => (
                        <div
                            key={benefit.title}
                            className={`indexed-card-3d scroll-reveal group rounded-3xl bg-gradient-to-br ${benefit.gradient} p-8 transition-all hover:-translate-y-2 hover:shadow-xl`}
                            style={{ transitionDelay: `${i * 100}ms` }}
                        >
                            <div className="mb-4 text-4xl transition-transform duration-300 group-hover:scale-110">
                                {benefit.icon}
                            </div>
                            <h3 className="mb-3 font-space-grotesk text-xl font-bold text-[#1A4D3E]">{benefit.title}</h3>
                            <p className="mb-6 text-[#4A5565]">{benefit.description}</p>
                            <div className="inline-block rounded-full bg-white/80 px-4 py-2 font-space-grotesk text-sm font-bold text-[#1A4D3E]">
                                {benefit.stat}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Side-by-side comparison */}
                <div className="scroll-reveal grid gap-8 md:grid-cols-2">
                    {/* Traditional */}
                    <div className="indexed-card-3d rounded-3xl border-2 border-red-200 bg-red-50 p-8">
                        <h3 className="mb-6 font-space-grotesk text-xl font-bold text-red-600">Traditional 401(k)</h3>
                        <div className="mb-6 space-y-3">
                            {TRADITIONAL.map((item) => (
                                <div key={item.text} className="flex items-center gap-3 text-sm">
                                    <span className="text-red-500">{item.icon}</span>
                                    <span className="text-gray-700">{item.text}</span>
                                </div>
                            ))}
                        </div>
                        <div className="rounded-xl bg-red-100 p-4 text-center text-sm italic text-red-600">
                            &ldquo;Just a savings account with hope&rdquo;
                        </div>
                    </div>

                    {/* Indexed */}
                    <div className="indexed-card-3d rounded-3xl border-2 border-emerald-200 bg-emerald-50 p-8">
                        <h3 className="mb-6 font-space-grotesk text-xl font-bold text-emerald-700">Indexed Strategy</h3>
                        <div className="mb-6 space-y-3">
                            {INDEXED.map((item) => (
                                <div key={item.text} className="flex items-center gap-3 text-sm">
                                    <span className="font-bold text-emerald-500">{item.icon}</span>
                                    <span className="text-gray-700">{item.text}</span>
                                </div>
                            ))}
                        </div>
                        <div className="rounded-xl bg-emerald-100 p-4 text-center text-sm font-bold italic text-emerald-700">
                            &ldquo;Comprehensive wealth protection&rdquo;
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
