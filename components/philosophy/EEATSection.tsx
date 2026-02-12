'use client'

const COMMITMENTS = [
    { icon: '🎯', text: 'We work exclusively in your best interest' },
    { icon: '🔓', text: 'We are not captive to banks or Wall Street firms' },
    { icon: '📊', text: 'We have no product quotas or institutional conflicts' },
    { icon: '🔍', text: 'We provide transparent, math-based analysis' },
]

const EXPERTISE = [
    'Tax-efficient retirement transitions',
    'Asset protection strategies',
    'Legacy planning structures',
    'Cash flow optimization',
]

export default function EEATSection() {
    return (
        <section className="indexed-mesh-bg relative bg-gradient-to-b from-white to-emerald-50/50 py-24 md:py-40">
            <div className="mx-auto max-w-6xl px-6">
                {/* Header */}
                <div className="mb-20 text-center">
                    <span className="mb-4 inline-block font-space-grotesk text-xs font-bold tracking-[0.25em] text-emerald-600">
                        / OUR COMMITMENT
                    </span>
                    <h2 className="scroll-reveal relative mx-auto mb-6 inline-block font-space-grotesk text-4xl font-black tracking-tight text-[#1A4D3E] md:text-6xl lg:text-7xl">
                        Our Fiduciary Commitment
                        <svg className="indexed-slash-underline absolute -bottom-2 left-0 w-full md:-bottom-4" viewBox="0 0 300 10" preserveAspectRatio="none" height="10">
                            <path d="M0 8 L300 2" stroke="url(#slashGradEEAT)" strokeWidth="4" fill="none" strokeLinecap="round" />
                            <defs>
                                <linearGradient id="slashGradEEAT" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#1A4D3E" />
                                    <stop offset="50%" stopColor="#10B981" />
                                    <stop offset="100%" stopColor="#34D399" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </h2>
                    <p className="scroll-reveal mx-auto mt-10 max-w-xl text-lg text-[#4A5565]">
                        Everence Wealth operates as an <strong className="text-[#1A4D3E]">Independent Fiduciary</strong> partnered with 75+ carriers.
                    </p>
                </div>

                {/* Commitments Grid */}
                <div className="mb-16 grid gap-6 md:grid-cols-2">
                    {COMMITMENTS.map((item, i) => (
                        <div
                            key={item.text}
                            className="indexed-card-3d scroll-reveal flex items-center gap-5 rounded-2xl bg-white p-6 shadow-indexed-sm transition-all hover:-translate-y-1 hover:shadow-indexed"
                            style={{ transitionDelay: `${i * 100}ms` }}
                        >
                            <span className="indexed-icon-float flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">
                                {item.icon}
                            </span>
                            <p className="font-medium text-[#4A5565]">{item.text}</p>
                        </div>
                    ))}
                </div>

                {/* Expertise */}
                <div className="scroll-reveal mx-auto max-w-3xl">
                    <div className="indexed-card-3d rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 p-8 md:p-10">
                        <h3 className="mb-6 text-center font-space-grotesk text-xl font-black text-[#1A4D3E]">
                            We have guided hundreds of families through:
                        </h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {EXPERTISE.map((item) => (
                                <div key={item} className="flex items-center gap-3 rounded-xl bg-white/80 px-4 py-3 text-sm shadow-sm">
                                    <span className="font-bold text-emerald-500">&#10003;</span>
                                    <span className="font-medium text-[#4A5565]">{item}</span>
                                </div>
                            ))}
                        </div>
                        <p className="mt-6 text-center text-sm text-[#4A5565]">
                            Our expertise is built on <strong className="text-[#1A4D3E]">real-world financial architecture</strong>&mdash;not theory.
                        </p>
                    </div>
                </div>

                {/* Trust badges */}
                <div className="scroll-reveal mt-12 flex flex-wrap items-center justify-center gap-6">
                    {['Fiduciary Standard', '75+ Carrier Partners', 'Independent Broker', 'Established 1998'].map((badge) => (
                        <span key={badge} className="rounded-full border border-emerald-200 bg-white px-5 py-2 text-xs font-bold uppercase tracking-wider text-[#1A4D3E]">
                            {badge}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    )
}
