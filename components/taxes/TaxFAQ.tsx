'use client'

import { useState } from 'react'
import { TAX_FAQ_ITEMS } from '@/lib/faq-data'

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
                    {TAX_FAQ_ITEMS.map((faq, i) => (
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
