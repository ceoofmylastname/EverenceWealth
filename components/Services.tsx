
import React from 'react';
import { Home, Shield, TreeDeciduous, ChevronRight } from 'lucide-react';

const SERVICE_CARDS = [
  {
    title: "RETIREMENT PLANNING",
    points: ["Bridge the retirement gap", "Tax-efficient strategies", "RMD planning"],
    icon: <Home className="w-10 h-10 text-evergreen" />,
    description: "Creating a sustainable roadmap for your golden years with focus on consistent cash flow."
  },
  {
    title: "WEALTH PROTECTION",
    points: ["Asset protection", "Insurance solutions", "Living benefits"],
    icon: <Shield className="w-10 h-10 text-evergreen" />,
    description: "Safeguarding your hard-earned assets from unexpected risks and market volatility."
  },
  {
    title: "LEGACY PLANNING",
    points: ["Estate strategies", "Wealth transfer", "Next generation"],
    icon: <TreeDeciduous className="w-10 h-10 text-evergreen" />,
    description: "Structuring your estate to minimize friction and ensure your legacy reaches the right hands."
  }
];

const Services: React.FC = () => {
  return (
    <section id="services" className="py-32 bg-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-20 scroll-reveal opacity-0 translate-y-10 transition-all duration-700">
          <span className="text-evergreen text-sm font-bold uppercase tracking-widest bg-evergreen/5 px-4 py-2 rounded-full">Our Expertise</span>
          <h2 className="font-space text-4xl md:text-6xl font-bold mt-6">How We Protect Your Prosperity</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {SERVICE_CARDS.map((service, idx) => (
            <div 
              key={idx}
              className={`scroll-reveal opacity-0 translate-y-10 transition-all duration-700 bg-white border border-border p-10 rounded-[30px] hover:-translate-y-4 hover:shadow-2xl hover:shadow-evergreen/10 transition-all group`}
              style={{ transitionDelay: `${idx * 150}ms` }}
            >
              <div className="mb-8 p-4 bg-light-gray w-fit rounded-2xl group-hover:bg-evergreen group-hover:text-white transition-colors duration-500">
                {service.icon}
              </div>
              <h3 className="font-space text-2xl font-bold mb-4 tracking-tight">{service.title}</h3>
              <p className="text-slate mb-8 leading-relaxed">
                {service.description}
              </p>
              <ul className="space-y-4 mb-10">
                {service.points.map((point, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate font-medium">
                    <div className="w-1.5 h-1.5 bg-evergreen rounded-full"></div>
                    {point}
                  </li>
                ))}
              </ul>
              <a href="#" className="inline-flex items-center gap-2 text-evergreen font-bold text-sm uppercase tracking-widest group-hover:gap-4 transition-all">
                Learn More <ChevronRight size={18} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
