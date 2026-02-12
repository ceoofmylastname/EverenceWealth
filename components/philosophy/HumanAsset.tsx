'use client'

const LIVING_BENEFITS = [
    { icon: '🏥', title: 'Critical illness coverage' },
    { icon: '🏡', title: 'Long-term care protection' },
    { icon: '💼', title: 'Disability income replacement' },
    { icon: '🛡️', title: 'Asset protection strategies' },
]

export default function HumanAsset() {
    return (
        <section className="relative bg-white py-24 md:py-40">
            <div className="indexed-mesh-bg pointer-events-none absolute inset-0" />
            <div className="relative mx-auto max-w-6xl px-6">
                {/* Header */}
                <div className="mb-20 text-center">
                    <span className="mb-4 inline-block font-space-grotesk text-xs font-bold tracking-[0.25em] text-emerald-600">
                        / THE HUMAN ASSET
                    </span>
                    <h2 className="scroll-reveal relative mx-auto mb-6 inline-block font-space-grotesk text-4xl font-black tracking-tight text-[#1A4D3E] md:text-6xl lg:text-8xl">
                        You Are The Best Investment
                        <svg className="indexed-slash-underline absolute -bottom-2 left-0 w-full md:-bottom-4" viewBox="0 0 300 10" preserveAspectRatio="none" height="10">
                            <path d="M0 8 L300 2" stroke="url(#slashGradHuman)" strokeWidth="4" fill="none" strokeLinecap="round" />
                            <defs>
                                <linearGradient id="slashGradHuman" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#1A4D3E" />
                                    <stop offset="50%" stopColor="#10B981" />
                                    <stop offset="100%" stopColor="#34D399" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </h2>
                    <p className="scroll-reveal mx-auto mt-10 max-w-2xl text-lg text-[#4A5565]">
                        Your greatest asset is not your 401(k), your real estate, or your crypto. <strong className="text-[#1A4D3E]">It is you.</strong>
                    </p>
                </div>

                {/* HLV Explanation */}
                <div className="scroll-reveal mx-auto mb-16 max-w-3xl">
                    <div className="indexed-card-3d rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 p-8 md:p-10">
                        <h3 className="mb-4 font-space-grotesk text-2xl font-black text-[#1A4D3E]">Your Human Life Value</h3>
                        <p className="mb-6 text-[#4A5565]">
                            Your <strong className="text-[#1A4D3E]">Human Life Value</strong>&mdash;your skill, your creativity, and your ability to earn&mdash;is the engine of your wealth. Investing in markets before investing in your own capacity sends the message that you trust institutions more than you trust yourself.
                        </p>
                        <p className="text-sm font-bold text-emerald-600">
                            If your health fails, your financial dignity remains intact.
                        </p>
                    </div>
                </div>

                {/* Living Benefits Grid */}
                <div className="mb-16">
                    <h3 className="mb-8 text-center font-space-grotesk text-2xl font-black text-[#1A4D3E]">Protecting Human Life Value</h3>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {LIVING_BENEFITS.map((benefit, i) => (
                            <div
                                key={benefit.title}
                                className="indexed-card-3d scroll-reveal group rounded-2xl bg-white p-6 text-center shadow-indexed-sm transition-all hover:-translate-y-1 hover:shadow-indexed"
                                style={{ transitionDelay: `${i * 100}ms` }}
                            >
                                <div className="indexed-icon-float mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-3xl">
                                    {benefit.icon}
                                </div>
                                <p className="font-medium text-[#4A5565]">{benefit.title}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Model comparison */}
                <div className="scroll-reveal grid gap-8 md:grid-cols-2">
                    {/* Traditional */}
                    <div className="indexed-card-3d rounded-3xl border-2 border-red-200 bg-red-50 p-8">
                        <h3 className="mb-4 font-space-grotesk text-xl font-bold text-red-600">Traditional Model</h3>
                        <p className="text-[#4A5565]">
                            Insure your car, your phone, your house&mdash;but leave your earning capacity unprotected.
                        </p>
                    </div>

                    {/* Everence */}
                    <div className="indexed-card-3d rounded-3xl border-2 border-emerald-200 bg-emerald-50 p-8">
                        <h3 className="mb-4 font-space-grotesk text-xl font-bold text-emerald-700">Everence Model</h3>
                        <p className="text-[#4A5565]">
                            Insure what matters most. Your ability to earn, create, and provide.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}
