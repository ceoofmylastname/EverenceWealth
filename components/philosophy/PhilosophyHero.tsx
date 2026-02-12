'use client'

import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

export default function PhilosophyHero() {
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 150)
        return () => clearTimeout(timer)
    }, [])

    return (
        <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#020806] via-[#0a1f1a] to-[#1A4D3E]">
            {/* Animated mesh gradient overlay */}
            <div className="indexed-mesh-bg pointer-events-none absolute inset-0" />

            {/* Floating gradient orbs */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="indexed-orb-1 absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(26,77,62,0.2)_0%,transparent_60%)] blur-[80px]" />
                <div className="indexed-orb-2 absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.15)_0%,transparent_60%)] blur-[80px]" />
                <div className="indexed-orb-3 absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(52,211,153,0.12)_0%,transparent_60%)] blur-[60px]" />
            </div>

            {/* Dot grid texture */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

            <div className="indexed-hero-perspective relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center px-6 pt-32 text-center md:pt-40 lg:pt-48">
                {/* Eyebrow */}
                <div className={`indexed-fade-rise mb-8 ${isLoaded ? '' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
                    <span className="inline-block rounded-full border border-white/10 bg-white/[0.04] px-6 py-2.5 font-space-grotesk text-[10px] font-bold tracking-[0.3em] text-emerald-400/80 shadow-[0_0_30px_rgba(16,185,129,0.08)] backdrop-blur-sm md:text-xs">
                        OUR PHILOSOPHY
                    </span>
                </div>

                {/* Main Headline */}
                <h1 className={`indexed-fade-rise mb-6 ${isLoaded ? '' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
                    <span className="block font-space-grotesk text-[36px] font-black leading-[1.1] tracking-[-0.03em] text-white sm:text-[52px] md:text-[72px] lg:text-[90px]">
                        From Accumulation
                    </span>
                    <span className="mt-1 block font-space-grotesk text-[20px] font-bold tracking-[0.1em] text-white/50 sm:text-[26px] md:mt-3 md:text-[34px] lg:text-[42px]">
                        TO <span className="relative inline-block text-emerald-400">ABUNDANCE
                            <svg className="indexed-slash-underline absolute -bottom-1 left-0 w-full md:-bottom-2" viewBox="0 0 300 10" preserveAspectRatio="none" height="8">
                                <path d="M0 8 L300 2" stroke="url(#slashGradPhiloHero)" strokeWidth="4" fill="none" strokeLinecap="round" />
                                <defs>
                                    <linearGradient id="slashGradPhiloHero" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#1A4D3E" />
                                        <stop offset="50%" stopColor="#10B981" />
                                        <stop offset="100%" stopColor="#34D399" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </span>
                    </span>
                </h1>

                {/* Subheadline */}
                <div className={`indexed-fade-rise mx-auto mb-12 max-w-3xl ${isLoaded ? '' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
                    <p className="text-base leading-relaxed text-white/40 md:text-lg lg:text-xl">
                        We challenge the traditional doctrine of &ldquo;save, sacrifice, and wait.&rdquo;
                        <br className="hidden md:block" />
                        True wealth isn&apos;t about hoarding a finite pie&mdash;it&apos;s about value creation,
                        <br className="hidden md:block" />
                        cash flow, and building a legacy that lives now.
                    </p>
                </div>

                {/* Speakable answer card */}
                <div className={`indexed-fade-rise w-full max-w-3xl ${isLoaded ? '' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
                    <div className="hero-chart-3d relative rounded-[2rem] border border-white/[0.08] p-1">
                        <div className="pointer-events-none absolute -inset-[1px] rounded-[2rem] shadow-[0_0_80px_rgba(16,185,129,0.08),_0_0_160px_rgba(26,77,62,0.05)]" />
                        <div className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.06] bg-white/[0.04] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.4),_inset_0_1px_0_rgba(255,255,255,0.08)] md:p-10" style={{ backdropFilter: 'blur(20px) saturate(1.5)' }}>
                            <p className="text-base leading-relaxed text-white/60 md:text-lg">
                                Everence Wealth operates on an <strong className="text-emerald-400">Abundance Philosophy</strong>&mdash;wealth expands through value creation, not scarcity. We focus on <strong className="text-emerald-400">cash flow over net worth</strong>, strategic deployment over accumulation, and protecting your <strong className="text-emerald-400">Human Life Value</strong>. True financial strength is measured by income streams, not account balances.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* CTA */}
                <div className={`indexed-fade-rise flex flex-col items-center gap-4 pb-20 sm:flex-row ${isLoaded ? '' : 'opacity-0'}`} style={{ animationDelay: '1.2s' }}>
                    <a href="#assessment" className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl px-8 py-4 font-space-grotesk text-base font-bold shadow-[0_20px_60px_rgba(255,255,255,0.12)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(255,255,255,0.18)] md:px-10 md:py-5 md:text-lg" style={{ backdropFilter: 'blur(20px)', background: 'rgba(255,255,255,0.95)' }}>
                        <span className="relative z-10 text-[#1A4D3E]">Schedule Financial Needs Assessment</span>
                        <span className="relative z-10 text-[#1A4D3E] transition-transform duration-300 group-hover:translate-x-2">&rarr;</span>
                    </a>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className={`indexed-fade-rise absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 ${isLoaded ? '' : 'opacity-0'}`} style={{ animationDelay: '1.6s' }}>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/15">Scroll</span>
                <ChevronDown className="h-4 w-4 animate-bounce text-white/20" />
            </div>
        </section>
    )
}
