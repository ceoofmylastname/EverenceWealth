'use client'

import React, { useState, useEffect } from 'react';
import { useAssessmentModal } from '@/components/AssessmentModal';

const Hero: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const { openModal } = useAssessmentModal();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  const progress = Math.min(scrollY / 800, 1);
  const textScale = 1 + progress * 0.05;
  const textOpacity = 1 - progress * 1.5;

  return (
    <section className="relative h-screen bg-gradient-to-b from-[#020806] via-[#071a14] to-[#020806] w-full overflow-hidden flex flex-col">
      {/* Decorative Side Text - Professional Editorial Style */}
      <div className="hidden xl:flex fixed left-8 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-12 opacity-10 pointer-events-none">
        <span className="[writing-mode:vertical-lr] rotate-180 text-[10px] font-black uppercase tracking-[1em] text-white font-sans">
          WEALTH ARCHITECTURE
        </span>
        <div className="w-[1px] h-32 bg-white/20"></div>
        <span className="text-xs font-black text-white font-sans">01</span>
      </div>

      <div className="hidden xl:flex fixed right-8 top-1/2 -translate-y-1/2 z-30 flex-col items-center gap-12 opacity-10 pointer-events-none">
        <span className="text-xs font-black text-white font-sans">2026</span>
        <div className="w-[1px] h-32 bg-white/20"></div>
        <span className="[writing-mode:vertical-lr] text-[10px] font-black uppercase tracking-[1em] text-white font-sans">
          STRATEGIC FIDUCIARY
        </span>
      </div>

      {/* Background Atmosphere */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160vw] h-[160vw] bg-[radial-gradient(circle_at_center,rgba(26,77,62,0.25)_0%,transparent_60%)]"></div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_top_right,rgba(236,218,118,0.06)_0%,transparent_50%)]"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.08)_0%,transparent_50%)]"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-between h-full pt-24 pb-10 px-6 overflow-hidden">
        
        {/* Content Container */}
        <div 
          className="flex flex-col items-center text-center w-full max-w-7xl mx-auto flex-1 justify-center gap-4 md:gap-6"
          style={{ opacity: textOpacity, transform: `scale(${textScale})` }}
        >
          {/* Top Badge */}
          <div className="overflow-hidden">
            <div className={`px-4 md:px-5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
              <span className="block text-white/80 uppercase tracking-[0.4em] md:tracking-[0.8em] text-[7px] md:text-[9px] font-black font-sans">
                ESTABLISHED 1998 • INDEPENDENT FIDUCIARY
              </span>
            </div>
          </div>

          {/* Headline Stack */}
          <div className="font-sans font-extrabold text-white leading-none tracking-tighter flex flex-col items-center select-none w-full">
            {/* BRIDGE THE */}
            <div className="flex gap-2 md:gap-6 items-end mb-1">
               <h1 className={`text-[11vw] md:text-[7.5vw] font-black hero-glow leading-[0.8] transition-all duration-[1200ms] cubic-bezier(0.16, 1, 0.3, 1) ${isLoaded ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
                BRIDGE
              </h1>
              <span className={`italic font-extralight text-white/70 text-[5vw] md:text-[3vw] mb-[0.8vw] transition-all duration-[1200ms] delay-200 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                the
              </span>
            </div>
            
            {/* RETIREMENT */}
            <div className="relative mb-1">
              <h2 className={`text-[11vw] md:text-[9.5vw] font-black leading-[0.8] text-transparent bg-clip-text animate-text-gradient bg-gradient-to-r from-evergreen via-white via-evergreen/40 to-white transition-all duration-[1500ms] delay-500 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                RETIREMENT
              </h2>
            </div>

            {/* GAP */}
            <div className={`transition-all duration-1200 delay-700 ${isLoaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-90'}`}>
              <h3 className="text-[13vw] md:text-[10.5vw] font-black leading-[0.8] text-outline-heavy text-white hover:text-white/5 transition-colors duration-500 cursor-default">GAP</h3>
            </div>
          </div>

          {/* Subtext Area */}
          <div className={`max-w-4xl transition-all duration-1000 delay-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
            <p className="text-white font-sans text-lg md:text-3xl font-light mb-3 leading-tight tracking-tight">
              Stop funding Wall Street's wealth. <br />
              <span className="text-evergreen font-black italic">Start building yours.</span>
            </p>
            <p className="text-white/70 text-[7px] md:text-[10px] uppercase tracking-[0.3em] font-medium leading-relaxed max-w-md mx-auto font-sans">
              You've been sold a myth. Save and hope? <br className="hidden md:block" /> That's a gamble. We reclaim control.
            </p>
          </div>
        </div>

        {/* Tactical HUD */}
        <div className={`w-full max-w-4xl px-2 transition-all duration-[1500ms] delay-[1200ms] ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="glass rounded-[24px] md:rounded-[40px] p-4 md:p-6 lg:p-7 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8 border-white/5 shadow-2xl">
            <div className="flex flex-col items-center md:items-start">
               <span className="text-[7px] md:text-[9px] text-white/60 uppercase tracking-[0.4em] font-black mb-1 font-sans">System Status</span>
               <div className="flex items-center gap-2">
                 <div className="w-1.5 h-1.5 bg-evergreen rounded-full animate-ping"></div>
                 <span className="text-white font-bold text-[8px] md:text-[10px] uppercase tracking-[0.2em] font-sans">Analysis Active</span>
               </div>
            </div>

            <div className="hidden md:block h-10 w-[1px] bg-white/10"></div>

            <div className="flex flex-col items-center text-center">
               <span className="text-[7px] md:text-[9px] text-white/60 uppercase tracking-[0.4em] font-black mb-1 font-sans">Current Protocol</span>
               <span className="text-white font-sans text-xs md:text-base font-bold">Tax-Free Bucket Optimization</span>
            </div>

            <button onClick={openModal} className="btn-3d-light group relative w-full md:w-auto px-6 md:px-8 py-3 md:py-4 text-evergreen rounded-xl md:rounded-2xl font-black uppercase tracking-[0.2em] text-[8px] md:text-[10px] overflow-hidden font-sans">
              <span className="relative z-10">Begin Assessment</span>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .text-outline-heavy {
          -webkit-text-stroke: 1px rgba(255, 255, 255, 0.15);
          color: transparent;
        }
        @media (min-width: 768px) {
          .text-outline-heavy { -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.2); }
        }
        @media (min-width: 1280px) {
          .text-outline-heavy { -webkit-text-stroke: 2px rgba(255, 255, 255, 0.25); }
        }
      `}</style>
    </section>
  );
};

export default Hero;
