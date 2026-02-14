'use client'

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useAssessmentModal } from '@/components/AssessmentModal';

const CTA: React.FC = () => {
  const { openModal } = useAssessmentModal();
  return (
    <section className="py-60 bg-gradient-to-b from-[#020806] via-[#0a1f1a] to-[#020806] text-white relative overflow-hidden">
      {/* Decorative atmosphere */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(26,77,62,0.18)_0%,transparent_60%)]"></div>
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(236,218,118,0.05)_0%,transparent_50%)]"></div>
      </div>
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-32 scroll-reveal">
          <h2 className="font-space text-6xl md:text-9xl font-black leading-[0.8] tracking-tighter mb-10">
            Two Paths <br />
            Forward
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto items-stretch">
          <div className="glass-card p-12 md:p-20 rounded-[60px] opacity-40 scroll-reveal">
            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/80 mb-10">Path #1: The Gamble</h4>
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
            <button onClick={openModal} className="btn-3d-light w-full py-8 text-evergreen rounded-2xl font-black uppercase tracking-widest text-sm flex items-center justify-center gap-4">
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
