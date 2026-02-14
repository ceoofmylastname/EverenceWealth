
import React from 'react';
import { Wallet, Clock, Sparkles, CheckCircle2 } from 'lucide-react';

const BUCKETS = [
  {
    title: "TAXABLE",
    icon: <Wallet size={24} />,
    items: ["Checking/Savings", "Brokerage Accounts", "Certificates of Deposit", "Taxable Bonds"],
    tax: "Taxed every year on gains",
    verdict: "❌ Lose money every year to taxes",
    glow: "rgba(239, 68, 68, 0.1)",
    accent: "bg-red-500"
  },
  {
    title: "TAX-DEFERRED",
    icon: <Clock size={24} />,
    items: ["401(k) / 403(b)", "Traditional IRAs", "SEP / Simple IRAs", "Qualified Plans"],
    tax: "Taxed at withdrawal",
    verdict: "⚠️ Tax time bomb waiting to explode",
    glow: "rgba(245, 158, 11, 0.1)",
    accent: "bg-amber-500"
  },
  {
    title: "TAX-FREE",
    icon: <Sparkles size={24} />,
    items: ["Roth IRA / 401(k)", "Cash Value Life Insurance", "Indexed Universal Life", "Municipal Bonds"],
    tax: "Zero taxes. Ever.",
    verdict: "✅ Zero is Your Hero",
    glow: "rgba(26, 77, 62, 0.4)",
    accent: "bg-evergreen",
    highlight: true
  }
];

const TaxBuckets: React.FC = () => {
  return (
    <section id="tax" className="py-40 bg-gradient-to-b from-[#020806] via-[#081e17] to-[#020806] text-white relative overflow-hidden">
      {/* Decorative Gradients */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-evergreen/10 rounded-full blur-[150px]"></div>
      <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-evergreen/10 rounded-full blur-[150px]"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(236,218,118,0.04)_0%,transparent_60%)]"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-32 scroll-reveal">
          <div className="inline-block px-4 py-1.5 rounded-full border border-white/5 bg-white/[0.03] mb-8">
            <span className="text-evergreen font-black uppercase tracking-[0.4em] text-[9px]">The Efficiency Protocol</span>
          </div>
          <h2 className="font-space text-5xl md:text-8xl font-black leading-[0.85] tracking-tighter mb-10">
            The Three <br />
            <span className="text-outline text-white/10 italic">Tax Buckets</span>
          </h2>
          <p className="max-w-2xl mx-auto text-white/40 text-xl font-light leading-relaxed">
            The IRS divides your wealth into three buckets. Most Americans are drowning in the wrong one. <span className="text-white font-bold">Optimization is the difference between surviving and thriving.</span>
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10 items-stretch">
          {BUCKETS.map((bucket, idx) => (
            <div 
              key={idx}
              className={`glass-card p-12 md:p-14 rounded-[50px] flex flex-col relative group transition-all duration-700 scroll-reveal ${bucket.highlight ? 'lg:scale-105 border-evergreen/40 bg-evergreen/[0.03] shadow-[0_30px_60px_-15px_rgba(26,77,62,0.3)]' : ''}`}
              style={{ 
                transitionDelay: `${idx * 200}ms`,
                boxShadow: bucket.highlight ? `0 40px 80px -20px ${bucket.glow}` : 'none'
              }}
            >
              {bucket.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-evergreen text-white px-8 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">
                  Strategic Priority
                </div>
              )}
              
              <div className={`w-16 h-16 rounded-[24px] ${bucket.accent} flex items-center justify-center mb-10 shadow-2xl transform group-hover:scale-110 transition-transform`}>
                <div className="text-white">{bucket.icon}</div>
              </div>

              <h3 className="font-space text-3xl font-black mb-10 tracking-tighter uppercase">{bucket.title}</h3>
              
              <div className="space-y-5 mb-20 flex-grow">
                {bucket.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 text-white/50 group/item">
                    <div className={`w-1.5 h-1.5 rounded-full transition-all group-hover/item:scale-150 ${bucket.highlight ? 'bg-evergreen' : 'bg-white/20'}`}></div>
                    <span className="text-[10px] font-black uppercase tracking-widest">{item}</span>
                  </div>
                ))}
              </div>

              <div className="pt-10 border-t border-white/5 text-center">
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20 block mb-3">Tax Liability</span>
                <p className="text-2xl font-space font-bold mb-8 tracking-tight">{bucket.tax}</p>
                <div className={`py-4 px-6 rounded-2xl font-black text-[12px] uppercase tracking-widest transition-all ${bucket.highlight ? 'bg-white text-evergreen' : 'bg-white/5 text-white/30 group-hover:text-white/60'}`}>
                  {bucket.verdict}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-40 text-center scroll-reveal">
          <h3 className="font-space text-3xl md:text-5xl font-black italic text-white/10 leading-tight mb-16 tracking-tight max-w-4xl mx-auto">
            "Stop giving the government a blank check for your retirement."
          </h3>
          <button className="group relative px-12 py-6 border border-white/10 hover:border-evergreen/50 hover:bg-evergreen/10 rounded-2xl font-black uppercase tracking-widest text-xs transition-all inline-flex items-center gap-4">
            Get Your Tax Bucket Analysis
            <div className="w-6 h-[1px] bg-white opacity-20 group-hover:w-10 group-hover:opacity-100 transition-all"></div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default TaxBuckets;
