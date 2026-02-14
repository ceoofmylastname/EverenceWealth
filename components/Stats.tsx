'use client'

import React, { useState, useEffect, useRef } from 'react';

const STATS_DATA = [
  { label: "Assets Under Management", target: 500, suffix: "M+", prefix: "$" },
  { label: "Client Satisfaction", target: 98, suffix: "%", prefix: "" },
  { label: "Years Experience", target: 25, suffix: "+", prefix: "" },
  { label: "Fiduciary Carriers", target: 75, suffix: "+", prefix: "" },
];

const StatCard: React.FC<{ data: typeof STATS_DATA[0], index: number }> = ({ data, index }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    }, { threshold: 0.5 });

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let start = 0;
    const duration = 2000;
    const stepTime = 10;
    const increment = data.target / (duration / stepTime);

    const timer = setInterval(() => {
      start += increment;
      if (start >= data.target) {
        setCount(data.target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isVisible, data.target]);

  return (
    <div 
      ref={cardRef} 
      className="flex flex-col items-center md:items-start p-6 text-center md:text-left scroll-reveal opacity-0 translate-y-10 transition-all duration-700"
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <div className="font-space text-5xl md:text-7xl font-bold text-evergreen tracking-tight flex items-baseline gap-1">
        {data.prefix}{count}{data.suffix}
      </div>
      <div className="text-slate uppercase font-bold tracking-[0.2em] text-xs mt-4">
        {data.label}
      </div>
    </div>
  );
};

const Stats: React.FC = () => {
  return (
    <section className="py-32 bg-gradient-to-b from-[#F9FAFB] to-white">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8 divide-evergreen/10 divide-y-0 md:divide-x">
          {STATS_DATA.map((stat, i) => (
            <StatCard key={i} data={stat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
