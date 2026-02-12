
import React from 'react';

const BUCKETS = [
  {
    title: "TAXABLE",
    items: ["Brokerage Accounts", "High Yield Savings", "Certificates of Deposit"],
    rate: "Variable Capital Gains",
    color: "bg-red-50 border-red-100 text-red-900",
    labelColor: "text-red-700",
    elevated: false
  },
  {
    title: "TAX-DEFERRED",
    items: ["401(k) / 403(b) Plans", "Traditional IRAs", "Qualified Retirement Plans"],
    rate: "Ordinary Income Tax",
    color: "bg-amber-50 border-amber-100 text-amber-900",
    labelColor: "text-amber-700",
    elevated: false
  },
  {
    title: "TAX-FREE",
    items: ["Roth IRA / Roth 401(k)", "Cash Value Life Insurance", "Municipal Bonds"],
    rate: "0% Income Tax",
    color: "bg-evergreen/5 border-evergreen/10 text-evergreen",
    labelColor: "text-evergreen font-bold",
    elevated: true
  }
];

const Framework: React.FC = () => {
  return (
    <section id="framework" className="py-32 bg-light-gray overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-24 scroll-reveal opacity-0 translate-y-10 transition-all duration-700">
          <span className="text-evergreen text-sm font-bold uppercase tracking-widest">Efficiency Matters</span>
          <h2 className="font-space text-4xl md:text-6xl font-bold mt-6">The Three Tax Buckets</h2>
          <p className="max-w-2xl mx-auto mt-6 text-slate text-lg">
            Our proprietary framework focuses on "Zero is your Hero" — diversifying where your money sits to maximize your net spendable income in retirement.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-end relative">
          {/* Decorative background circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-evergreen/5 rounded-full blur-3xl -z-10"></div>

          {BUCKETS.map((bucket, idx) => (
            <div 
              key={idx}
              className={`scroll-reveal opacity-0 translate-y-20 transition-all duration-1000 p-10 rounded-[40px] border shadow-xl flex flex-col ${bucket.color} ${bucket.elevated ? 'lg:scale-105 lg:-translate-y-8 bg-white ring-4 ring-evergreen/20' : ''}`}
              style={{ transitionDelay: `${idx * 200}ms` }}
            >
              {bucket.elevated && (
                <div className="mb-6 bg-evergreen text-white text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full w-fit mx-auto">
                  The Optimization Goal
                </div>
              )}
              <h3 className="font-space text-3xl font-bold mb-8 text-center">{bucket.title}</h3>
              
              <div className="flex-grow space-y-6 mb-12">
                {bucket.items.map((item, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <span className="text-sm font-bold uppercase tracking-wide opacity-60">Vehicle</span>
                    <span className="text-lg font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-8 border-t border-black/5 flex flex-col items-center gap-2">
                <span className="text-sm uppercase tracking-widest opacity-60">Taxation Rate</span>
                <span className={`text-2xl font-space font-bold ${bucket.labelColor}`}>{bucket.rate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Framework;
