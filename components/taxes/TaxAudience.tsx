'use client'

const HIGH_PRIORITY = [
    { icon: '🏢', title: 'Business Owners', description: 'Variable income, high earning years, need for asset protection' },
    { icon: '💼', title: 'High-Income Professionals', description: '$250k+ household income, maxed out traditional vehicles' },
    { icon: '⏳', title: 'Pre-Retirees (55-65)', description: 'Last chance to reposition before RMDs begin' },
    { icon: '🏦', title: 'Large 401(k) Balances', description: '$500k+ facing significant future tax exposure' },
    { icon: '🗺️', title: 'High-Tax State Residents', description: 'Planning to retire in CA, NY, NJ, MA' },
    { icon: '👨‍👩‍👧‍👦', title: 'Legacy Planners', description: 'Wanting to pass wealth tax-efficiently to heirs' },
]

const STATE_TAXES = [
    { state: 'California', rate: '13.3%', color: 'bg-red-500' },
    { state: 'Hawaii', rate: '11.0%', color: 'bg-red-400' },
    { state: 'New York', rate: '10.9%', color: 'bg-amber-500' },
    { state: 'New Jersey', rate: '10.75%', color: 'bg-amber-400' },
    { state: 'Oregon', rate: '9.9%', color: 'bg-amber-300' },
]

const NO_TAX_STATES = ['Florida', 'Texas', 'Nevada', 'Washington', 'Tennessee', 'Alaska', 'Wyoming', 'South Dakota']

export default function TaxAudience() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-[#020806] via-[#0a1f1a] to-[#020806] py-24 md:py-40">
            <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
            <div className="indexed-mesh-bg pointer-events-none absolute inset-0" />

            <div className="relative mx-auto max-w-6xl px-6">
                <div className="grid gap-16 lg:grid-cols-2">
                    {/* Who Should Prioritize */}
                    <div>
                        <span className="mb-4 inline-block font-space-grotesk text-sm font-bold tracking-[0.2em] text-amber-400">
                            / WHO NEEDS THIS
                        </span>
                        <h2 className="scroll-reveal mb-8 font-space-grotesk text-3xl font-black tracking-tight text-white md:text-5xl">
                            Is Tax Planning Right for You?
                        </h2>

                        <div className="space-y-4">
                            {HIGH_PRIORITY.map((item, i) => (
                                <div
                                    key={item.title}
                                    className="scroll-reveal flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.03] p-4 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.05]"
                                    style={{ backdropFilter: 'blur(8px)', transitionDelay: `${i * 80}ms` }}
                                >
                                    <span className="text-2xl">{item.icon}</span>
                                    <div>
                                        <h4 className="font-space-grotesk text-sm font-bold text-white">{item.title}</h4>
                                        <p className="text-xs text-white/40">{item.description}</p>
                                    </div>
                                    <span className="ml-auto text-xs font-bold text-emerald-400">✓ ACT NOW</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* State Tax Considerations */}
                    <div>
                        <span className="mb-4 inline-block font-space-grotesk text-sm font-bold tracking-[0.2em] text-red-400">
                            / STATE TAXES
                        </span>
                        <h2 className="scroll-reveal mb-8 font-space-grotesk text-3xl font-black tracking-tight text-white md:text-5xl">
                            Where You Retire Matters
                        </h2>

                        {/* Highest tax states */}
                        <div className="mb-8 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6" style={{ backdropFilter: 'blur(16px)' }}>
                            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-red-400/60">Highest Tax States</p>
                            <div className="space-y-3">
                                {STATE_TAXES.map((item) => (
                                    <div key={item.state} className="flex items-center gap-3">
                                        <span className="w-24 text-sm text-white/60">{item.state}</span>
                                        <div className="flex-1">
                                            <div className={`indexed-bar-grow h-6 rounded-lg ${item.color}`} style={{ width: `${parseFloat(item.rate) / 13.3 * 100}%` }} />
                                        </div>
                                        <span className="w-14 text-right font-space-grotesk text-sm font-bold text-white">{item.rate}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* No tax states */}
                        <div className="mb-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.05] p-6" style={{ backdropFilter: 'blur(16px)' }}>
                            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-emerald-400/60">No State Income Tax</p>
                            <div className="flex flex-wrap gap-2">
                                {NO_TAX_STATES.map((state) => (
                                    <span key={state} className="rounded-full border border-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400/80">
                                        {state}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Impact example */}
                        <div className="scroll-reveal rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6" style={{ backdropFilter: 'blur(16px)' }}>
                            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-white/30">$100k Withdrawal Comparison</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-xl bg-red-500/10 p-4 text-center">
                                    <p className="text-xs text-red-400/60">Tax-Deferred (CA)</p>
                                    <p className="mt-1 font-space-grotesk text-2xl font-black text-red-400">$49,700</p>
                                </div>
                                <div className="rounded-xl bg-emerald-500/10 p-4 text-center">
                                    <p className="text-xs text-emerald-400/60">Tax-Exempt</p>
                                    <p className="mt-1 font-space-grotesk text-2xl font-black text-emerald-400">$100,000</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
