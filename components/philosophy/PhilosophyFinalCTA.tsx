'use client'

import { useAssessmentModal } from '@/components/AssessmentModal'

const STRESS_TEST = [
    'Tax exposure',
    'Volatility risk',
    'Fee erosion',
    'Human Life Value protection',
]

export default function PhilosophyFinalCTA() {
    const { openModal } = useAssessmentModal()

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0a1f1a] via-[#1A4D3E] to-emerald-600 py-24 md:py-40">
            {/* Floating orbs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="indexed-orb-1 absolute -left-20 -top-20 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(26,77,62,0.15)_0%,transparent_60%)] blur-[60px]" />
                <div className="indexed-orb-2 absolute -bottom-20 -right-20 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.15)_0%,transparent_60%)] blur-[60px]" />
            </div>
            <div className="pointer-events-none absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

            <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
                {/* Floating icon */}
                <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-5xl shadow-[0_0_40px_rgba(255,255,255,0.1)] backdrop-blur-sm" style={{ animation: 'killersFloat 6s ease-in-out infinite' }}>
                    🏆
                </div>

                {/* Headline */}
                <h2 className="scroll-reveal mb-6 font-space-grotesk text-4xl font-black leading-tight tracking-tight text-white md:text-6xl lg:text-7xl">
                    Stop Playing &ldquo;Not to Lose.&rdquo;
                    <br />
                    <span className="text-emerald-300">Start Playing to Win.</span>
                </h2>

                <p className="scroll-reveal mx-auto mb-12 max-w-2xl text-lg text-white/90">
                    If you invest only in money, it may grow. But if you don&apos;t grow with it, the gap between your capital and your capability becomes a risk. Let&apos;s align your money with your vision.
                </p>

                {/* Stress test items */}
                <div className="scroll-reveal mx-auto mb-12 flex max-w-3xl flex-wrap items-center justify-center gap-4">
                    {STRESS_TEST.map((item) => (
                        <div key={item} className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white backdrop-blur-sm">
                            <span className="text-emerald-300">&#10003;</span>
                            {item}
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="scroll-reveal mb-8">
                    <button
                        onClick={openModal}
                        className="btn-3d-light group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl px-10 py-6 font-space-grotesk text-lg font-bold text-[#1A4D3E]"
                    >
                        Schedule Your Financial Needs Assessment
                        <span className="transition-transform group-hover:translate-x-1">&rarr;</span>
                    </button>
                </div>

                {/* Guarantee */}
                <p className="scroll-reveal mb-8 text-sm text-white/80">
                    No cost. No obligation. Total clarity.
                </p>

                {/* Trust badges */}
                <div className="scroll-reveal flex flex-wrap items-center justify-center gap-6">
                    {['Independent Fiduciary', '75+ Carrier Partners', 'Established 1998'].map((badge) => (
                        <span key={badge} className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white/80">
                            {badge}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    )
}
