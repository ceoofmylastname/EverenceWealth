'use client'

import CountUp from '../killers/CountUp'

export default function TaxCaseStudy() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-[#020806] via-[#0a1f1a] to-[#020806] py-24 md:py-40">
            <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
            <div className="indexed-mesh-bg pointer-events-none absolute inset-0" />

            <div className="relative mx-auto max-w-5xl px-6">
                {/* Header */}
                <div className="mb-16 text-center">
                    <span className="mb-4 inline-block font-space-grotesk text-sm font-bold tracking-[0.2em] text-amber-400">
                        / REAL NUMBERS
                    </span>
                    <h2 className="scroll-reveal font-space-grotesk text-4xl font-black tracking-tight text-white md:text-6xl lg:text-7xl">
                        Tax-Deferred vs. Tax-Exempt
                    </h2>
                </div>

                {/* Scenario */}
                <div className="scroll-reveal mb-12 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 md:p-8" style={{ backdropFilter: 'blur(16px)' }}>
                    <p className="mb-4 text-xs font-bold uppercase tracking-wider text-white/70">Scenario</p>
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
                        {[
                            { label: 'Age', value: '45' },
                            { label: 'Income', value: '$250k/yr' },
                            { label: 'Current 401(k)', value: '$500k' },
                            { label: 'Annual Add', value: '$30k' },
                            { label: 'Years to Retire', value: '20' },
                        ].map((item) => (
                            <div key={item.label} className="text-center">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-white/25">{item.label}</p>
                                <p className="mt-1 font-space-grotesk text-lg font-black text-white">{item.value}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Two paths */}
                <div className="grid gap-8 md:grid-cols-2">
                    {/* Path 1: Stay in 401(k) */}
                    <div className="scroll-reveal rounded-3xl border border-red-500/20 bg-white/[0.03] p-1 shadow-[0_20px_60px_rgba(0,0,0,0.3)]" style={{ backdropFilter: 'blur(16px)' }}>
                        <div className="rounded-[1.25rem] p-6 md:p-8">
                            <div className="mb-6 inline-block rounded-full bg-red-500/20 px-4 py-1 text-xs font-bold text-red-400">
                                PATH 1: STAY IN 401(k)
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-white/80">Value at 65</span>
                                    <span className="font-space-grotesk text-xl font-black text-white">$2,100,000</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-white/80">Tax (40% fed+state)</span>
                                    <span className="font-space-grotesk text-xl font-black text-red-400">-$840,000</span>
                                </div>
                                <div className="border-t border-white/[0.08] pt-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-white/90">Net After Tax</span>
                                        <span className="font-space-grotesk text-2xl font-black text-red-400">$1,260,000</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Path 2: Reposition to SER */}
                    <div className="scroll-reveal rounded-3xl border border-emerald-500/20 bg-emerald-500/[0.05] p-1 shadow-[0_20px_60px_rgba(16,185,129,0.1)]" style={{ backdropFilter: 'blur(16px)' }}>
                        <div className="rounded-[1.25rem] p-6 md:p-8">
                            <div className="mb-6 inline-block rounded-full bg-emerald-500/20 px-4 py-1 text-xs font-bold text-emerald-400">
                                PATH 2: REPOSITION TO SER
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-white/80">Value at 65</span>
                                    <span className="font-space-grotesk text-xl font-black text-white">$2,100,000</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-white/80">Tax owed</span>
                                    <span className="font-space-grotesk text-xl font-black text-emerald-400">$0</span>
                                </div>
                                <div className="border-t border-white/[0.08] pt-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-bold text-white/90">Net After Tax</span>
                                        <span className="indexed-gradient-text bg-clip-text font-space-grotesk text-2xl font-black text-transparent">$2,100,000</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Difference callout */}
                <div className="scroll-reveal mt-12 rounded-3xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-[#1A4D3E]/20 p-8 text-center" style={{ backdropFilter: 'blur(16px)' }}>
                    <p className="mb-2 text-sm font-bold text-white/80">The Difference</p>
                    <div className="indexed-gradient-text bg-clip-text font-space-grotesk text-5xl font-black text-transparent md:text-7xl">
                        $<CountUp end={840000} />
                    </div>
                    <p className="mt-2 text-lg text-white/80">saved by repositioning to tax-exempt structure</p>
                    <p className="mt-4 text-xs text-white/60">
                        Assumptions for illustration. Actual results depend on market performance, tax rates, and individual circumstances.
                    </p>
                </div>
            </div>
        </section>
    )
}
