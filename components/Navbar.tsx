'use client'

import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useAssessmentModal } from '@/components/AssessmentModal';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { openModal } = useAssessmentModal();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = totalScroll > 0 ? (window.scrollY / totalScroll) * 100 : 0;
      setScrollProgress(currentProgress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Philosophy', href: '/philosophy' },
    { name: 'Killers', href: '/killers' },
    { name: 'Tax', href: '/taxes' },
    { name: 'Indexed', href: '/indexed' },
    { name: 'Blog', href: '/blog' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${
        isScrolled ? 'bg-black/80 backdrop-blur-2xl py-3 border-b border-white/5 shadow-2xl' : 'bg-transparent py-6 md:py-10'
      }`}
    >
      {/* Scroll Progress Bar */}
      <div
        className="absolute top-0 left-0 h-[2px] bg-evergreen transition-all duration-100 shadow-[0_0_10px_rgba(26,77,62,1)]"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
        <a
          href="/"
          className="font-space text-xl md:text-2xl font-black tracking-tighter text-white"
        >
          EVERENCE<span className="text-evergreen">WEALTH</span>
        </a>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center space-x-10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300 text-white/80 hover:text-white"
            >
              {link.name}
            </a>
          ))}
          <a
            href="/portal/login"
            className="text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-300 text-evergreen hover:text-white border border-evergreen/40 px-4 py-2 hover:border-white/40"
          >
            Client Portal
          </a>
          <button onClick={openModal} className="btn-3d-dark relative px-8 py-3 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-xl overflow-hidden">
            <span className="relative z-10">Schedule</span>
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden p-2 text-white glass rounded-xl"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-[#020806] z-[200] lg:hidden flex flex-col items-center justify-center space-y-12">
          {/* Close button */}
          <button
            className="absolute top-6 right-6 p-2 text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={24} />
          </button>

          <div className="flex flex-col items-center space-y-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-4xl font-space font-black text-white uppercase tracking-tighter hover:text-evergreen transition-colors"
              >
                {link.name}
              </a>
            ))}
            <a
              href="/portal/login"
              className="text-lg font-space font-black text-evergreen uppercase tracking-wider hover:text-white transition-colors border border-evergreen/40 px-8 py-3"
            >
              Client Portal
            </a>
          </div>
          <button onClick={() => { setIsMobileMenuOpen(false); openModal(); }} className="btn-3d-light text-evergreen text-xs font-black uppercase tracking-[0.3em] px-12 py-5 rounded-2xl">
            Schedule Assessment
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
