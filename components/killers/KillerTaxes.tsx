'use client'

import CountUp from './CountUp'

const TAX_TIMELINE = [
    { year: 'Save', icon: '💰', value: '$500,000', detail: 'Pre-tax 401(k)', color: 'emerald' },
    { year: 'Grow', icon: '📈', value: '$1,200,000', detail: 'After 30 years', color: 'emerald' },
    { year: 'Withdraw', icon: '🏦', value: '-$360,000', detail: 'Taxes at 30%', color: 'red' },
]

const TRAP_STEPS = [
    { step: '01', title: 'You defer taxes today', desc: 'Every dollar goes in pre-tax. Feels great.' },
    { step: '02', title: 'Your money grows for decades', desc: 'The balance gets bigger and bigger.' },
    { step: '03', title: 'Tax rates go up', desc: 'History shows rates rise over time.' },
    { step: '04', title: 'You pay taxes on EVERYTHING', desc: 'Every dollar withdrawn is taxed as income.' },
]

export default function KillerTaxes() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-[#7C2D12] to-[#991B1B] py-24 text-white md:py-32">
            {/* Dark red top bar */}
            <div className="absolute left-0 right-0 top-0 h-2 bg-gradient-to-r from-orange-700 to-red-800" />

            {/* Subtle pattern overlay */}
            <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />

            {/* Badge */}
            <div className="mx-auto mb-16 flex flex-col items-center">
                <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-red-900 text-white shadow-[0_20px_60px_rgba(153,27,27,0.5)]">
                    <span className="text-xl font-black">03</span>
                    <span className="text-2xl">💣</span>
                </div>
            </div>

            <div className="mx-auto max-w-6xl px-6">
                <div className="grid gap-16 lg:grid-cols-2">
                    {/* Left: Content */}
                    <div>
                        <h2 className="scroll-reveal mb-2 font-space-grotesk text-4xl font-bold md:text-5xl">
                            The Tax Time Bomb
                        </h2>
                        <p className="scroll-reveal mb-8 text-lg text-white/60">Ticking Inside Your 401(k)</p>

                        <p className="scroll-reveal mb-10 text-lg leading-relaxed text-white/70">
                            Your 401(k) isn&apos;t tax-free &mdash; it&apos;s{' '}
                            <strong className="text-white">tax-deferred</strong>. That means every dollar
                            you withdraw in retirement will be taxed as{' '}
                            <strong className="text-amber-300">ordinary income</strong>.
                        </p>

                        {/* The Trap Steps */}
                        <div className="scroll-reveal mb-10">
                            <h3 className="mb-6 font-space-grotesk text-xl font-bold">How The Trap Works:</h3>
                            <div className="space-y-4">
                                {TRAP_STEPS.map((item) => (
                                    <div key={item.step} className="flex gap-4 rounded-xl bg-white/[0.06] p-4">
                                        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-900/50 font-space-grotesk text-sm font-black text-amber-300">
                                            {item.step}
                                        </span>
                                        <div>
                                            <h4 className="font-bold text-white">{item.title}</h4>
                                            <p className="text-sm text-white/50">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Warning */}
                        <div className="scroll-reveal mb-10 flex gap-4 rounded-2xl border-2 border-amber-500/40 bg-amber-500/10 p-6">
                            <span className="flex-shrink-0 text-3xl">⚠️</span>
                            <div>
                                <h3 className="mb-2 font-space-grotesk text-lg font-bold">The Question Nobody Asks:</h3>
                                <p className="text-lg text-white/80">
                                    Do you really think tax rates will be{' '}
                                    <strong className="text-amber-300">lower</strong> in 20-30 years &mdash;
                                    with $34 trillion in national debt?
                                </p>
                            </div>
                        </div>

                        {/* Solution tease */}
                        <div className="scroll-reveal flex gap-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-6">
                            <span className="flex-shrink-0 text-3xl">🛡️</span>
                            <div>
                                <p className="text-white/80">
                                    There are <strong className="text-emerald-300">legal strategies</strong> that
                                    let your money grow tax-free and be withdrawn tax-free.
                                </p>
                                <p className="mt-2 font-bold text-emerald-300">
                                    Most advisors never mention them.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Visuals */}
                    <div className="flex flex-col gap-8">
                        {/* Tax bracket history */}
                        <div className="scroll-reveal rounded-3xl bg-white/[0.06] p-8 backdrop-blur-sm">
                            <h4 className="mb-6 text-center font-space-grotesk text-lg font-bold">
                                Top Tax Rate Through History
                            </h4>
                            <div className="flex items-end justify-center gap-6 md:gap-8">
                                <div className="flex flex-col items-center">
                                    <div className="mb-2 text-sm font-bold text-amber-300">1960s</div>
                                    <div className="flex h-52 w-16 items-end justify-center rounded-t-xl bg-gradient-to-t from-red-700 to-red-500 md:w-20">
                                        <span className="pb-2 font-space-grotesk text-xs font-black">91%</span>
                                    </div>
                                    <p className="mt-2 text-[10px] text-white/40">Peak rate</p>
                                </div>

                                <div className="flex flex-col items-center">
                                    <div className="mb-2 text-sm font-bold text-amber-300">Today</div>
                                    <div className="flex h-28 w-16 items-end justify-center rounded-t-xl bg-gradient-to-t from-amber-700 to-amber-500 md:w-20">
                                        <span className="pb-2 font-space-grotesk text-xs font-black">37%</span>
                                    </div>
                                    <p className="mt-2 text-[10px] text-white/40">Current rate</p>
                                </div>

                                <div className="flex flex-col items-center">
                                    <div className="mb-2 text-sm font-bold text-red-300">Future</div>
                                    <div className="flex h-36 w-16 items-end justify-center rounded-t-xl border-2 border-dashed border-red-400/50 bg-red-500/20 md:w-20">
                                        <span className="pb-2 font-space-grotesk text-lg font-black text-red-300">??</span>
                                    </div>
                                    <p className="mt-2 text-[10px] text-red-300">$34T in debt</p>
                                </div>
                            </div>
                        </div>

                        {/* Timeline: Save → Grow → Tax */}
                        <div className="scroll-reveal rounded-3xl bg-white/[0.06] p-8 backdrop-blur-sm">
                            <h4 className="mb-6 text-center font-space-grotesk text-lg font-bold">
                                The 401(k) Journey
                            </h4>
                            <div className="space-y-4">
                                {TAX_TIMELINE.map((item, i) => (
                                    <div key={item.year} className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white/10 text-2xl">
                                            {item.icon}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-baseline justify-between">
                                                <span className="text-sm font-bold uppercase tracking-wider text-white/50">{item.year}</span>
                                                <span className={`font-space-grotesk text-xl font-black ${item.color === 'red' ? 'text-red-400' : 'text-emerald-400'}`}>
                                                    {item.value}
                                                </span>
                                            </div>
                                            <p className="text-sm text-white/40">{item.detail}</p>
                                        </div>
                                        {i < TAX_TIMELINE.length - 1 && (
                                            <div className="absolute ml-6 mt-16 h-4 border-l-2 border-dashed border-white/10" />
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 rounded-xl bg-red-900/50 px-4 py-3 text-center">
                                <span className="text-sm text-white/60">Net after taxes:</span>{' '}
                                <span className="font-space-grotesk text-xl font-black text-red-400">$840,000</span>
                                <span className="ml-2 text-sm text-white/40">from $1.2M</span>
                            </div>
                        </div>

                        {/* IRS ownership visual */}
                        <div className="scroll-reveal rounded-3xl bg-white/[0.06] p-8 text-center backdrop-blur-sm">
                            <h4 className="mb-6 font-space-grotesk text-lg font-bold">Who Owns Your 401(k)?</h4>
                            <div className="relative mx-auto h-48 w-48">
                                <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="20" />
                                    <circle cx="50" cy="50" r="40" fill="none" stroke="#10B981" strokeWidth="20" strokeDasharray="175.9 75.4" />
                                    <circle cx="50" cy="50" r="40" fill="none" stroke="#EF4444" strokeWidth="20" strokeDasharray="75.4 175.9" strokeDashoffset="-175.9" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="font-space-grotesk text-2xl font-black text-red-400">
                                        <CountUp end={30} suffix="%" />
                                    </span>
                                    <span className="text-[10px] font-bold text-white/40">IRS Share</span>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-center gap-6">
                                <div className="flex items-center gap-2">
                                    <span className="h-3 w-3 rounded-full bg-emerald-500" />
                                    <span className="text-sm font-semibold text-white/70">You: 70%</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="h-3 w-3 rounded-full bg-red-500" />
                                    <span className="text-sm font-semibold text-white/70">IRS: 30%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
