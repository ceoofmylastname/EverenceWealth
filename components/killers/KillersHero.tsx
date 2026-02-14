'use client'

import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

export default function KillersHero() {
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100)
        return () => clearTimeout(timer)
    }, [])

    return (
        <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#0d2b23] to-[#1A4D3E]">
            {/* Floating particles */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {['-50%', '+3%', '$$$', '-2%', '+7%', '$0'].map((text, i) => (
                    <span
                        key={i}
                        className="killers-particle absolute font-space-grotesk text-sm font-bold text-white/[0.06]"
                        style={{
                            left: `${15 + i * 14}%`,
                            top: `${10 + (i % 3) * 30}%`,
                            animationDelay: `${i * 1.2}s`,
                            fontSize: `${14 + (i % 3) * 8}px`,
                        }}
                    >
                        {text}
                    </span>
                ))}
            </div>

            {/* Radial glow */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(239,68,68,0.08)_0%,transparent_70%)]" />

            <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
                {/* Eyebrow */}
                <div className={`mb-8 transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                    <span className="inline-block rounded-full border border-white/10 bg-white/[0.03] px-5 py-2 text-[10px] font-black uppercase tracking-[0.5em] text-white/80">
                        The Truth Wall Street Won&apos;t Tell You
                    </span>
                </div>

                {/* Headline */}
                <h1 className={`mb-6 font-space-grotesk text-5xl font-black leading-[1.05] tracking-tight transition-all delay-200 duration-1000 md:text-7xl lg:text-[96px] ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                    <span className="killers-headline-gradient bg-clip-text text-transparent">
                        Is Your Portfolio
                    </span>
                    <br />
                    <span className="relative inline-block">
                        <span className="killers-headline-accent bg-clip-text text-transparent">
                            Leaking?
                        </span>
                        {/* Animated glowing underline */}
                        <span className="killers-underline absolute -bottom-2 left-0 h-[3px] w-full rounded-full md:-bottom-3 md:h-1" />
                        {/* Soft highlight glow behind the word */}
                        <span className="pointer-events-none absolute -inset-x-4 -inset-y-2 -z-10 rounded-2xl bg-red-500/[0.08] blur-xl" />
                    </span>
                </h1>

                {/* Subheadline */}
                <p className={`mx-auto mb-12 max-w-2xl text-lg text-white/90 transition-all delay-500 duration-1000 md:text-xl ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
                    The three silent forces eroding your retirement&mdash;
                    <br className="hidden md:inline" />
                    and why your advisor isn&apos;t talking about them
                </p>

                {/* Leaking bucket visual */}
                <div className={`relative mx-auto mb-14 flex max-w-lg items-center justify-center gap-8 transition-all delay-700 duration-1000 md:gap-12 ${isLoaded ? 'scale-100 opacity-100' : 'scale-90 opacity-0'}`}>
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/10 text-3xl md:h-20 md:w-20">💸</div>
                        <span className="text-xs font-bold uppercase tracking-wider text-red-400">Fees</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/10 text-3xl md:h-20 md:w-20">📉</div>
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Volatility</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-700/30 bg-orange-700/10 text-3xl md:h-20 md:w-20">💣</div>
                        <span className="text-xs font-bold uppercase tracking-wider text-orange-400">Taxes</span>
                    </div>
                </div>

                {/* CTA */}
                <div className={`transition-all delay-1000 duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
                    <a href="#problem" className="group inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-4 font-space-grotesk text-lg font-bold text-[#1A4D3E] shadow-xl transition-all hover:-translate-y-1 hover:shadow-2xl">
                        Discover the Silent Killers
                        <span className="transition-transform group-hover:translate-x-1">→</span>
                    </a>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/70">
                <ChevronDown className="h-6 w-6" />
            </div>
        </section>
    )
}
