
import React from 'react';
import { ArrowRight } from 'lucide-react';

const CTA: React.FC = () => {
  return (
    <section className="py-60 bg-[#020806] text-white relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-32 scroll-reveal">
          <h2 className="font-space text-6xl md:text-9xl font-black leading-[0.8] tracking-tighter mb-10">
            Two Paths <br />
            Forward
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto items-stretch">
          <div className="glass-card p-12 md:p-20 rounded-[60px] opacity-40 scroll-reveal">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40 mb-10">Path #1: The Gamble</h4>
            <ul className="space-y-6">
              {["Keep hoping the market cooperates", "Hope tax rates stay low", "Hope fees don't eat your future", "Hope nothing unexpected happens"].map((t, i) => (
                <li key={i} className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div> {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card p-12 md:p-20 rounded-[60px] border-evergreen shadow-2xl scroll-reveal" style={{ transitionDelay: '200ms' }}>
             <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-evergreen mb-10">Path #2: Take Control</h4>
             <ul className="space-y-6 mb-16">
              {["Understand where you stand", "Build a tax-efficient strategy", "Protect against volatility", "Create accessible cash flow"].map((t, i) => (
                <li key={i} className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest">
                  <div className="w-1.5 h-1.5 bg-evergreen rounded-full"></div> {t}
                </li>
              ))}
            </ul>
            <button className="w-full py-8 bg-white text-evergreen rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-all flex items-center justify-center gap-4">
               Stop Hoping. Start Knowing.
               <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
