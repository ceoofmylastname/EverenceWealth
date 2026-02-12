'use client'

import CountUp from './CountUp'

export default function ProblemSection() {
    return (
        <section id="problem" className="scroll-reveal bg-[#F9FAFB] py-24 md:py-32">
            <div className="mx-auto max-w-6xl px-6">
                {/* Section label */}
                <p className="mb-4 text-center text-xs font-bold uppercase tracking-[0.3em] text-red-500">
                    The Brutal Truth
                </p>

                {/* Headline */}
                <h2 className="mx-auto mb-6 max-w-3xl text-center font-space-grotesk text-4xl font-bold text-[#1A4D3E] md:text-5xl">
                    Most Investors Focus on{' '}
                    <span className="relative inline-block text-gray-400">
                        Returns
                        <span className="absolute left-0 top-1/2 h-1 w-full -rotate-2 bg-red-500" />
                    </span>
                    <br />
                    But Ignore{' '}
                    <span className="font-black text-emerald-500">Retention</span>
                </h2>

                {/* Philosophy */}
                <div className="mx-auto mb-16 max-w-2xl rounded-2xl border border-[#1A4D3E]/10 bg-white p-6 text-center shadow-sm">
                    <p className="text-lg text-[#4A5565]">
                        At Everence Wealth, we believe:{' '}
                        <strong className="text-[#1A4D3E]">It&apos;s not just what you make&mdash;it&apos;s what you keep.</strong>
                    </p>
                </div>

                {/* The Math */}
                <div className="mb-16 flex flex-col items-center justify-center gap-4 md:flex-row md:gap-6">
                    <div className="scroll-reveal w-full rounded-2xl bg-white p-8 text-center shadow-sm md:w-auto md:min-w-[220px]">
                        <p className="mb-2 text-sm font-bold uppercase tracking-wider text-[#4A5565]">Wall Street&apos;s Promise</p>
                        <div className="font-space-grotesk text-6xl font-black text-emerald-500 md:text-7xl">
                            <CountUp end={7} suffix="%" />
                        </div>
                        <p className="mt-2 text-sm text-[#4A5565]">Average Annual Return</p>
                    </div>

                    <span className="font-space-grotesk text-4xl font-black text-gray-300">−</span>

                    <div className="scroll-reveal w-full rounded-2xl bg-white p-8 text-center shadow-sm md:w-auto md:min-w-[220px]" style={{ transitionDelay: '150ms' }}>
                        <p className="mb-2 text-sm font-bold uppercase tracking-wider text-[#4A5565]">The Silent Killers</p>
                        <div className="font-space-grotesk text-6xl font-black text-red-500 md:text-7xl">
                            <CountUp end={4.5} suffix="%" decimals={1} />
                        </div>
                        <p className="mt-2 text-sm text-[#4A5565]">Fees + Volatility + Taxes</p>
                    </div>

                    <span className="font-space-grotesk text-4xl font-black text-gray-300">=</span>

                    <div className="scroll-reveal w-full rounded-2xl bg-white p-8 text-center shadow-sm md:w-auto md:min-w-[220px]" style={{ transitionDelay: '300ms' }}>
                        <p className="mb-2 text-sm font-bold uppercase tracking-wider text-[#4A5565]">Your Reality</p>
                        <div className="font-space-grotesk text-6xl font-black text-amber-500 md:text-7xl">
                            <CountUp end={2.5} suffix="%" decimals={1} />
                        </div>
                        <p className="mt-2 text-sm text-[#4A5565]">Actual Net Return</p>
                    </div>
                </div>

                {/* Shocking stat */}
                <div className="scroll-reveal mx-auto mb-12 max-w-2xl rounded-3xl border-[3px] border-red-500 bg-gradient-to-br from-red-50 to-red-100 p-10 text-center">
                    <div className="font-space-grotesk text-8xl font-black leading-none text-red-500 md:text-[128px]">
                        <CountUp end={64} suffix="%" />
                    </div>
                    <p className="mt-4 text-xl font-bold text-gray-800">
                        of your retirement growth is lost to the three silent killers
                    </p>
                    <p className="mt-2 text-sm text-gray-500">*Based on 35-year investment horizon</p>
                </div>

                {/* Transition */}
                <p className="text-center font-space-grotesk text-2xl font-bold text-[#1A4D3E]">
                    Let&apos;s expose each killer&mdash;one by one.
                </p>
            </div>
        </section>
    )
}
