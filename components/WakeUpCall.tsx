
import React from 'react';
import { AlertCircle, ArrowDown } from 'lucide-react';

const WakeUpCall: React.FC = () => {
  return (
    <section className="py-40 bg-gradient-to-b from-white via-white to-emerald-50/40 text-evergreen relative z-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-4 mb-8 scroll-reveal">
            <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
              <AlertCircle size={32} />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.4em] text-red-600/60">Urgent: Fiduciary Analysis</span>
          </div>
          
          <h2 className="font-space text-5xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-16 scroll-reveal">
            Your Retirement Account Has a <br />
            <span className="text-red-600 italic">Silent Partner:</span> The IRS
          </h2>

          <div className="grid md:grid-cols-2 gap-20 items-start">
            <div className="space-y-8 scroll-reveal" style={{ transitionDelay: '200ms' }}>
              <p className="text-2xl md:text-3xl font-light leading-relaxed text-slate">
                Every dollar in your 401(k) comes with strings attached. 
                <span className="font-bold text-evergreen"> You don't own that money.</span> Not really.
              </p>
              <p className="text-lg text-slate/70 leading-relaxed">
                You're renting it from the government until they decide to collect their share. And guess what? They always collect. 
                The tax-deferred trap means you get a small break today for a massive disaster tomorrow.
              </p>
              <div className="p-10 bg-evergreen text-white rounded-[40px] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-700"></div>
                <p className="text-3xl font-space font-bold leading-tight relative z-10">
                  "A tax deduction today is not worth a tax disaster tomorrow."
                </p>
              </div>
            </div>

            <div className="space-y-12 scroll-reveal" style={{ transitionDelay: '400ms' }}>
              <div className="space-y-6">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-evergreen/40">The Tax-Deferred Trap</h4>
                <div className="space-y-4">
                  {[
                    "You get a small tax break today",
                    "The IRS gets a massive payday tomorrow",
                    "You pray that tax rates stay low"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-slate/5 border border-slate/10">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      <span className="font-bold text-sm uppercase tracking-wider">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 border-2 border-dashed border-red-100 rounded-[40px] bg-red-50/30">
                <div className="text-4xl font-space font-black text-red-600 mb-2">80-90%</div>
                <p className="text-sm font-bold uppercase tracking-widest text-red-900/40">
                  Locked in qualified plans. Forced withdrawals at age 73.
                </p>
              </div>

              <button className="group flex items-center gap-6 text-evergreen font-black uppercase tracking-[0.3em] text-sm hover:gap-10 transition-all">
                Discover Your True Tax Exposure
                <div className="p-4 bg-evergreen text-white rounded-full transition-transform group-hover:rotate-45">
                  <ArrowDown size={24} />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WakeUpCall;
