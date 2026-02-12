'use client'

import CountUp from './CountUp'

const FEES = [
    { label: 'Administrative Fees', icon: '📋', percent: 0.5, width: 'w-[25%]' },
    { label: 'Investment Management', icon: '👔', percent: 1.0, width: 'w-[50%]' },
    { label: 'Expense Ratios', icon: '📊', percent: 1.5, width: 'w-[75%]' },
]

export default function KillerFees() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-red-50 to-white py-24 md:py-32">
            {/* Red top bar */}
            <div className="absolute left-0 right-0 top-0 h-2 bg-gradient-to-r from-red-500 to-red-600" />

            {/* Badge */}
            <div className="mx-auto mb-16 flex flex-col items-center">
                <div className="flex h-24 w-24 flex-col items-center justify-center rounded-full bg-red-500 text-white shadow-[0_20px_60px_rgba(239,68,68,0.4)]">
                    <span className="text-xl font-black">01</span>
                    <span className="text-2xl">💸</span>
                </div>
            </div>

            <div className="mx-auto max-w-6xl px-6">
                <div className="grid gap-16 lg:grid-cols-2">
                    {/* Left: Content */}
                    <div>
                        <h2 className="scroll-reveal mb-2 font-space-grotesk text-4xl font-bold text-[#1A4D3E] md:text-5xl">
                            The Fee Trap
                        </h2>
                        <p className="scroll-reveal mb-8 text-lg text-[#4A5565]">Your 401(k)&apos;s Silent Partner</p>

                        <p className="scroll-reveal mb-10 text-lg leading-relaxed text-gray-600">
                            Did you know your 401(k) has a <strong className="text-[#1A4D3E]">silent partner</strong>?
                            One who doesn&apos;t take any risk but takes half the reward.
                        </p>

                        {/* Fee breakdown */}
                        <div className="scroll-reveal mb-10">
                            <h3 className="mb-6 font-space-grotesk text-xl font-bold text-[#1A4D3E]">Where Your Money Goes:</h3>
                            <div className="space-y-5">
                                {FEES.map((fee) => (
                                    <div key={fee.label}>
                                        <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700">
                                            <span>{fee.icon}</span>
                                            {fee.label}
                                        </div>
                                        <div className="h-8 overflow-hidden rounded-full bg-red-100">
                                            <div className={`fee-bar-animate flex h-full items-center justify-end rounded-full bg-gradient-to-r from-red-400 to-red-500 px-3 text-xs font-bold text-white ${fee.width}`}>
                                                {fee.percent}%
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 rounded-xl bg-red-500 px-4 py-3 text-center font-bold text-white">
                                TOTAL: 3% per year
                            </div>
                        </div>

                        {/* Truth bomb */}
                        <div className="scroll-reveal mb-10 flex gap-4 rounded-2xl border-l-[6px] border-red-500 bg-red-50 p-6">
                            <span className="flex-shrink-0 text-4xl">💣</span>
                            <div>
                                <h4 className="mb-1 font-space-grotesk text-lg font-bold text-gray-900">The 30-Year Impact:</h4>
                                <p className="text-gray-700">
                                    A <strong>3% fee</strong> erodes over{' '}
                                    <span className="font-black text-red-600 underline decoration-red-500 decoration-[3px]">50% of your account value</span>{' '}
                                    over 35 years.
                                </p>
                            </div>
                        </div>

                        {/* Quote */}
                        <blockquote className="scroll-reveal border-l-4 border-[#1A4D3E] pl-6 text-xl italic text-[#4A5565]">
                            &ldquo;You take 100% of the risk,
                            <br />but the fund manager takes half the harvest.&rdquo;
                            <cite className="mt-2 block text-sm font-bold not-italic text-[#1A4D3E]">&mdash; The Fee Trap Reality</cite>
                        </blockquote>
                    </div>

                    {/* Right: Visual */}
                    <div className="flex flex-col gap-8">
                        {/* Comparison chart */}
                        <div className="scroll-reveal rounded-3xl bg-white p-8 shadow-lg">
                            <h4 className="mb-8 text-center font-space-grotesk text-lg font-bold text-gray-900">35-Year Impact of 3% Fees</h4>
                            <div className="flex items-end justify-center gap-8">
                                <div className="flex flex-col items-center">
                                    <div className="mb-2 text-sm font-bold text-emerald-600">No Fees</div>
                                    <div className="flex h-48 w-20 items-end justify-center rounded-t-xl bg-gradient-to-t from-emerald-500 to-emerald-400 md:w-24">
                                        <span className="pb-2 text-xs font-bold text-white">$1M</span>
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500">What you should have</p>
                                </div>

                                <div className="flex flex-col items-center">
                                    <div className="mb-2 text-sm font-bold text-amber-600">With 3%</div>
                                    <div className="flex h-24 w-20 items-end justify-center rounded-t-xl bg-gradient-to-t from-amber-500 to-amber-400 md:w-24">
                                        <span className="pb-2 text-xs font-bold text-white">$500k</span>
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500">What you get</p>
                                </div>

                                <div className="flex flex-col items-center">
                                    <div className="mb-2 text-sm font-bold text-red-600">Lost</div>
                                    <div className="flex h-24 w-20 items-end justify-center rounded-t-xl bg-gradient-to-t from-red-500 to-red-400 md:w-24">
                                        <span className="pb-2 text-xs font-bold text-white">$500k</span>
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500">Paid to &ldquo;the partner&rdquo;</p>
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="scroll-reveal rounded-3xl bg-white p-8 shadow-lg">
                            <h4 className="mb-6 text-center font-space-grotesk text-lg font-bold text-gray-900">Cumulative Fee Cost</h4>
                            <div className="space-y-4">
                                {[
                                    { year: 'Year 1', value: '$100,000', fee: '-$3,000' },
                                    { year: 'Year 10', value: '$200,000', fee: '-$42,000' },
                                    { year: 'Year 35', value: '$500,000', fee: '-$500,000' },
                                ].map((item) => (
                                    <div key={item.year} className="flex items-center justify-between rounded-xl bg-gray-50 px-5 py-4">
                                        <span className="text-sm font-bold text-gray-600">{item.year}</span>
                                        <span className="text-sm text-gray-500">{item.value}</span>
                                        <span className="font-bold text-red-500">{item.fee}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Pie chart visual */}
                        <div className="scroll-reveal rounded-3xl bg-white p-8 text-center shadow-lg">
                            <h4 className="mb-6 font-space-grotesk text-lg font-bold text-gray-900">Who Gets Your Growth?</h4>
                            <div className="relative mx-auto h-48 w-48">
                                <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                                    <circle cx="50" cy="50" r="40" fill="none" stroke="#10B981" strokeWidth="20" strokeDasharray="125.6 125.6" />
                                    <circle cx="50" cy="50" r="40" fill="none" stroke="#EF4444" strokeWidth="20" strokeDasharray="125.6 125.6" strokeDashoffset="-125.6" />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-xs font-bold text-gray-500">50 / 50</span>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-center gap-6">
                                <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-emerald-500" /> <span className="text-sm font-semibold">You: 50%</span></div>
                                <div className="flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-red-500" /> <span className="text-sm font-semibold">Fees: 50%</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
