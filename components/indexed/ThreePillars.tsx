'use client'

export default function ThreePillars() {
    return (
        <section className="indexed-mesh-bg relative bg-gradient-to-b from-white to-emerald-50/50 py-24 md:py-40">
            <div className="mx-auto max-w-6xl px-6">
                {/* Header */}
                <div className="mb-20 text-center">
                    <span className="mb-4 inline-block font-space-grotesk text-xs font-bold tracking-[0.25em] text-emerald-600">
                        / THE THREE PILLARS
                    </span>
                    <h2 className="scroll-reveal relative mx-auto mb-6 inline-block font-space-grotesk text-4xl font-black tracking-tight text-[#1A4D3E] md:text-6xl lg:text-8xl">
                        Three Pillars
                        <svg className="indexed-slash-underline absolute -bottom-2 left-0 w-full md:-bottom-4" viewBox="0 0 300 10" preserveAspectRatio="none" height="10">
                            <path d="M0 8 L300 2" stroke="url(#slashG3)" strokeWidth="4" fill="none" strokeLinecap="round" />
                            <defs><linearGradient id="slashG3" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#1A4D3E" /><stop offset="50%" stopColor="#10B981" /><stop offset="100%" stopColor="#34D399" /></linearGradient></defs>
                        </svg>
                    </h2>
                    <p className="scroll-reveal mx-auto mt-10 max-w-xl text-lg text-[#4A5565]">
                        of Protection
                    </p>
                </div>

                {/* Pillar Cards — 3D hover */}
                <div className="grid gap-8 md:grid-cols-3">
                    {/* Pillar 1: 0% Floor */}
                    <div className="indexed-card-3d scroll-reveal group relative overflow-hidden rounded-3xl bg-white p-8 md:p-10">
                        <div className="indexed-pillar-bar absolute left-0 right-0 top-0 origin-left scale-x-0 group-hover:scale-x-100" />
                        <span className="pointer-events-none absolute right-4 top-2 font-space-grotesk text-[100px] font-black leading-none text-gray-50 md:text-[120px]">01</span>

                        <div className="indexed-icon-float relative mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 text-4xl shadow-indexed-sm">
                            🛡️
                        </div>
                        <h3 className="mb-1 font-space-grotesk text-2xl font-black text-[#1A4D3E] md:text-3xl">0% Floor</h3>
                        <p className="mb-5 text-sm font-bold text-emerald-500">Zero Is Your Hero</p>
                        <p className="mb-8 leading-relaxed text-[#4A5565]">
                            When the market drops, you don&apos;t. Your account never experiences a negative return.
                        </p>

                        {/* Interactive bar visual */}
                        <div className="mb-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-6 shadow-indexed-sm">
                            <p className="mb-5 text-center text-xs font-black uppercase tracking-widest text-gray-400">Market Down -30%</p>
                            <div className="flex items-end justify-center gap-8">
                                <div className="flex flex-col items-center">
                                    <span className="mb-2 font-space-grotesk text-xl font-black text-red-500">-30%</span>
                                    <div className="indexed-bar-grow h-16 w-16 rounded-t-xl bg-gradient-to-t from-red-500 to-red-400 shadow-[0_4px_20px_rgba(239,68,68,0.3)] md:w-20" />
                                    <span className="mt-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">Traditional</span>
                                </div>
                                <div className="flex flex-col items-center">
                                    <span className="mb-2 font-space-grotesk text-xl font-black text-emerald-500">0%</span>
                                    <div className="indexed-bar-grow relative h-28 w-16 rounded-t-xl bg-gradient-to-t from-emerald-500 to-emerald-400 shadow-[0_4px_20px_rgba(16,185,129,0.3)] md:w-20" style={{ animationDelay: '0.3s' }}>
                                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-emerald-500 px-3 py-1 text-[9px] font-black text-white shadow-lg">Protected!</span>
                                    </div>
                                    <span className="mt-3 text-[10px] font-bold uppercase tracking-wider text-gray-400">Indexed</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-sm font-bold text-emerald-600">✓ Principal always protected</p>
                    </div>

                    {/* Pillar 2: Annual Reset */}
                    <div className="indexed-card-3d scroll-reveal group relative overflow-hidden rounded-3xl bg-white p-8 md:p-10" style={{ transitionDelay: '150ms' }}>
                        <div className="indexed-pillar-bar absolute left-0 right-0 top-0 origin-left scale-x-0 group-hover:scale-x-100" />
                        <span className="pointer-events-none absolute right-4 top-2 font-space-grotesk text-[100px] font-black leading-none text-gray-50 md:text-[120px]">02</span>

                        <div className="indexed-icon-float relative mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-100 to-teal-200 text-4xl shadow-indexed-sm" style={{ animationDelay: '1s' }}>
                            🔒
                        </div>
                        <h3 className="mb-1 font-space-grotesk text-2xl font-black text-[#1A4D3E] md:text-3xl">Annual Reset</h3>
                        <p className="mb-5 text-sm font-bold text-teal-500">Lock In Your Gains</p>
                        <p className="mb-8 leading-relaxed text-[#4A5565]">
                            Every year, your gains become your new protected principal. Growth is locked in&mdash;forever.
                        </p>

                        {/* Timeline visual */}
                        <div className="mb-6 space-y-3">
                            {[
                                { year: 'Year 1', change: '+12%', value: '$112,000', icon: '🔒', color: 'text-emerald-500' },
                                { year: 'Year 2', change: '-20%', value: '$112,000', icon: '🛡️', color: 'text-red-500' },
                                { year: 'Year 3', change: '+10%', value: '$123,200', icon: '🔒', color: 'text-emerald-500' },
                            ].map((item) => (
                                <div key={item.year} className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 shadow-sm transition-all hover:shadow-md">
                                    <span className="text-xs font-bold text-gray-400">{item.year}</span>
                                    <span className={`font-space-grotesk text-sm font-black ${item.color}`}>{item.change}</span>
                                    <span className="text-xs text-gray-300">→</span>
                                    <span className="font-space-grotesk text-sm font-bold text-[#1A4D3E]">{item.value}</span>
                                    <span className="ml-auto text-lg">{item.icon}</span>
                                </div>
                            ))}
                        </div>

                        <p className="text-sm font-bold text-teal-600">✓ Gains never evaporate</p>
                    </div>

                    {/* Pillar 3: Upside Growth */}
                    <div className="indexed-card-3d scroll-reveal group relative overflow-hidden rounded-3xl bg-white p-8 md:p-10" style={{ transitionDelay: '300ms' }}>
                        <div className="indexed-pillar-bar absolute left-0 right-0 top-0 origin-left scale-x-0 group-hover:scale-x-100" />
                        <span className="pointer-events-none absolute right-4 top-2 font-space-grotesk text-[100px] font-black leading-none text-gray-50 md:text-[120px]">03</span>

                        <div className="indexed-icon-float relative mb-6 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 text-4xl shadow-indexed-sm" style={{ animationDelay: '2s' }}>
                            📈
                        </div>
                        <h3 className="mb-1 font-space-grotesk text-2xl font-black text-[#1A4D3E] md:text-3xl">Upside Growth</h3>
                        <p className="mb-5 text-sm font-bold text-emerald-500">Participate in Gains</p>
                        <p className="mb-8 leading-relaxed text-[#4A5565]">
                            Protection doesn&apos;t mean stagnation. Capture market growth with caps or uncapped strategies.
                        </p>

                        {/* Cap visual */}
                        <div className="mb-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-6 shadow-indexed-sm">
                            <div className="relative mx-auto h-36 w-full max-w-[200px]">
                                <div className="absolute left-0 right-0 top-1 flex items-center gap-2">
                                    <div className="h-px flex-1 border-t-2 border-dashed border-emerald-300" />
                                    <span className="text-[9px] font-black uppercase tracking-wider text-emerald-400">Cap</span>
                                </div>
                                <div className="absolute bottom-8 left-0 right-0 top-5 flex items-center justify-center rounded-xl bg-gradient-to-t from-emerald-100/80 to-emerald-50/50">
                                    <span className="font-space-grotesk text-lg font-black text-emerald-600">0% ↔ 12%+</span>
                                </div>
                                <div className="absolute bottom-6 left-0 right-0 flex items-center gap-2">
                                    <div className="h-0.5 flex-1 bg-emerald-500" />
                                    <span className="text-[9px] font-black uppercase tracking-wider text-emerald-500">0% Floor</span>
                                </div>
                            </div>
                            <div className="mt-2 space-y-2">
                                <p className="rounded-lg bg-white px-3 py-2 text-center text-xs text-gray-600 shadow-sm">
                                    <strong className="text-emerald-600">12% Cap:</strong> Market +30% → You +12%
                                </p>
                                <p className="rounded-lg bg-white px-3 py-2 text-center text-xs text-gray-600 shadow-sm">
                                    <strong className="text-emerald-600">Uncapped:</strong> Market +63% → You +63%
                                </p>
                            </div>
                        </div>

                        <p className="text-sm font-bold text-emerald-600">✓ Steady compound growth</p>
                    </div>
                </div>
            </div>
        </section>
    )
}
