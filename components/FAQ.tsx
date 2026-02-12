
import React from 'react';

const FAQS = [
  {
    q: "Isn't a 401(k) match free money?",
    a: "It's a match, not free money. Take it, but don't confuse it with a strategy. That match comes with locked-in tax liability, RMDs, and no access until 59½."
  },
  {
    q: "Can't I just do this myself with index funds?",
    a: "You could, but tools aren't strategies. A DIY approach works until something goes wrong with your tax sequencing or risk management."
  },
  {
    q: "Isn't life insurance just for when I die?",
    a: "Not modern indexed life insurance. It's a tax-free growth vehicle and source of accessible cash flow while you're ALIVE."
  }
];

const FAQ: React.FC = () => {
  return (
    <section className="py-40 bg-white text-evergreen relative z-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-24 scroll-reveal">
          <h2 className="font-space text-5xl md:text-8xl font-black leading-[0.9] tracking-tighter">
            Common Questions
          </h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {FAQS.map((faq, i) => (
            <div key={i} className="p-10 bg-slate/5 rounded-[40px] border border-slate/10 scroll-reveal" style={{ transitionDelay: `${i * 150}ms` }}>
              <h4 className="font-space text-2xl font-bold mb-6 italic">"{faq.q}"</h4>
              <p className="text-lg text-slate leading-relaxed">
                <span className="font-black uppercase text-[10px] tracking-widest text-evergreen block mb-2">The Truth</span>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
