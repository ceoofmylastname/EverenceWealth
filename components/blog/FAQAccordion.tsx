'use client'

interface FAQ {
    question: string
    answer: string
}

export default function FAQAccordion({ faqs }: { faqs: FAQ[] }) {
    return (
        <div className="space-y-4">
            {faqs.map((faq, index) => (
                <details
                    key={index}
                    className="group rounded-xl border border-[#1A4D3E]/10 bg-white shadow-sm transition-all hover:shadow-md hover:shadow-[#1A4D3E]/5"
                >
                    <summary className="flex cursor-pointer list-none items-center justify-between p-6">
                        <h3 className="pr-8 text-lg font-semibold text-[#1A4D3E] group-open:text-[#10B981]">
                            {faq.question}
                        </h3>
                        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-[#1A4D3E]/5 text-xl font-bold text-[#1A4D3E] transition-all group-open:rotate-45 group-open:bg-[#1A4D3E] group-open:text-white">
                            +
                        </div>
                    </summary>

                    <div className="border-t border-[#1A4D3E]/5 px-6 pb-6 pt-4">
                        <p className="leading-relaxed text-[#4A5565]">
                            {faq.answer}
                        </p>
                    </div>
                </details>
            ))}
        </div>
    )
}
