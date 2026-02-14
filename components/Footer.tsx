'use client'

import React from 'react';
import { Mail, Phone, MapPin, Linkedin, Twitter, Instagram } from 'lucide-react';
import { useAssessmentModal } from '@/components/AssessmentModal';

const Footer: React.FC = () => {
  const { openModal } = useAssessmentModal();
  return (
    <footer className="bg-gradient-to-b from-[#1A4D3E] to-[#0d2b23] text-white pt-40 pb-12 border-t border-white/10">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-4 lg:grid-cols-6 gap-20 mb-32">
          <div className="md:col-span-2 space-y-10">
            <a href="#" className="font-space text-3xl font-black tracking-tighter inline-block">
              EVERENCE<span className="opacity-30">WEALTH</span>
            </a>
            <p className="text-white/90 text-lg leading-relaxed max-w-sm font-light">
              Premium fiduciary wealth management focused on bridging the gap between today's prosperity and tomorrow's peace of mind.
            </p>
            <div className="flex gap-4">
              {[Linkedin, Twitter, Instagram].map((Icon, i) => (
                <a key={i} href="#" className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-10">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">Quick Links</h4>
            <ul className="space-y-5">
              {['About Our Process', 'Tax Optimization', 'Indexed Life', 'Schedule Consultation'].map((link) => (
                <li key={link}>
                  {link === 'Schedule Consultation' ? (
                    <button onClick={openModal} className="text-white/90 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
                      {link}
                    </button>
                  ) : (
                    <a href="#" className="text-white/90 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
                      {link}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-10">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">Resources</h4>
            <ul className="space-y-5">
              {['Wealth Strategies', 'Kill Sacred Cows', 'The Retirement Gap', 'Contact Us'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-white/90 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 space-y-10">
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">Contact</h4>
            <ul className="space-y-8">
              <li className="flex items-start gap-6">
                <MapPin className="text-white/70 mt-1 shrink-0" size={24} />
                <span className="text-white/90 font-light text-lg">455 Market St, Suite 1940<br />San Francisco, CA 94105</span>
              </li>
              <li className="flex items-center gap-6">
                <Phone className="text-white/70 shrink-0" size={24} />
                <span className="text-white/90 font-light text-lg">(555) 123-4567</span>
              </li>
              <li className="flex items-center gap-6">
                <Mail className="text-white/70 shrink-0" size={24} />
                <span className="text-white/90 font-light text-lg">info@everencewealth.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70 max-w-2xl text-center md:text-left leading-relaxed">
            <p className="mb-4">© 2026 EVERENCE WEALTH. ALL RIGHTS RESERVED.</p>
            <p className="opacity-50">
              Licensed Fiduciary | Independent Broker | 75+ Carrier Relationships. <br />
              This material is for informational purposes only and should not be construed as legal, tax, or investment advice.
            </p>
          </div>
          <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-white/70">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Disclosures</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
