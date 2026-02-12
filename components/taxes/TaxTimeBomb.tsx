'use client'

import CountUp from '../killers/CountUp'

export default function TaxTimeBomb() {
    return (
        <section className="relative bg-white py-24 md:py-40">
            <div className="indexed-mesh-bg pointer-events-none absolute inset-0" />
            <div className="relative mx-auto max-w-6xl px-6">
                {/* Header */}
                <div className="mb-16 text-center">
                    <span className="mb-4 inline-block font-space-grotesk text-sm font-bold tracking-[0.2em] text-red-500">
                        / THE TRAP
                    </span>
                    <h2 className="scroll-reveal relative mx-auto mb-6 inline-block font-space-grotesk text-4xl font-black tracking-tight text-[#1A4D3E] md:text-6xl lg:text-7xl">
                        The Government&apos;s Forced
                        <br />
                        <span className="text-red-500">Withdrawal Rule</span>
                    </h2>
                    <p className="scroll-reveal mx-auto mt-8 max-w-2xl text-lg text-[#4A5565]">
                        At age 72 or 73, the IRS <strong>forces</strong> you to start withdrawing money from your tax-deferred accounts — whether you need the income or not.
                    </p>
                </div>

                <div className="grid gap-12 lg:grid-cols-2">
                    {/* RMD Penalty */}
                    <div className="scroll-reveal">
                        <div className="indexed-card-3d overflow-hidden rounded-3xl border-2 border-red-200 bg-gradient-to-br from-red-50 to-white shadow-indexed-lg">
                            <div className="border-b border-red-100 bg-red-500 px-8 py-4">
                                <h3 className="font-space-grotesk text-lg font-black text-white">⚠️ RMD PENALTY</h3>
                            </div>
                            <div className="p-8">
                                <p className="mb-6 text-[#4A5565]">If you fail to take your Required Minimum Distribution on time:</p>

                                <div className="mb-6 rounded-2xl bg-red-50 p-6 text-center">
                                    <p className="mb-1 text-xs font-bold uppercase tracking-wider text-red-400">Penalty</p>
                                    <div className="font-space-grotesk text-5xl font-black text-red-500">
                                        <CountUp end={50} suffix="%" />
                                    </div>
                                    <p className="mt-1 text-sm text-red-400">of the amount you should have withdrawn</p>
                                    <p className="mt-1 text-xs text-[#4A5565]">Plus you still owe income tax</p>
                                </div>

                                <div className="space-y-4 rounded-2xl bg-gray-50 p-6">
                                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Example Scenario</p>
                                    <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                                        <span className="text-sm text-[#4A5565]">Required withdrawal</span>
                                        <span className="font-space-grotesk font-bold text-[#1A4D3E]">$40,000</span>
                                    </div>
                                    <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                                        <span className="text-sm text-[#4A5565]">Penalty (50%)</span>
                                        <span className="font-space-grotesk font-bold text-red-500">-$20,000</span>
                                    </div>
                                    <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                                        <span className="text-sm text-[#4A5565]">Tax still owed (~37%)</span>
                                        <span className="font-space-grotesk font-bold text-red-500">-$15,000</span>
                                    </div>
                                    <div className="flex items-center justify-between pt-2">
                                        <span className="text-sm font-bold text-[#1A4D3E]">Total cost</span>
                                        <span className="font-space-grotesk text-xl font-black text-red-500">$35,000</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Rising Tax Rate Risk */}
                    <div className="scroll-reveal">
                        <div className="indexed-card-3d overflow-hidden rounded-3xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white shadow-indexed-lg">
                            <div className="border-b border-amber-100 bg-amber-500 px-8 py-4">
                                <h3 className="font-space-grotesk text-lg font-black text-white">📈 RISING TAX RATE RISK</h3>
                            </div>
                            <div className="p-8">
                                <p className="mb-6 text-[#4A5565]">When you contributed in the 1990s-2000s, tax rates were lower. But when you retire in 2030-2040...</p>

                                {/* Tax rate comparison */}
                                <div className="mb-6 grid grid-cols-2 gap-4">
                                    <div className="rounded-2xl bg-emerald-50 p-5 text-center">
                                        <p className="text-xs font-bold uppercase tracking-wider text-emerald-500">Saved at</p>
                                        <div className="font-space-grotesk text-4xl font-black text-emerald-600">28%</div>
                                        <p className="mt-1 text-xs text-[#4A5565]">1990s-2000s rate</p>
                                    </div>
                                    <div className="rounded-2xl bg-red-50 p-5 text-center">
                                        <p className="text-xs font-bold uppercase tracking-wider text-red-500">Withdraw at</p>
                                        <div className="font-space-grotesk text-4xl font-black text-red-500">40%+</div>
                                        <p className="mt-1 text-xs text-[#4A5565]">Projected future rate</p>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
                                    <p className="text-sm font-bold text-amber-700">
                                        You borrowed from the IRS at 28%.
                                        <br />
                                        You&apos;re paying them back at 40%.
                                    </p>
                                    <p className="mt-3 text-xs text-amber-600">
                                        That&apos;s not tax deferral. That&apos;s a bad loan.
                                    </p>
                                </div>

                                <div className="mt-6 space-y-4 rounded-2xl bg-gray-50 p-6">
                                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">$100k Withdrawal in CA</p>
                                    <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                                        <span className="text-sm text-[#4A5565]">Federal (37%)</span>
                                        <span className="font-space-grotesk font-bold text-red-500">-$37,000</span>
                                    </div>
                                    <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                                        <span className="text-sm text-[#4A5565]">State CA (13.3%)</span>
                                        <span className="font-space-grotesk font-bold text-red-500">-$13,300</span>
                                    </div>
                                    <div className="flex items-center justify-between pt-2">
                                        <span className="text-sm font-bold text-[#1A4D3E]">Net after tax</span>
                                        <span className="font-space-grotesk text-xl font-black text-red-500">$49,700</span>
                                    </div>
                                    <p className="text-center text-xs text-[#4A5565]">You worked for $100k. You keep less than half.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
