'use client'

import React from 'react';
import { Percent, Activity, Bomb, ShieldCheck } from 'lucide-react';
import { useAssessmentModal } from '@/components/AssessmentModal';

const KILLERS = [
  {
    icon: <Percent className="text-evergreen" size={28} />,
    id: "01",
    label: "PROTOCOL 01: FEES",
    title: "The 2% Leak That Costs You Millions",
    copy: "A 2% fee over 30 years can consume up to 40% of your potential nest egg. That's not advice. That's wealth erosion by design.",
    stat: "63% don't know what they pay in fees."
  },
  {
    icon: <Activity className="text-evergreen" size={28} />,
    id: "02",
    label: "PROTOCOL 02: VOLATILITY",
    title: "The Myth of \"Buy and Hold\"",
    copy: "Market crashes cost you the one asset you can't recover: TIME. You shouldn't have to 'earn back' your own money after a crash.",
    stat: "Lose 50% → Need 100% Gain to Break Even"
  },
  {
    icon: <Bomb className="text-evergreen" size={28} />,
    id: "03",
    label: "PROTOCOL 03: TAXES",
    title: "The Ticking 401(k) Time Bomb",
    copy: "Tax-deferred accounts are forced partnerships with the IRS. As tax rates rise, your share of your own retirement shrinks.",
    stat: "How much of your portfolio is actually yours?"
  }
];

const SilentKillers: React.FC = () => {
  const { openModal } = useAssessmentModal();
  return (
    <section id="killers" className="py-40 bg-gradient-to-b from-[#1A4D3E] via-[#1f5e4c] to-[#1A4D3E] text-white relative overflow-hidden">
      {/* Background Graphic Texture */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 right-0 w-[80%] h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08)_0%,transparent_60%)]"></div>
        <div className="absolute bottom-0 left-0 w-[40%] h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent rotate-[20deg]"></div>
      </div>
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-4xl mb-32 scroll-reveal">
          <span className="text-white/80 text-[10px] font-black uppercase tracking-[0.5em] mb-8 block">Threat Identification</span>
          <h2 className="font-space text-5xl md:text-8xl font-black leading-[0.9] tracking-tighter">
            Why Your Wealth <br />
            Is Under <span className="text-outline text-white/50 italic">Attack.</span>
          </h2>
          <p className="mt-10 text-white/90 text-xl font-light max-w-3xl leading-relaxed">
            There are three silent killers eating your future alive. They don't make headlines, but they determine your lifestyle in 20 years.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {KILLERS.map((killer, idx) => (
            <div 
              key={idx} 
              className="glass p-10 md:p-12 rounded-[60px] flex flex-col group hover:-translate-y-4 transition-all duration-700 scroll-reveal"
              style={{ transitionDelay: `${idx * 150}ms` }}
            >
              <div className="flex justify-between items-start mb-16">
                <div className="w-16 h-16 bg-white rounded-[24px] flex items-center justify-center shadow-xl group-hover:rotate-6 transition-transform">
                  {killer.icon}
                </div>
                <span className="font-space text-7xl font-black text-white/[0.03] leading-none select-none">{killer.id}</span>
              </div>
              
              <h4 className="text-[9px] font-black uppercase tracking-[0.4em] text-white/70 mb-5">{killer.label}</h4>
              <h3 className="font-space text-2xl md:text-3xl font-bold mb-8 leading-tight tracking-tight uppercase">{killer.title}</h3>
              <p className="text-white/80 leading-relaxed mb-12 flex-grow text-sm">
                {killer.copy}
              </p>
              
              <div className="pt-8 border-t border-white/5">
                 <div className="flex items-center gap-4">
                   <div className="p-2 bg-white/5 rounded-lg"><ShieldCheck className="text-white/60" size={16} /></div>
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/80">{killer.stat}</span>
                 </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-40 text-center scroll-reveal">
          <p className="text-white/50 font-space text-[14vw] md:text-[11vw] font-black uppercase tracking-tighter leading-none select-none mb-4">
            RECLAIM CONTROL
          </p>
          <button onClick={openModal} className="btn-3d-light relative z-20 mt-[-6vw] px-14 py-8 text-evergreen rounded-2xl font-black uppercase tracking-widest text-xs">
            Schedule Your Risk Exposure Analysis
          </button>
        </div>
      </div>
    </section>
  );
};

export default SilentKillers;
