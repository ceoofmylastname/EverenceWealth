
import React from 'react';
import { Ruler, Activity, MinusCircle, PlusCircle } from 'lucide-react';

const GAPS = [
  {
    title: "Gap #1: Savings Gap",
    desc: "What you have vs. what you need",
    stat: "$1.5M average gap",
    icon: <MinusCircle size={20} />
  },
  {
    title: "Gap #2: Income Gap",
    desc: "Asset generation vs. lifestyle needs",
    stat: "$45k/year average gap",
    icon: <Activity size={20} />
  },
  {
    title: "Gap #3: Tax Gap",
    desc: "What you think you have vs. what you keep",
    stat: "30%+ lost to silent partners",
    icon: <Ruler size={20} />
  }
];

const TheGap: React.FC = () => {
  return (
    <section className="py-40 bg-light-gray relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-24 scroll-reveal">
          <h2 className="font-space text-5xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-8">
            The Retirement Gap
          </h2>
          <p className="max-w-2xl mx-auto text-slate text-xl font-light italic">
            "Hope is not a strategy. Math is."
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-32">
          {GAPS.map((gap, i) => (
            <div key={i} className="p-10 rounded-[40px] bg-white border border-border group hover:shadow-xl transition-all scroll-reveal" style={{ transitionDelay: `${i * 150}ms` }}>
              <div className="text-evergreen mb-8 p-4 bg-evergreen/5 w-fit rounded-2xl group-hover:bg-evergreen group-hover:text-white transition-colors duration-500">
                {gap.icon}
              </div>
              <h3 className="font-space text-2xl font-bold mb-4">{gap.title}</h3>
              <p className="text-slate/60 mb-8 uppercase text-[10px] font-black tracking-widest">{gap.desc}</p>
              <div className="text-3xl font-space font-black text-red-600">{gap.stat}</div>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto p-12 md:p-20 bg-evergreen text-white rounded-[60px] relative overflow-hidden scroll-reveal">
          <div className="absolute top-0 right-0 p-20 opacity-10">
            <PlusCircle size={200} />
          </div>
          <h3 className="font-space text-4xl font-bold mb-12">The Bridge Strategy</h3>
          <div className="grid md:grid-cols-2 gap-x-16 gap-y-10">
             {[
               "Calculate Your Gap - Know the distance",
               "Optimize Tax Position - Keep more",
               "Maximize Growth - Without risk",
               "Create Cash Flow - Accessible funds",
               "Protect the Plan - Insure life's surprises"
             ].map((text, i) => (
               <div key={i} className="flex items-center gap-4">
                 <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                 <span className="font-bold text-[11px] uppercase tracking-widest leading-relaxed">{text}</span>
               </div>
             ))}
          </div>
          <div className="mt-16 text-center">
            <button className="px-12 py-6 bg-white text-evergreen rounded-xl font-black uppercase tracking-widest text-xs hover:scale-105 transition-all">
              Bridge Your Retirement Gap
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TheGap;
