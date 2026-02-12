
import React from 'react';
import { Eye, CheckCircle, Clock, ShieldCheck } from 'lucide-react';

const Assessment: React.FC = () => {
  return (
    <section className="py-40 bg-[#020806] text-white relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="glass-card p-12 md:p-24 rounded-[60px] border-white/5 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="scroll-reveal">
              <div className="p-4 bg-evergreen/20 text-evergreen w-fit rounded-3xl mb-10">
                <Eye size={40} />
              </div>
              <h2 className="font-space text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter mb-8">
                What's Your <br />
                Financial Blind Spot?
              </h2>
              <p className="text-xl text-white/50 font-light leading-relaxed mb-12">
                The Financial Needs Assessment (FNA) is a comprehensive analysis of your position, your future, and your hidden opportunities. <span className="text-white font-bold italic">Most people don't need more products. They need more clarity.</span>
              </p>
              
              <div className="space-y-6">
                {[
                  "Your True Tax Bill",
                  "Your Fee Drag Analysis",
                  "Your True Risk Exposure",
                  "Your Retirement Gap"
                ].map((text, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <CheckCircle className="text-evergreen" size={20} />
                    <span className="text-[11px] font-black uppercase tracking-widest">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="scroll-reveal" style={{ transitionDelay: '300ms' }}>
              <div className="p-12 bg-white rounded-[50px] text-evergreen shadow-2xl">
                 <div className="flex items-center gap-4 mb-10">
                    <ShieldCheck size={24} className="text-evergreen/40" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Complimentary Service</span>
                 </div>
                 
                 <div className="mb-12">
                    <div className="text-sm font-black uppercase tracking-widest text-evergreen/40 mb-2">Time Investment</div>
                    <div className="flex items-center gap-3 text-3xl font-space font-black">
                       <Clock /> 60-90 MINUTES
                    </div>
                 </div>

                 <p className="text-lg leading-relaxed mb-10 text-slate italic">
                   "You can't make good decisions with bad information."
                 </p>

                 <button className="w-full py-8 bg-evergreen text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-xl">
                   Schedule Your Assessment
                 </button>
                 <p className="text-center mt-6 text-[10px] uppercase font-bold text-evergreen/30 tracking-[0.2em]">
                   Available via Zoom or in person (SF)
                 </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Assessment;
