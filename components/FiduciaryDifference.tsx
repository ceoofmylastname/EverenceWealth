
import React from 'react';
import { UserCheck, HelpCircle, ShieldAlert, BadgeCheck } from 'lucide-react';

const FiduciaryDifference: React.FC = () => {
  return (
    <section className="py-40 bg-white text-evergreen relative z-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-24 scroll-reveal">
          <span className="text-xs font-black uppercase tracking-[0.5em] text-evergreen/40 mb-4 block">The Ethical Standard</span>
          <h2 className="font-space text-5xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-8">
            We Don't Work <br />
            For Wall Street.
          </h2>
          <p className="text-2xl font-light text-slate italic">We work exclusively for you.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-stretch max-w-6xl mx-auto">
          {/* Wall Street Salesperson */}
          <div className="p-12 rounded-[50px] border border-red-100 bg-red-50/20 scroll-reveal">
            <div className="flex items-center gap-6 mb-12">
              <div className="p-4 bg-red-100 text-red-600 rounded-3xl">
                <ShieldAlert size={32} />
              </div>
              <div>
                <h3 className="font-space text-2xl font-bold tracking-tight">Wall Street Salesperson</h3>
                <span className="text-[10px] font-black uppercase tracking-widest text-red-600/60">Suitability Standard</span>
              </div>
            </div>
            <ul className="space-y-6 opacity-60">
              {[
                "Paid commissions to sell specific products",
                "Legally only required to offer 'suitable' advice",
                "Work for the company, not for you",
                "Incentivized by transaction volume"
              ].map((t, i) => (
                <li key={i} className="flex items-start gap-4">
                  <HelpCircle size={18} className="mt-1 shrink-0 text-red-400" />
                  <span className="text-sm font-bold uppercase tracking-wide">{t}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Everence Wealth Fiduciary */}
          <div className="p-12 rounded-[50px] border-2 border-evergreen bg-white shadow-2xl scroll-reveal" style={{ transitionDelay: '200ms' }}>
            <div className="flex items-center gap-6 mb-12">
              <div className="p-4 bg-evergreen text-white rounded-3xl">
                <BadgeCheck size={32} />
              </div>
              <div>
                <h3 className="font-space text-2xl font-bold tracking-tight">Everence Wealth</h3>
                <span className="text-[10px] font-black uppercase tracking-widest text-evergreen">Fiduciary Standard</span>
              </div>
            </div>
            <ul className="space-y-6">
              {[
                "Legally obligated to act in YOUR best interest",
                "No conflicts of interest. No hidden quotas.",
                "Independence across 75+ global carriers",
                "Transparent compensation structure"
              ].map((t, i) => (
                <li key={i} className="flex items-start gap-4">
                  <UserCheck size={18} className="mt-1 shrink-0 text-evergreen" />
                  <span className="text-sm font-bold uppercase tracking-wide">{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-32 max-w-2xl mx-auto text-center scroll-reveal">
          <p className="text-xl text-slate/70 leading-relaxed italic mb-10">
            "A financial advisor with conflicts of interest is just a salesperson with a nicer title."
          </p>
          <button className="px-12 py-6 bg-evergreen text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all">
            Experience Fiduciary Advice
          </button>
        </div>
      </div>
    </section>
  );
};

export default FiduciaryDifference;
