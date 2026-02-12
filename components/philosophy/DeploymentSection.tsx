'use client'

const DEPLOYMENT_TEST = [
    'Does this increase my earning capacity?',
    'Does this generate cash flow?',
    'Does this reduce my tax exposure?',
    'Does this protect my Human Life Value?',
]

export default function DeploymentSection() {
    return (
        <section className="indexed-mesh-bg relative bg-gradient-to-b from-white to-emerald-50/50 py-24 md:py-40">
            <div className="mx-auto max-w-6xl px-6">
                {/* Header */}
                <div className="mb-20 text-center">
                    <span className="mb-4 inline-block font-space-grotesk text-xs font-bold tracking-[0.25em] text-emerald-600">
                        / DEPLOYMENT VS. ACCUMULATION
                    </span>
                    <h2 className="scroll-reveal relative mx-auto mb-6 inline-block font-space-grotesk text-4xl font-black tracking-tight text-[#1A4D3E] md:text-6xl lg:text-8xl">
                        Don&apos;t Just Save. Deploy.
                        <svg className="indexed-slash-underline absolute -bottom-2 left-0 w-full md:-bottom-4" viewBox="0 0 300 10" preserveAspectRatio="none" height="10">
                            <path d="M0 8 L300 2" stroke="url(#slashGradDeploy)" strokeWidth="4" fill="none" strokeLinecap="round" />
                            <defs>
                                <linearGradient id="slashGradDeploy" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#1A4D3E" />
                                    <stop offset="50%" stopColor="#10B981" />
                                    <stop offset="100%" stopColor="#34D399" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </h2>
                    <p className="scroll-reveal mx-auto mt-10 max-w-2xl text-lg text-[#4A5565]">
                        Traditional doctrine tells you to delay enjoyment and park your money in institutions that benefit from your capital. We advocate for <strong className="text-[#1A4D3E]">Deployment</strong>.
                    </p>
                </div>

                {/* Destructive vs Productive */}
                <div className="grid gap-8 md:grid-cols-2">
                    {/* Destructive */}
                    <div className="indexed-card-3d scroll-reveal rounded-3xl border border-red-100 bg-white p-8 md:p-10">
                        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-3xl">
                            🔻
                        </div>
                        <h3 className="mb-2 font-space-grotesk text-2xl font-black text-red-600">Destructive Expenses</h3>
                        <p className="mb-6 text-sm text-red-400">Capital that drains wealth</p>
                        <div className="space-y-3">
                            {[
                                'Borrowing to consume',
                                'Depreciating assets',
                                'Lifestyle inflation without income to support it',
                            ].map((item) => (
                                <div key={item} className="flex items-center gap-3 rounded-xl bg-red-50 px-4 py-3 text-sm shadow-sm">
                                    <span className="text-red-500">&#10005;</span>
                                    <span className="font-medium text-gray-700">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Productive */}
                    <div className="indexed-card-3d scroll-reveal rounded-3xl border border-emerald-100 bg-white p-8 md:p-10">
                        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-3xl">
                            🔺
                        </div>
                        <h3 className="mb-2 font-space-grotesk text-2xl font-black text-emerald-700">Productive Expenses</h3>
                        <p className="mb-6 text-sm text-emerald-500">Capital that creates wealth</p>
                        <div className="space-y-3">
                            {[
                                'Investing in skills that increase earning capacity',
                                'Building businesses that generate cash flow',
                                'Acquiring assets that produce income',
                            ].map((item) => (
                                <div key={item} className="flex items-center gap-3 rounded-xl bg-emerald-50 px-4 py-3 text-sm shadow-sm">
                                    <span className="font-bold text-emerald-500">&#10003;</span>
                                    <span className="font-medium text-gray-700">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Key insight */}
                <div className="scroll-reveal mx-auto mt-12 max-w-3xl">
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-8 text-center" style={{ backdropFilter: 'blur(8px)' }}>
                        <p className="text-lg text-[#4A5565]">
                            If an expense can become a profit center, it is not a cost&mdash;<strong className="text-[#1A4D3E]">it is an investment</strong>.
                        </p>
                    </div>
                </div>

                {/* Deployment Test */}
                <div className="scroll-reveal mx-auto mt-16 max-w-2xl">
                    <h3 className="mb-8 text-center font-space-grotesk text-2xl font-black text-[#1A4D3E] md:text-3xl">The Deployment Test</h3>
                    <p className="mb-6 text-center text-[#4A5565]">Before any major financial decision, ask:</p>
                    <div className="space-y-4">
                        {DEPLOYMENT_TEST.map((question, i) => (
                            <div key={question} className="indexed-card-3d flex items-center gap-4 rounded-2xl bg-white px-6 py-4 shadow-indexed-sm">
                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 font-space-grotesk text-sm font-black text-emerald-600">
                                    {i + 1}
                                </span>
                                <span className="font-medium text-[#4A5565]">{question}</span>
                            </div>
                        ))}
                    </div>
                    <p className="mt-6 text-center text-sm font-bold text-[#1A4D3E]">
                        If the answer is no to all four, reconsider.
                    </p>
                </div>
            </div>
        </section>
    )
}
