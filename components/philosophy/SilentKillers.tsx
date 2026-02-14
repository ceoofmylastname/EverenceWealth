'use client'

import CountUp from '../killers/CountUp'

const KILLERS = [
    {
        number: '01',
        icon: '🏛️',
        title: 'The IRS (Taxes)',
        description: 'Tax-deferred accounts create Required Minimum Distributions starting at age 73. You are forced to withdraw funds and pay taxes at ordinary income rates — often at your highest tax bracket.',
        problem: 'Partners with the Government',
        solution: 'Tax-Exempt: You own the harvest',
        stat: '30-50%',
        statLabel: 'Claimed by IRS',
        gradient: 'from-red-500/20 to-red-600/10',
        border: 'border-red-500/20',
        color: 'text-red-400',
    },
    {
        number: '02',
        icon: '💸',
        title: 'Investments (Fees)',
        description: 'Hidden fees of just 1-2% can erode up to 50% of your capital over a lifetime. On a $500,000 portfolio at 7% return with 1.5% annual fees over 30 years: $600,000+ lost to fees.',
        problem: 'Captive to one institution',
        solution: '75+ carriers, full transparency',
        stat: '$600K+',
        statLabel: 'Lost to Hidden Fees',
        gradient: 'from-amber-500/20 to-amber-600/10',
        border: 'border-amber-500/20',
        color: 'text-amber-400',
    },
    {
        number: '03',
        icon: '🏦',
        title: 'Interest',
        description: 'Overpaying interest destroys wealth; strategic leverage creates it. Credit cards at 22% APR and auto loans on depreciating assets erode your capital, while strategic leverage builds it.',
        problem: 'Destructive debt',
        solution: 'Strategic leverage',
        stat: '22%+',
        statLabel: 'Consumer APR Trap',
        gradient: 'from-teal-500/20 to-teal-600/10',
        border: 'border-teal-500/20',
        color: 'text-teal-400',
    },
    {
        number: '04',
        icon: '🏥',
        title: 'Insurance',
        description: 'Most people insure small risks but ignore catastrophic risks. Critical illness before 65: 1 in 3 adults. Long-term care need: 70% of people over 65. Average annual LTC cost: $108,000+.',
        problem: 'Insure small risks, ignore big ones',
        solution: 'Comprehensive protection',
        stat: '$108K+',
        statLabel: 'Annual LTC Cost',
        gradient: 'from-emerald-500/20 to-emerald-600/10',
        border: 'border-emerald-500/20',
        color: 'text-emerald-400',
    },
]

export default function SilentKillers() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-[#020806] via-[#0a1f1a] to-[#1A4D3E] py-24 md:py-40">
            {/* Dot grid */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

            <div className="relative z-10 mx-auto max-w-6xl px-6">
                {/* Header */}
                <div className="mb-20 text-center">
                    <span className="mb-4 inline-block font-space-grotesk text-xs font-bold tracking-[0.25em] text-emerald-400">
                        / PLUGGING THE LEAKS
                    </span>
                    <h2 className="scroll-reveal relative mx-auto mb-6 inline-block font-space-grotesk text-4xl font-black tracking-tight text-white md:text-6xl lg:text-8xl">
                        Four Silent Killers
                        <svg className="indexed-slash-underline absolute -bottom-2 left-0 w-full md:-bottom-4" viewBox="0 0 300 10" preserveAspectRatio="none" height="10">
                            <path d="M0 8 L300 2" stroke="url(#slashGradSK)" strokeWidth="4" fill="none" strokeLinecap="round" />
                            <defs>
                                <linearGradient id="slashGradSK" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#EF4444" />
                                    <stop offset="50%" stopColor="#1A4D3E" />
                                    <stop offset="100%" stopColor="#F59E0B" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </h2>
                    <p className="scroll-reveal mx-auto mt-10 max-w-xl text-lg text-white/80">
                        It is not what you make; it is what you keep. Most portfolios have four silent leaks that destroy wealth over time.
                    </p>
                </div>

                {/* Killer Cards */}
                <div className="grid gap-8 md:grid-cols-2">
                    {KILLERS.map((killer, i) => (
                        <div
                            key={killer.title}
                            className={`scroll-reveal rounded-3xl border ${killer.border} bg-white/[0.04] p-8 backdrop-blur-sm transition-all hover:bg-white/[0.06]`}
                            style={{ transitionDelay: `${i * 150}ms` }}
                        >
                            <div className="mb-4 flex items-center justify-between">
                                <span className="indexed-icon-float text-4xl">{killer.icon}</span>
                                <span className="font-space-grotesk text-5xl font-black text-white/[0.04]">{killer.number}</span>
                            </div>
                            <h3 className={`mb-3 font-space-grotesk text-2xl font-black ${killer.color}`}>{killer.title}</h3>
                            <p className="mb-6 text-white/80">{killer.description}</p>

                            {/* Problem → Solution */}
                            <div className="mb-4 grid grid-cols-2 gap-3">
                                <div className="rounded-xl bg-red-500/10 px-4 py-3 text-center">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-red-400/60">Problem</p>
                                    <p className="mt-1 text-xs font-bold text-red-400">{killer.problem}</p>
                                </div>
                                <div className="rounded-xl bg-emerald-500/10 px-4 py-3 text-center">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/60">Our Solution</p>
                                    <p className="mt-1 text-xs font-bold text-emerald-400">{killer.solution}</p>
                                </div>
                            </div>

                            <div className="rounded-2xl bg-white/[0.04] p-4 text-center">
                                <div className={`font-space-grotesk text-2xl font-black ${killer.color}`}>{killer.stat}</div>
                                <p className="text-xs font-bold uppercase tracking-wider text-white/70">{killer.statLabel}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Big stat */}
                <div className="scroll-reveal mt-16 overflow-hidden rounded-3xl bg-gradient-to-r from-red-600/20 via-amber-500/20 to-emerald-500/20 p-12 text-center backdrop-blur-sm md:p-16">
                    <p className="mb-4 text-sm font-bold uppercase tracking-wider text-white/80">Without protection, one health event can destroy</p>
                    <div className="font-space-grotesk text-6xl font-black text-white md:text-8xl">
                        <CountUp end={30} suffix="+" prefix="" /> Years
                    </div>
                    <p className="mt-4 text-lg text-white/80">of wealth accumulation</p>
                </div>
            </div>
        </section>
    )
}
