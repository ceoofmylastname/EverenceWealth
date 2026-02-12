'use client'

import { useState, useMemo } from 'react'

function formatCurrency(value: number) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value)
}

export default function IndexedCalculator() {
    const [startingAmount, setStartingAmount] = useState(100000)
    const [monthlyContribution, setMonthlyContribution] = useState(500)
    const [years, setYears] = useState(30)

    const results = useMemo(() => {
        // Traditional: 7% avg but with -30% crashes every 10 years, 2.5% fees
        const traditionalRate = 0.07
        const feeRate = 0.025
        const netRate = traditionalRate - feeRate
        let traditionalValue = startingAmount
        let totalFees = 0
        for (let y = 1; y <= years; y++) {
            // Crash every 10 years
            const yearReturn = y % 10 === 0 ? -0.30 : netRate + (0.30 / 9) // Distribute crash recovery across other years
            traditionalValue = (traditionalValue + monthlyContribution * 12) * (1 + yearReturn)
            totalFees += (traditionalValue * feeRate)
        }

        // Indexed: 8% avg with 0% floor, 0.5% fees
        const indexedRate = 0.08
        const indexedFeeRate = 0.005
        let indexedValue = startingAmount
        let indexedFees = 0
        for (let y = 1; y <= years; y++) {
            // Apply 0% floor - never negative
            const yearReturn = y % 10 === 0 ? 0 : indexedRate + (indexedRate * 0.1) // Slightly higher in non-crash years
            indexedValue = (indexedValue + monthlyContribution * 12) * (1 + yearReturn - indexedFeeRate)
            indexedFees += (indexedValue * indexedFeeRate)
        }

        return {
            traditional: Math.round(traditionalValue),
            traditionalFees: Math.round(totalFees),
            traditionalNet: Math.round(traditionalValue),
            indexed: Math.round(indexedValue),
            indexedFees: Math.round(indexedFees),
            indexedNet: Math.round(indexedValue),
            difference: Math.round(indexedValue - traditionalValue),
        }
    }, [startingAmount, monthlyContribution, years])

    return (
        <section className="relative overflow-hidden bg-[#1A4D3E] py-24 md:py-40">
            {/* Background mesh */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            <div className="mx-auto max-w-6xl px-6">
                {/* Header */}
                <div className="mb-16 text-center">
                    <span className="mb-4 inline-block font-space-grotesk text-sm font-bold tracking-[0.2em] text-emerald-300">
                        / SEE THE DIFFERENCE
                    </span>
                    <h2 className="scroll-reveal relative mx-auto mb-4 inline-block font-space-grotesk text-4xl font-black tracking-tight text-white md:text-6xl lg:text-8xl">
                        Calculate Your Advantage
                        <svg className="indexed-slash-underline absolute -bottom-2 left-0 w-full" viewBox="0 0 300 10" preserveAspectRatio="none" height="10">
                            <path d="M0 8 L300 2" stroke="url(#slashGrad7)" strokeWidth="4" fill="none" strokeLinecap="round" />
                            <defs>
                                <linearGradient id="slashGrad7" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#1A4D3E" />
                                    <stop offset="50%" stopColor="#10B981" />
                                    <stop offset="100%" stopColor="#34D399" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </h2>
                </div>

                <div className="grid gap-12 lg:grid-cols-2">
                    {/* Inputs */}
                    <div className="space-y-10">
                        {/* Starting Amount */}
                        <div>
                            <div className="mb-3 flex items-baseline justify-between">
                                <label className="text-sm font-bold uppercase tracking-wider text-white/60">Starting Amount</label>
                                <span className="font-space-grotesk text-2xl font-black text-white">{formatCurrency(startingAmount)}</span>
                            </div>
                            <input
                                type="range"
                                min={10000}
                                max={1000000}
                                step={10000}
                                value={startingAmount}
                                onChange={(e) => setStartingAmount(Number(e.target.value))}
                                className="indexed-slider w-full"
                            />
                            <div className="mt-1 flex justify-between text-xs text-white/30">
                                <span>$10k</span><span>$1M</span>
                            </div>
                        </div>

                        {/* Monthly Contribution */}
                        <div>
                            <div className="mb-3 flex items-baseline justify-between">
                                <label className="text-sm font-bold uppercase tracking-wider text-white/60">Monthly Contribution</label>
                                <span className="font-space-grotesk text-2xl font-black text-white">{formatCurrency(monthlyContribution)}</span>
                            </div>
                            <input
                                type="range"
                                min={0}
                                max={10000}
                                step={100}
                                value={monthlyContribution}
                                onChange={(e) => setMonthlyContribution(Number(e.target.value))}
                                className="indexed-slider w-full"
                            />
                            <div className="mt-1 flex justify-between text-xs text-white/30">
                                <span>$0</span><span>$10k</span>
                            </div>
                        </div>

                        {/* Years */}
                        <div>
                            <div className="mb-3 flex items-baseline justify-between">
                                <label className="text-sm font-bold uppercase tracking-wider text-white/60">Years to Invest</label>
                                <span className="font-space-grotesk text-2xl font-black text-white">{years} years</span>
                            </div>
                            <input
                                type="range"
                                min={10}
                                max={40}
                                step={1}
                                value={years}
                                onChange={(e) => setYears(Number(e.target.value))}
                                className="indexed-slider w-full"
                            />
                            <div className="mt-1 flex justify-between text-xs text-white/30">
                                <span>10 yrs</span><span>40 yrs</span>
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    <div className="space-y-6">
                        {/* Traditional */}
                        <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.2)] backdrop-blur-sm transition-all hover:bg-white/[0.06]">
                            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white/50">Traditional Portfolio</h3>
                            <div className="mb-2 font-space-grotesk text-4xl font-black text-red-400">
                                {formatCurrency(results.traditional)}
                            </div>
                            <div className="flex gap-4 text-sm">
                                <span className="text-white/40">Fees paid: <span className="font-bold text-red-400">{formatCurrency(results.traditionalFees)}</span></span>
                            </div>
                            <p className="mt-2 text-xs text-white/30">7% avg return, -30% crashes, 2.5% fees</p>
                        </div>

                        {/* Indexed */}
                        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 shadow-[0_8px_30px_rgba(16,185,129,0.15)] backdrop-blur-sm transition-all hover:bg-emerald-500/15">
                            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-emerald-300">Indexed Strategy</h3>
                            <div className="indexed-gradient-text mb-2 bg-clip-text font-space-grotesk text-4xl font-black text-transparent">
                                {formatCurrency(results.indexed)}
                            </div>
                            <div className="flex gap-4 text-sm">
                                <span className="text-white/40">Fees paid: <span className="font-bold text-emerald-400">{formatCurrency(results.indexedFees)}</span></span>
                            </div>
                            <p className="mt-2 text-xs text-white/30">8% avg return, 0% floor, 0.5% fees</p>
                        </div>

                        {/* Difference */}
                        <div className="rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-[#1A4D3E]/20 p-6 text-center backdrop-blur-sm">
                            <p className="mb-2 text-sm font-bold text-white/50">Your Indexed Advantage</p>
                            <div className="indexed-gradient-text bg-clip-text font-space-grotesk text-4xl font-black text-transparent md:text-5xl">
                                +{formatCurrency(results.difference)}
                            </div>
                            <p className="mt-2 text-sm text-white/40">more with indexed strategy</p>
                        </div>

                        {/* CTA */}
                        <a
                            href="#assessment"
                            className="group flex items-center justify-center gap-3 rounded-2xl bg-white px-8 py-4 font-space-grotesk text-lg font-bold text-[#1A4D3E] transition-all hover:-translate-y-1 hover:shadow-xl"
                        >
                            Schedule Strategy Session
                            <span className="transition-transform group-hover:translate-x-1">→</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
