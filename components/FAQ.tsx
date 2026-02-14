
import React from 'react';
import { FAQ_ITEMS } from '@/lib/faq-data';

const FAQ: React.FC = () => {
  return (
    <section className="py-40 bg-gradient-to-b from-emerald-50/20 via-white to-white text-evergreen relative z-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-24 scroll-reveal">
          <h2 className="font-space text-5xl md:text-8xl font-black leading-[0.9] tracking-tighter">
            Common Questions
          </h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {FAQ_ITEMS.map((faq, i) => (
            <div key={i} className="p-10 bg-slate/5 rounded-[40px] border border-slate/10 scroll-reveal" style={{ transitionDelay: `${i * 150}ms` }}>
              <h4 className="font-space text-2xl font-bold mb-6 italic">"{faq.question}"</h4>
              <p className="text-lg text-slate leading-relaxed">
                <span className="font-black uppercase text-[10px] tracking-widest text-evergreen block mb-2">The Truth</span>
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
