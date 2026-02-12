
import React from 'react';
/* Added Activity to the lucide-react imports */
import { ShieldCheck, TrendingUp, Zap, Users, Gem, Activity } from 'lucide-react';

const IndexedAdvantage: React.FC = () => {
  return (
    <section className="py-40 bg-white text-evergreen relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-24 items-center mb-32">
          <div className="scroll-reveal">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-evergreen/40 mb-6 block">Product Innovation</span>
            <h2 className="font-space text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter mb-10">
              Market Gains <br />
              Without <span className="italic">Market Risk</span>
            </h2>
            <p className="text-xl text-slate/70 leading-relaxed mb-12">
              What if you could capture market upside without the downside? You can. It's called <span className="text-evergreen font-bold">Indexed Universal Life (IUL)</span>. Consistent, tax-free growth without the volatility that destroys traditional portfolios.
            </p>
            
            <div className="grid grid-cols-2 gap-8">
              {[
                { icon: <TrendingUp size={20} />, label: "0% Floor Protection" },
                { icon: <ShieldCheck size={20} />, label: "Tax-Free Growth" },
                { icon: <Zap size={20} />, label: "Living Benefits" },
                { icon: <Gem size={20} />, label: "Death Benefit" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-slate/5">
                  <div className="text-evergreen">{item.icon}</div>
                  <span className="text-[10px] font-black uppercase tracking-widest leading-tight">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="scroll-reveal" style={{ transitionDelay: '300ms' }}>
            <div className="bg-evergreen text-white p-12 rounded-[50px] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-white/20 via-white to-white/20"></div>
              <h4 className="font-space text-2xl font-bold mb-10 flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Activity size={16} />
                </div>
                The Performance Gap
              </h4>
              
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-4 text-[10px] font-black uppercase tracking-[0.3em] opacity-40">
                  <span>S&P 500 Market</span>
                  <span className="text-right">IUL Strategy</span>
                </div>
                
                {[
                  { m: "+30%", i: "+12% (capped)", c: "text-green-400" },
                  { m: "-40% (2008)", i: "0% (floor)", c: "text-red-400" },
                  { m: "+25%", i: "+12%", c: "text-green-400" },
                  { m: "-20%", i: "0%", c: "text-red-400" }
                ].map((row, idx) => (
                  <div key={idx} className="flex items-center justify-between py-4 border-b border-white/10">
                    <span className={`text-xl font-space font-bold ${row.c}`}>{row.m}</span>
                    <div className="flex-grow border-t border-dashed border-white/20 mx-6"></div>
                    <span className="text-xl font-space font-bold">+12% / 0%</span>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-6 bg-white/10 rounded-3xl text-center">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Result</span>
                <p className="text-2xl font-space font-bold italic mt-2">Consistent Compound Growth</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-light-gray p-16 rounded-[60px] scroll-reveal">
          <div className="text-center mb-16">
            <h3 className="font-space text-4xl font-black tracking-tight">Who This Is For</h3>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              "High-income professionals",
              "Business owners who hate volatility",
              "Families with $100k+ in deferred plans",
              "Legacy-focused parents"
            ].map((text, i) => (
              <div key={i} className="text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-evergreen/5 text-evergreen flex items-center justify-center mx-auto">
                  <Users size={24} />
                </div>
                <p className="font-bold text-xs uppercase tracking-widest">{text}</p>
              </div>
            ))}
          </div>
          <div className="mt-20 text-center">
            <button className="px-16 py-8 bg-evergreen text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:scale-105 transition-all shadow-xl">
              Model Your Indexed Strategy
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IndexedAdvantage;
