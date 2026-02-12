'use client'

const RECOVERY_TABLE = [
    { loss: '-10%', gain: '+11%' },
    { loss: '-20%', gain: '+25%' },
    { loss: '-30%', gain: '+43%' },
    { loss: '-40%', gain: '+67%' },
    { loss: '-50%', gain: '+100%', highlight: true },
]

export default function KillerVolatility() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-white py-24 md:py-32">
            {/* Orange top bar */}
            <div className="absolute left-0 right-0 top-0 h-2 bg-gradient-to-r from-amber-500 to-amber-600" />

            {/* Badge */}
            <div className="mx-auto mb-16 flex flex-col items-center">
                <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-amber-500 text-white shadow-[0_20px_60px_rgba(245,158,11,0.4)]">
                    <span className="text-xl font-black">02</span>
                    <span className="text-2xl">📉</span>
                </div>
            </div>

            <div className="mx-auto max-w-6xl px-6">
                <div className="grid gap-16 lg:grid-cols-2">
                    {/* Left: Visual */}
                    <div className="flex flex-col gap-8 lg:order-1">
                        {/* Volatility math visual */}
                        <div className="scroll-reveal rounded-3xl bg-white p-8 shadow-lg">
                            <h4 className="mb-6 text-center font-space-grotesk text-lg font-bold text-gray-900">The Illusion of Averages</h4>
                            <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-3">
                                <div className="w-full rounded-2xl bg-red-50 p-5 text-center sm:w-auto sm:min-w-[130px]">
                                    <span className="text-xs font-bold text-gray-500">Year 1</span>
                                    <div className="font-space-grotesk text-3xl font-black text-red-500">-50%</div>
                                    <span className="text-sm text-gray-500">$50,000</span>
                                </div>

                                <span className="font-space-grotesk text-2xl font-black text-gray-300">+</span>

                                <div className="w-full rounded-2xl bg-emerald-50 p-5 text-center sm:w-auto sm:min-w-[130px]">
                                    <span className="text-xs font-bold text-gray-500">Year 2</span>
                                    <div className="font-space-grotesk text-3xl font-black text-emerald-500">+50%</div>
                                    <span className="text-sm text-gray-500">$75,000</span>
                                </div>

                                <span className="font-space-grotesk text-2xl font-black text-gray-300">=</span>

                                <div className="w-full sm:w-auto sm:min-w-[130px]">
                                    <div className="rounded-2xl bg-gray-50 p-4 text-center">
                                        <span className="text-[10px] font-bold uppercase text-gray-400">Wall Street&apos;s Math</span>
                                        <div className="font-space-grotesk text-2xl font-black text-gray-400">0%</div>
                                    </div>
                                    <div className="mt-2 rounded-2xl border-2 border-red-500 bg-red-50 p-4 text-center">
                                        <span className="text-[10px] font-bold uppercase text-red-500">Your Reality</span>
                                        <div className="font-space-grotesk text-2xl font-black text-red-600">-25%</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recovery table */}
                        <div className="scroll-reveal rounded-3xl bg-white p-8 shadow-lg">
                            <h4 className="mb-6 text-center font-space-grotesk text-lg font-bold text-gray-900">The Math of Recovery</h4>
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th className="rounded-tl-xl bg-amber-100 px-4 py-3 text-left text-sm font-bold text-amber-900">Loss</th>
                                        <th className="rounded-tr-xl bg-amber-100 px-4 py-3 text-right text-sm font-bold text-amber-900">Gain Needed to Recover</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {RECOVERY_TABLE.map((row) => (
                                        <tr key={row.loss} className={row.highlight ? 'bg-amber-50 ring-2 ring-amber-500 ring-inset' : ''}>
                                            <td className="border-b border-amber-100 px-4 py-3 text-xl font-bold text-red-500">{row.loss}</td>
                                            <td className="border-b border-amber-100 px-4 py-3 text-right text-xl font-bold text-amber-600">{row.gain}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div className="lg:order-0">
                        <h2 className="scroll-reveal mb-2 font-space-grotesk text-4xl font-bold text-[#1A4D3E] md:text-5xl">
                            The Volatility Trap
                        </h2>
                        <p className="scroll-reveal mb-8 text-lg text-[#4A5565]">Why Average Returns Lie</p>

                        <p className="scroll-reveal mb-10 text-lg leading-relaxed text-gray-600">
                            <strong className="text-[#1A4D3E]">Average returns are not actual returns.</strong>{' '}
                            This is the mathematical trap that destroys retirement plans.
                        </p>

                        {/* The Rule */}
                        <div className="scroll-reveal mb-10 flex gap-4 rounded-2xl border-2 border-amber-400 bg-amber-50 p-6">
                            <span className="flex-shrink-0 text-3xl">⚠️</span>
                            <div>
                                <h3 className="mb-2 font-space-grotesk text-lg font-bold text-gray-900">The Asymmetry of Loss:</h3>
                                <p className="text-lg text-gray-700">
                                    If you <strong>lose 50%</strong> of your portfolio,
                                    <br />you need a <strong>100% gain</strong> just to break even.
                                </p>
                            </div>
                        </div>

                        {/* Example */}
                        <div className="scroll-reveal mb-10 rounded-2xl bg-gray-50 p-6">
                            <h4 className="mb-4 font-space-grotesk font-bold text-gray-900">The Reality:</h4>
                            <p className="mb-4 text-gray-600">
                                Year 1: <strong className="text-red-500">-50%</strong> (Down $50k on $100k)
                                <br />Year 2: <strong className="text-emerald-500">+50%</strong> (Up $25k on $50k)
                            </p>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="rounded-xl bg-white p-3 text-center shadow-sm">
                                    <span className="text-[10px] font-bold uppercase text-gray-400">Average Return</span>
                                    <div className="font-space-grotesk text-xl font-bold text-gray-500">0%</div>
                                </div>
                                <div className="rounded-xl bg-white p-3 text-center shadow-sm">
                                    <span className="text-[10px] font-bold uppercase text-gray-400">Actual Value</span>
                                    <div className="font-space-grotesk text-xl font-bold text-red-500">$75k</div>
                                </div>
                                <div className="rounded-xl bg-white p-3 text-center shadow-sm">
                                    <span className="text-[10px] font-bold uppercase text-gray-400">Real Loss</span>
                                    <div className="font-space-grotesk text-xl font-bold text-red-600">-25%</div>
                                </div>
                            </div>
                        </div>

                        {/* Buffett Quote */}
                        <div className="scroll-reveal relative mb-10 overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A4D3E] to-[#2a6b56] p-8 text-white">
                            <span className="pointer-events-none absolute -left-2 -top-6 font-serif text-[120px] leading-none text-white/10">&ldquo;</span>
                            <p className="relative z-10 mb-1 text-2xl font-bold italic">Rule #1: Never lose money.</p>
                            <p className="relative z-10 mb-4 text-2xl font-bold italic">Rule #2: Never forget Rule #1.</p>
                            <cite className="relative z-10 text-sm font-bold not-italic text-emerald-200">&mdash; Warren Buffett</cite>
                        </div>

                        {/* Solution tease */}
                        <div className="scroll-reveal flex gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
                            <span className="flex-shrink-0 text-3xl">🛡️</span>
                            <div>
                                <p className="text-gray-700">
                                    This is why <strong className="text-[#1A4D3E]">avoiding loss</strong> is mathematically more important than chasing gains.
                                </p>
                                <p className="mt-2 font-bold text-emerald-700">
                                    Protected strategies with a 0% floor eliminate this trap entirely.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
