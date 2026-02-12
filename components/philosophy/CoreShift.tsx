'use client'

export default function CoreShift() {
    return (
        <section className="relative bg-white py-24 md:py-40">
            <div className="indexed-mesh-bg pointer-events-none absolute inset-0" />
            <div className="relative mx-auto max-w-6xl px-6">
                {/* Header */}
                <div className="mb-20 text-center">
                    <span className="mb-4 inline-block font-space-grotesk text-xs font-bold tracking-[0.25em] text-emerald-600">
                        / THE CORE SHIFT
                    </span>
                    <h2 className="scroll-reveal relative mx-auto mb-6 inline-block font-space-grotesk text-4xl font-black tracking-tight text-[#1A4D3E] md:text-6xl lg:text-8xl">
                        Scarcity vs. Abundance
                        <svg className="indexed-slash-underline absolute -bottom-2 left-0 w-full md:-bottom-4" viewBox="0 0 300 10" preserveAspectRatio="none" height="10">
                            <path d="M0 8 L300 2" stroke="url(#slashGradCS)" strokeWidth="4" fill="none" strokeLinecap="round" />
                            <defs>
                                <linearGradient id="slashGradCS" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#1A4D3E" />
                                    <stop offset="50%" stopColor="#10B981" />
                                    <stop offset="100%" stopColor="#34D399" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </h2>
                    <p className="scroll-reveal mx-auto mt-10 max-w-2xl text-lg text-[#4A5565]">
                        Most financial planning is built on a <strong className="text-[#1A4D3E]">Scarcity Mindset</strong>&mdash;the belief that wealth is a fixed pie. If someone else has more, there is less for you.
                    </p>
                </div>

                {/* Side by side comparison */}
                <div className="scroll-reveal grid gap-8 md:grid-cols-2">
                    {/* Scarcity */}
                    <div className="indexed-card-3d rounded-3xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-white p-8 md:p-10">
                        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-3xl">
                            🔒
                        </div>
                        <h3 className="mb-4 font-space-grotesk text-2xl font-black text-red-600">Scarcity Mindset</h3>
                        <div className="mb-6 space-y-3">
                            <div className="flex items-start gap-3 text-sm">
                                <span className="mt-0.5 text-red-500">&#10005;</span>
                                <span className="text-gray-700">Wealth is a fixed pie</span>
                            </div>
                            <div className="flex items-start gap-3 text-sm">
                                <span className="mt-0.5 text-red-500">&#10005;</span>
                                <span className="text-gray-700">Fear, hoarding, &ldquo;play not to lose&rdquo;</span>
                            </div>
                            <div className="flex items-start gap-3 text-sm">
                                <span className="mt-0.5 text-red-500">&#10005;</span>
                                <span className="text-gray-700">Compete for someone else&apos;s slice</span>
                            </div>
                            <div className="flex items-start gap-3 text-sm">
                                <span className="mt-0.5 text-red-500">&#10005;</span>
                                <span className="text-gray-700">Consumer identity</span>
                            </div>
                        </div>
                        <div className="rounded-xl bg-red-100 p-4 text-center text-sm italic text-red-600">
                            &ldquo;How do I protect what I have?&rdquo;
                        </div>
                    </div>

                    {/* Abundance */}
                    <div className="indexed-card-3d rounded-3xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-8 md:p-10">
                        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-3xl">
                            🌱
                        </div>
                        <h3 className="mb-4 font-space-grotesk text-2xl font-black text-emerald-700">Abundance Mindset</h3>
                        <div className="mb-6 space-y-3">
                            <div className="flex items-start gap-3 text-sm">
                                <span className="mt-0.5 font-bold text-emerald-500">&#10003;</span>
                                <span className="text-gray-700">Wealth expands through value creation</span>
                            </div>
                            <div className="flex items-start gap-3 text-sm">
                                <span className="mt-0.5 font-bold text-emerald-500">&#10003;</span>
                                <span className="text-gray-700">Innovation, productivity, growth</span>
                            </div>
                            <div className="flex items-start gap-3 text-sm">
                                <span className="mt-0.5 font-bold text-emerald-500">&#10003;</span>
                                <span className="text-gray-700">Bake a bigger pie</span>
                            </div>
                            <div className="flex items-start gap-3 text-sm">
                                <span className="mt-0.5 font-bold text-emerald-500">&#10003;</span>
                                <span className="text-gray-700">Producer identity</span>
                            </div>
                        </div>
                        <div className="rounded-xl bg-emerald-100 p-4 text-center text-sm font-bold italic text-emerald-700">
                            &ldquo;How do I create what I want?&rdquo;
                        </div>
                    </div>
                </div>

                {/* Quote */}
                <div className="scroll-reveal mx-auto mt-16 max-w-3xl text-center">
                    <blockquote className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-8" style={{ backdropFilter: 'blur(8px)' }}>
                        <p className="font-space-grotesk text-xl font-bold italic text-[#1A4D3E] md:text-2xl">
                            &ldquo;Scarcity cannot exist without abundance. But abundance can exist without scarcity.&rdquo;
                        </p>
                    </blockquote>
                </div>

                {/* Fundamental Question */}
                <div className="scroll-reveal mx-auto mt-12 max-w-2xl text-center">
                    <p className="mb-3 text-sm font-bold uppercase tracking-wider text-emerald-600">The Fundamental Question</p>
                    <p className="text-xl text-[#4A5565] md:text-2xl">
                        Are you managing your wealth to <strong className="text-[#1A4D3E]">protect what you have</strong>, or to <strong className="text-emerald-600">create what you want</strong>?
                    </p>
                </div>
            </div>
        </section>
    )
}
