
import React from 'react';
import { HeartPulse, Repeat, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

const WealthPhilosophy: React.FC = () => {
  return (
    <section id="philosophy" className="py-40 bg-gradient-to-b from-[#020806] via-[#0a1f1a] to-[#020806] text-white relative overflow-hidden">
      {/* Background imagery layer */}
      <div className="absolute inset-0 z-0 opacity-[0.06] pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1542044896530-05d85be9b11a?auto=format&fit=crop&q=80&w=2000"
          className="w-full h-full object-cover"
          alt="Modern Architecture"
        />
      </div>
      {/* Decorative gradient orbs */}
      <div className="absolute top-0 left-0 w-[700px] h-[700px] bg-[radial-gradient(ellipse,rgba(26,77,62,0.15)_0%,transparent_60%)] pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse,rgba(236,218,118,0.05)_0%,transparent_50%)] pointer-events-none"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        
        {/* Cash Flow Section */}
        <div className="mb-60">
          <div className="max-w-4xl mb-24 scroll-reveal">
            <span className="text-evergreen font-black uppercase tracking-[0.6em] text-[10px] mb-8 block">The Sovereign Standard</span>
            <h2 className="font-space text-5xl md:text-8xl font-black leading-[0.9] tracking-tighter">
              Net Worth Is <br />
              <span className="italic text-evergreen animate-text-gradient bg-gradient-to-r from-evergreen via-white/80 to-evergreen bg-clip-text text-transparent">Vanity.</span>
            </h2>
            <p className="mt-10 text-white/80 text-2xl md:text-3xl font-light max-w-3xl leading-relaxed">
              Wall Street wants you obsessed with a balance you can't touch. <span className="text-white font-bold underline decoration-evergreen/50 underline-offset-8">True wealth is measured in CASH FLOW.</span>
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 items-stretch">
            <div className="glass p-12 md:p-16 rounded-[60px] border-white/5 scroll-reveal group hover:bg-white/[0.04] transition-all duration-700">
              <div className="flex items-center gap-6 mb-12">
                <div className="w-16 h-16 rounded-[24px] bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20 group-hover:scale-110 transition-transform">
                  <Lock size={32} />
                </div>
                <h3 className="font-space text-3xl font-bold tracking-tight uppercase">The Golden Cage</h3>
              </div>
              <ul className="space-y-6 mb-14">
                {["Locked by legislation", "Subject to market timing", "Inaccessible without penalty", "Taxed at unknown future rates"].map((t, i) => (
                  <li key={i} className="flex items-center gap-5 font-black text-[11px] uppercase tracking-[0.3em] text-white/70 group-hover:text-white/80">
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div> {t}
                  </li>
                ))}
              </ul>
              <div className="p-8 bg-white/[0.03] rounded-[32px] border border-white/5">
                <p className="text-lg text-white/90 font-medium leading-relaxed italic">
                  "You're 'worth' $2M but can't buy a car without asking for permission. That's not wealth. That's a trap."
                </p>
              </div>
            </div>

            <div className="glass p-12 md:p-16 rounded-[60px] border-evergreen/30 bg-evergreen/[0.03] scroll-reveal group hover:bg-evergreen/[0.08] transition-all duration-700" style={{ transitionDelay: '200ms' }}>
              <div className="flex items-center gap-6 mb-12">
                <div className="w-16 h-16 rounded-[24px] bg-evergreen text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(26,77,62,0.4)]">
                  <Repeat size={32} />
                </div>
                <h3 className="font-space text-3xl font-bold tracking-tight uppercase">Cash Flow Mobility</h3>
              </div>
              <ul className="space-y-6 mb-14">
                {["Available on your terms", "Immunized from volatility", "Zero RMD mandates", "Predictable 0% tax future"].map((t, i) => (
                  <li key={i} className="flex items-center gap-5 font-black text-[11px] uppercase tracking-[0.3em] text-white/80">
                    <div className="w-2 h-2 bg-evergreen rounded-full shadow-[0_0_10px_rgba(26,77,62,1)]"></div> {t}
                  </li>
                ))}
              </ul>
              <div className="p-8 bg-white/5 rounded-[32px] border border-white/10">
                <p className="text-lg text-white font-medium leading-relaxed italic">
                  "Total control over your capital. This is what financial freedom actually feels like."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Human Life Value Infographic Section */}
        <div className="relative pt-20">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <div className="scroll-reveal">
              <span className="text-evergreen font-black uppercase tracking-[0.6em] text-[10px] mb-8 block">The Economic Engine</span>
              <h2 className="font-space text-5xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-10">
                You Are Your <br />
                <span className="italic">Greatest Asset.</span>
              </h2>
              <p className="text-2xl font-light text-white/80 leading-relaxed mb-12">
                Most people insure their car better than their own ability to produce income. If you earn $150k and work for 20 more years, <span className="text-white font-bold">you are a $3,000,000 asset.</span>
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: <HeartPulse className="text-evergreen" />, text: "Living Benefits" },
                  { icon: <ShieldCheck className="text-evergreen" />, text: "Chronic Illness" },
                  { icon: <ShieldCheck className="text-evergreen" />, text: "Critical Illness" },
                  { icon: <ArrowRight className="text-evergreen" />, text: "Tax-Free Transfer" }
                ].map((item, i) => (
                   <div key={i} className="flex items-center gap-4 p-5 glass rounded-[24px] border-white/5 group hover:border-evergreen/40 transition-colors">
                     <div className="p-3 bg-evergreen/10 rounded-xl group-hover:scale-110 transition-transform">{item.icon}</div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-white/90">{item.text}</span>
                   </div>
                ))}
              </div>
            </div>
            
            <div className="scroll-reveal" style={{ transitionDelay: '300ms' }}>
              <div className="p-16 rounded-[80px] bg-white text-evergreen shadow-[0_50px_100px_-20px_rgba(255,255,255,0.1)] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-evergreen/[0.02] rounded-full translate-x-20 -translate-y-20"></div>
                
                <h4 className="font-space text-2xl font-black uppercase tracking-tighter mb-16 text-center">Engine Valuation Analysis</h4>
                
                <div className="space-y-12 mb-16">
                  <div className="flex justify-between items-end border-b border-evergreen/10 pb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Estimated Annual Income</span>
                    <span className="text-3xl font-space font-black">$150,000</span>
                  </div>
                  <div className="flex justify-between items-end border-b border-evergreen/10 pb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest opacity-40">Career Duration (Years)</span>
                    <span className="text-3xl font-space font-black">20</span>
                  </div>
                </div>

                <div className="text-center py-10 bg-evergreen/5 rounded-[40px] border border-evergreen/10">
                   <div className="text-[10px] uppercase tracking-[0.4em] font-black opacity-40 mb-3">Total Economic Value</div>
                   <div className="text-6xl md:text-8xl font-space font-black text-evergreen tracking-tighter leading-none">$3.0M</div>
                </div>

                <p className="text-center mt-12 text-sm font-bold uppercase tracking-widest opacity-40">
                  Protect what you haven't earned yet.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default WealthPhilosophy;
