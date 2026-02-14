
import React from 'react';
import { Shield, Target, Scale } from 'lucide-react';

const REASONS = [
  {
    icon: <Shield size={32} />,
    title: "HONEST",
    desc: "We tell you what you need to hear, not what you want to hear. No sugar-coating. Just straight talk about your money."
  },
  {
    icon: <Target size={32} />,
    title: "STRATEGIC",
    desc: "We're architects, not salespeople. We design comprehensive strategies that optimize for tax, risk, and cash flow."
  },
  {
    icon: <Scale size={32} />,
    title: "INDEPENDENT",
    desc: "We answer to you. No corporate overlords. No sales quotas. Access to 75+ carriers means we find the best solution."
  }
];

const About: React.FC = () => {
  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-white to-[#F9FAFB] text-evergreen relative z-10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="max-w-4xl mb-14 scroll-reveal">
          <span className="text-xs font-black uppercase tracking-[0.5em] text-evergreen/40 mb-6 block">Why Everence Wealth</span>
          <h2 className="font-space text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter">
            Financial Planning For <br />
            People Who <span className="italic">Hate Being Sold To</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {REASONS.map((item, i) => (
            <div key={i} className="p-12 bg-slate/5 rounded-[50px] scroll-reveal" style={{ transitionDelay: `${i * 150}ms` }}>
              <div className="w-16 h-16 rounded-3xl bg-evergreen text-white flex items-center justify-center mb-10">
                {item.icon}
              </div>
              <h3 className="font-space text-3xl font-black mb-6 tracking-tight">{item.title}</h3>
              <p className="text-lg text-slate leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
