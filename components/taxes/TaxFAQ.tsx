'use client'

import { useState } from 'react'

const FAQS = [
    {
        question: 'What\'s the difference between tax-deferred and tax-exempt?',
        answer: 'Tax-Deferred (401k, Traditional IRA): You get a tax deduction today, but pay taxes on withdrawals later at ordinary income rates. RMDs required at age 72-73. Tax-Exempt (Roth, SER): You pay taxes on contributions today, but withdrawals are 100% tax-free. No RMDs.',
    },
    {
        question: 'Can I move money from my 401(k) to a Roth without penalty?',
        answer: 'Yes, through a Roth conversion. You\'ll pay income tax on the converted amount in the year of conversion, but the money then grows tax-free forever. Best done during lower-income years, market downturns (convert at lower values), or before RMDs begin.',
    },
    {
        question: 'What is the SER, and how is it different from a Roth IRA?',
        answer: 'SER (Strategic Equity Resource) is an indexed life insurance strategy that functions like a Roth for retirement income. Key advantages over Roth: no income limitations, no contribution limits, asset protection from lawsuits/creditors, and market participation with a 0% floor. Best for high-net-worth individuals or those who\'ve maxed out Roth options.',
    },
    {
        question: 'What happens if I don\'t take my RMD?',
        answer: 'Penalty: Up to 50% of the amount you should have withdrawn, plus you still owe income tax on the withdrawal. Example: If your RMD is $40,000 and you miss it, you could owe a $20,000 penalty + ~$15,000 in taxes = $35,000 total cost.',
    },
    {
        question: 'Should I stop contributing to my 401(k)?',
        answer: 'Not necessarily. The employer match is valuable. Strategy: (1) Contribute enough to get the full match, (2) then prioritize tax-exempt vehicles (Roth, SER, HSA), and (3) reposition existing 401(k) balances strategically.',
    },
    {
        question: 'When is the best time to do a Roth conversion?',
        answer: 'Ideal scenarios: Lower-income year (sabbatical, between jobs, early retirement), market downturn (convert at lower account values), before age 72 (before RMDs start), or before moving to a high-tax state.',
    },
    {
        question: 'How much should I have in each tax bucket?',
        answer: 'General framework: Emergency funds in Taxable (liquid access), retirement base in Tax-Exempt (maximize tax-free income), employer match in Tax-Deferred (don\'t leave free money), and legacy wealth in Tax-Exempt (pass tax-free to heirs). Ideal allocation depends on your age, income, goals, and risk tolerance.',
    },
]

export default function TaxFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null)

    return (
        <section className="relative bg-white py-24 md:py-40">
            <div className="indexed-mesh-bg pointer-events-none absolute inset-0" />
            <div className="relative mx-auto max-w-3xl px-6">
                {/* Header */}
                <div className="mb-16 text-center">
                    <span className="mb-4 inline-block font-space-grotesk text-sm font-bold tracking-[0.2em] text-emerald-600">
                        / FAQ
                    </span>
                    <h2 className="scroll-reveal font-space-grotesk text-4xl font-black tracking-tight text-[#1A4D3E] md:text-6xl">
                        Questions & Answers
                    </h2>
                </div>

                {/* FAQ Accordion */}
                <div className="space-y-4">
                    {FAQS.map((faq, i) => (
                        <div
                            key={i}
                            className="scroll-reveal indexed-card-3d overflow-hidden rounded-2xl border border-gray-200 bg-white"
                            style={{ transitionDelay: `${i * 60}ms` }}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-gray-50"
                            >
                                <span className="pr-4 font-space-grotesk text-sm font-bold text-[#1A4D3E] md:text-base">{faq.question}</span>
                                <span className={`flex-shrink-0 text-xl text-emerald-500 transition-transform duration-300 ${openIndex === i ? 'rotate-45' : ''}`}>+</span>
                            </button>
                            <div className={`overflow-hidden transition-all duration-500 ${openIndex === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="border-t border-gray-100 px-6 py-5">
                                    <p className="text-sm leading-relaxed text-[#4A5565]">{faq.answer}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
