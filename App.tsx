
import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WakeUpCall from './components/WakeUpCall';
import SilentKillers from './components/SilentKillers';
import TaxBuckets from './components/TaxBuckets';
import IndexedAdvantage from './components/IndexedAdvantage';
import WealthPhilosophy from './components/WealthPhilosophy';
import FiduciaryDifference from './components/FiduciaryDifference';
import TheGap from './components/TheGap';
import About from './components/About';
import Stats from './components/Stats';
import Assessment from './components/Assessment';
import FAQ from './components/FAQ';
import CTA from './components/CTA';
import Footer from './components/Footer';

const App: React.FC = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative w-full bg-[#020806]">
      <Navbar />
      <Hero />
      <main>
        <WakeUpCall />
        <SilentKillers />
        <TaxBuckets />
        <IndexedAdvantage />
        <WealthPhilosophy />
        <FiduciaryDifference />
        <TheGap />
        <About />
        <Stats />
        <Assessment />
        <FAQ />
        <CTA />
      </main>
      <Footer />
      
      <style>{`
        .scroll-reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: all 1s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .scroll-reveal.in-view {
          opacity: 1;
          transform: translateY(0);
        }
        .glass-card {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
        }
      `}</style>
    </div>
  );
};

export default App;
