'use client'

import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import CountUp from '../killers/CountUp'

export default function IndexedHero() {
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 150)
        return () => clearTimeout(timer)
    }, [])

    return (
        <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#060f0c] via-[#0a1f1a] to-[#1A4D3E]">
            {/* Animated mesh gradient overlay */}
            <div className="indexed-mesh-bg pointer-events-none absolute inset-0" />

            {/* Floating gradient orbs — 3 unique drift paths */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="indexed-orb-1 absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(26,77,62,0.18)_0%,transparent_60%)] blur-[80px]" />
                <div className="indexed-orb-2 absolute -bottom-40 -right-40 h-[600px] w-[600px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.18)_0%,transparent_60%)] blur-[80px]" />
                <div className="indexed-orb-3 absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(52,211,153,0.12)_0%,transparent_60%)] blur-[60px]" />
            </div>

            {/* Dot grid texture */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

            <div className="indexed-hero-perspective relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center px-6 pt-32 text-center md:pt-40 lg:pt-48">
                {/* Eyebrow */}
                <div className={`indexed-fade-rise mb-8 ${isLoaded ? '' : 'opacity-0'}`} style={{ animationDelay: '0.1s' }}>
                    <span className="inline-block rounded-full border border-white/10 bg-white/[0.04] px-6 py-2.5 font-space-grotesk text-[10px] font-bold tracking-[0.3em] text-emerald-400/80 shadow-[0_0_30px_rgba(52,211,153,0.08)] backdrop-blur-sm md:text-xs">
                        THE WHOLESALE ADVANTAGE
                    </span>
                </div>

                {/* Main Headline — modern stacked layout */}
                <h1 className={`indexed-fade-rise mb-6 ${isLoaded ? '' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
                    {/* "ZERO" — giant standalone word */}
                    <span className="indexed-gradient-text block bg-clip-text font-space-grotesk text-[72px] font-black leading-none tracking-[-0.04em] text-transparent sm:text-[100px] md:text-[130px] lg:text-[160px]">
                        ZERO
                    </span>
                    {/* "IS YOUR HERO" — smaller refined line */}
                    <span className="mt-1 block font-space-grotesk text-[22px] font-bold tracking-[0.15em] text-white/90 sm:text-[28px] md:mt-2 md:text-[36px] lg:text-[44px]">
                        IS YOUR <span className="relative inline-block text-white">HERO
                            <svg className="indexed-slash-underline absolute -bottom-1 left-0 w-full md:-bottom-2" viewBox="0 0 200 10" preserveAspectRatio="none" height="8">
                                <path d="M0 8 L200 2" stroke="url(#slashGradHero)" strokeWidth="4" fill="none" strokeLinecap="round" />
                                <defs>
                                    <linearGradient id="slashGradHero" x1="0%" y1="0%" x2="100%" y2="0%">
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
                <div className={`indexed-fade-rise mx-auto mb-12 max-w-xl ${isLoaded ? '' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
                    <p className="text-base leading-relaxed text-white/80 md:text-lg lg:text-xl">
                        Protection from market loss. Participation in market gains.
                    </p>
                    <p className="mt-4 inline-block rounded-full bg-emerald-500/10 px-5 py-2 text-sm font-semibold tracking-wide text-emerald-300/90 shadow-[0_0_30px_rgba(16,185,129,0.1)] backdrop-blur-sm md:text-base">
                        100% tax-free growth
                    </p>
                </div>

                {/* 0% Floor Chart — LARGE frosted glass 3D panel */}
                <div className={`indexed-fade-rise w-full ${isLoaded ? '' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
                    <div className="hero-chart-3d relative rounded-[2rem] border border-white/[0.08] p-1 md:rounded-[2.5rem]" style={{ perspective: '1000px' }}>
                        {/* Outer glow ring */}
                        <div className="pointer-events-none absolute -inset-[1px] rounded-[2rem] shadow-[0_0_80px_rgba(16,185,129,0.08),_0_0_160px_rgba(26,77,62,0.05)] md:rounded-[2.5rem]" />

                        {/* Frosted glass container */}
                        <div className="relative overflow-hidden rounded-[1.75rem] border border-white/[0.06] bg-white/[0.04] shadow-[0_30px_100px_rgba(0,0,0,0.4),_0_10px_40px_rgba(0,0,0,0.3),_inset_0_1px_0_rgba(255,255,255,0.08),_inset_0_-1px_0_rgba(255,255,255,0.02)] md:rounded-[2.25rem]" style={{ backdropFilter: 'blur(20px) saturate(1.5)' }}>
                            {/* Inner frosted header bar */}
                            <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-3 md:px-8 md:py-4" style={{ backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.03)' }}>
                                <div className="flex items-center gap-2">
                                    <div className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
                                    <div className="h-2.5 w-2.5 rounded-full bg-amber-400/60" />
                                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/60" />
                                </div>
                                <span className="font-space-grotesk text-[10px] font-bold tracking-[0.2em] text-white/60 md:text-xs">PERFORMANCE COMPARISON</span>
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1.5 text-[10px] text-white/70 md:text-xs"><span className="inline-block h-2 w-4 rounded-sm bg-red-500/60" />Traditional</span>
                                    <span className="flex items-center gap-1.5 text-[10px] text-white/70 md:text-xs"><span className="inline-block h-2 w-4 rounded-sm bg-emerald-500/60" />Indexed</span>
                                </div>
                            </div>

                            {/* Chart body */}
                            <div className="p-4 md:p-6 lg:p-8">
                                <svg viewBox="0 0 800 350" className="w-full" preserveAspectRatio="xMidYMid meet">
                                    <defs>
                                        <linearGradient id="heroGreenFill" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                                            <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                                        </linearGradient>
                                        <linearGradient id="heroRedFill" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.12" />
                                            <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
                                        </linearGradient>
                                        <filter id="chartGlow">
                                            <feGaussianBlur stdDeviation="3" result="blur" />
                                            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                                        </filter>
                                        <filter id="floorGlow">
                                            <feGaussianBlur stdDeviation="6" result="blur" />
                                            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                                        </filter>
                                    </defs>

                                    {/* Grid lines */}
                                    {[70, 120, 170, 220, 270].map((y) => (
                                        <line key={y} x1="60" y1={y} x2="760" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                                    ))}
                                    {[155, 250, 345, 440, 535, 630, 725].map((x) => (
                                        <line key={x} x1={x} y1="50" x2={x} y2="290" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
                                    ))}

                                    {/* 0% Floor line — heavy glow */}
                                    <line x1="60" y1="220" x2="760" y2="220" stroke="rgba(16,185,129,0.12)" strokeWidth="20" filter="url(#floorGlow)" />
                                    <line x1="60" y1="220" x2="760" y2="220" stroke="rgba(16,185,129,0.5)" strokeWidth="2" strokeDasharray="8 4" />
                                    <rect x="62" y="198" width="200" height="20" rx="4" fill="rgba(16,185,129,0.12)" />
                                    <text x="72" y="212" fill="rgba(16,185,129,0.9)" fontSize="11" fontWeight="bold" fontFamily="monospace">🛡️ 0% FLOOR — ZERO LOSSES</text>

                                    {/* Y-axis labels */}
                                    <text x="50" y="75" fill="rgba(255,255,255,0.25)" fontSize="11" textAnchor="end" fontFamily="monospace">+30%</text>
                                    <text x="50" y="125" fill="rgba(255,255,255,0.25)" fontSize="11" textAnchor="end" fontFamily="monospace">+20%</text>
                                    <text x="50" y="175" fill="rgba(255,255,255,0.25)" fontSize="11" textAnchor="end" fontFamily="monospace">+10%</text>
                                    <text x="50" y="225" fill="rgba(255,255,255,0.3)" fontSize="11" textAnchor="end" fontWeight="bold" fontFamily="monospace">0%</text>
                                    <text x="50" y="275" fill="rgba(255,255,255,0.2)" fontSize="11" textAnchor="end" fontFamily="monospace">-10%</text>

                                    {/* X-axis year labels */}
                                    {['2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023'].map((yr, i) => (
                                        <text key={yr} x={155 + i * 82} y="315" fill="rgba(255,255,255,0.2)" fontSize="11" textAnchor="middle" fontFamily="monospace">{yr}</text>
                                    ))}

                                    {/* Red fill area */}
                                    <path d="M100 170 L190 120 L280 260 L370 185 L460 280 L550 140 L640 240 L730 100 L730 300 L100 300 Z" fill="url(#heroRedFill)" className="indexed-chart-area" />

                                    {/* Traditional portfolio — RED with glow */}
                                    <path d="M100 170 L190 120 L280 260 L370 185 L460 280 L550 140 L640 240 L730 100" fill="none" stroke="#EF4444" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" opacity="0.06" className="indexed-chart-line" style={{ strokeDasharray: 2000, strokeDashoffset: 2000 }} />
                                    <path d="M100 170 L190 120 L280 260 L370 185 L460 280 L550 140 L640 240 L730 100" fill="none" stroke="#EF4444" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="indexed-chart-line" style={{ strokeDasharray: 2000, strokeDashoffset: 2000 }} filter="url(#chartGlow)" />
                                    {/* Red data points */}
                                    {[[100,170],[190,120],[280,260],[370,185],[460,280],[550,140],[640,240],[730,100]].map(([cx, cy], i) => (
                                        <circle key={`r${i}`} cx={cx} cy={cy} r="5" fill="#EF4444" stroke="#0a1f1a" strokeWidth="2" className="indexed-chart-area" style={{ animationDelay: `${1.5 + i * 0.15}s` }} />
                                    ))}

                                    {/* Green fill area */}
                                    <path d="M100 200 L190 150 L280 220 L370 160 L460 220 L550 120 L640 220 L730 80 L730 300 L100 300 Z" fill="url(#heroGreenFill)" className="indexed-chart-area" style={{ animationDelay: '0.6s' }} />

                                    {/* Indexed strategy — GREEN with glow */}
                                    <path d="M100 200 L190 150 L280 220 L370 160 L460 220 L550 120 L640 220 L730 80" fill="none" stroke="#10B981" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" opacity="0.08" className="indexed-chart-line" style={{ strokeDasharray: 2000, strokeDashoffset: 2000, animationDelay: '0.6s' }} />
                                    <path d="M100 200 L190 150 L280 220 L370 160 L460 220 L550 120 L640 220 L730 80" fill="none" stroke="#10B981" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" className="indexed-chart-line" style={{ strokeDasharray: 2000, strokeDashoffset: 2000, animationDelay: '0.6s' }} filter="url(#chartGlow)" />
                                    {/* Green data points */}
                                    {[[100,200],[190,150],[280,220],[370,160],[460,220],[550,120],[640,220],[730,80]].map(([cx, cy], i) => (
                                        <circle key={`g${i}`} cx={cx} cy={cy} r="5" fill="#10B981" stroke="#0a1f1a" strokeWidth="2" className="indexed-chart-area" style={{ animationDelay: `${2 + i * 0.15}s` }} />
                                    ))}

                                    {/* Crash annotations */}
                                    <rect x="242" y="250" width="72" height="18" rx="4" fill="rgba(239,68,68,0.15)" />
                                    <text x="278" y="263" fill="rgba(239,68,68,0.7)" fontSize="9" textAnchor="middle" fontWeight="bold">-38% CRASH</text>
                                    <rect x="422" y="270" width="72" height="18" rx="4" fill="rgba(239,68,68,0.15)" />
                                    <text x="458" y="283" fill="rgba(239,68,68,0.7)" fontSize="9" textAnchor="middle" fontWeight="bold">-34% DROP</text>

                                    {/* End value labels */}
                                    <rect x="736" y="84" width="52" height="22" rx="6" fill="rgba(16,185,129,0.2)" />
                                    <text x="762" y="100" fill="#10B981" fontSize="11" textAnchor="middle" fontWeight="bold">+105%</text>
                                    <rect x="736" y="104" width="52" height="18" rx="6" fill="rgba(239,68,68,0.15)" />
                                    <text x="762" y="117" fill="#EF4444" fontSize="10" textAnchor="middle" fontWeight="bold">+62%</text>
                                </svg>
                            </div>

                            {/* Bottom frosted glass stats bar */}
                            <div className="grid grid-cols-3 border-t border-white/[0.06]" style={{ backdropFilter: 'blur(12px)', background: 'rgba(255,255,255,0.02)' }}>
                                {[
                                    { value: 0, suffix: '%', label: 'Market Loss', color: 'text-white' },
                                    { value: 100, suffix: '%', label: 'Tax-Free Growth', color: 'indexed-gradient-text bg-clip-text text-transparent' },
                                    { value: 63, suffix: '%', label: 'Best Single Year', color: 'indexed-gradient-text bg-clip-text text-transparent' },
                                ].map((stat, i) => (
                                    <div key={stat.label} className={`px-3 py-4 text-center md:px-6 md:py-5 ${i < 2 ? 'border-r border-white/[0.06]' : ''}`}>
                                        <div className={`font-space-grotesk text-xl font-black md:text-3xl ${stat.color}`}>
                                            <CountUp end={stat.value} suffix={stat.suffix} />
                                        </div>
                                        <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-white/25 md:text-[11px]">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* CTA Button */}
                <div className={`indexed-fade-rise pb-20 ${isLoaded ? '' : 'opacity-0'}`} style={{ animationDelay: '1.4s' }}>
                    <a href="#wholesale" className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl px-8 py-4 font-space-grotesk text-base font-bold shadow-[0_20px_60px_rgba(255,255,255,0.12),_0_0_40px_rgba(255,255,255,0.05)] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_80px_rgba(255,255,255,0.18)] md:px-10 md:py-5 md:text-lg" style={{ backdropFilter: 'blur(20px)', background: 'rgba(255,255,255,0.95)' }}>
                        <span className="relative z-10 text-[#1A4D3E]">See Your Indexed Advantage</span>
                        <span className="relative z-10 text-[#1A4D3E] transition-transform duration-300 group-hover:translate-x-2">→</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    </a>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className={`indexed-fade-rise absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 ${isLoaded ? '' : 'opacity-0'}`} style={{ animationDelay: '1.8s' }}>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">Scroll</span>
                <ChevronDown className="h-4 w-4 animate-bounce text-white/60" />
            </div>
        </section>
    )
}
