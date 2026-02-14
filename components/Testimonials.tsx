'use client'

import { TestimonialsColumn } from "@/components/ui/testimonials-columns";
import type { Testimonial } from "@/components/ui/testimonials-columns";

const testimonials: Testimonial[] = [
  {
    text: "Everence showed us how much we were losing to hidden fees — nearly $400K over our retirement horizon. Switching to their strategy gave us back control and peace of mind.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    name: "Robert Harrington",
    role: "Retired CEO, 62",
  },
  {
    text: "I had no idea how exposed my portfolio was to volatility. The indexed strategy they built for me protects my downside while still capturing market gains. It changed everything.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face",
    name: "Dr. Margaret Chen",
    role: "Physician, 58",
  },
  {
    text: "As a business owner, cash flow is everything. Everence helped me restructure so I'm not just accumulating — I'm actually accessing my wealth tax-free while I'm still building.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    name: "David Thompson",
    role: "Business Owner, 55",
  },
  {
    text: "The financial needs assessment was eye-opening. They identified a tax exposure I didn't even know existed and built a strategy to eliminate it. Worth every minute.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face",
    name: "Patricia Lawson",
    role: "Corporate Attorney, 51",
  },
  {
    text: "After 20 years of traditional advising, Everence was the first firm to show me my Human Life Value and build a real protection strategy around it. Truly independent fiduciary thinking.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face",
    name: "James Mitchell",
    role: "Senior VP of Finance, 59",
  },
  {
    text: "They didn't try to sell me a product. They showed me the math, explained the strategy, and let me decide. That's what a real fiduciary does. I've referred three colleagues since.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&crop=face",
    name: "Sandra Williams",
    role: "CFO, 54",
  },
  {
    text: "The tax-free retirement income strategy alone is saving our family over $180K in projected taxes. Everence thinks decades ahead — not just next quarter.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face",
    name: "Richard Nakamura",
    role: "Retired Engineer, 64",
  },
  {
    text: "I was skeptical about indexed strategies until they walked me through the 0% floor protection. Seeing it side-by-side with my existing portfolio was the turning point.",
    image: "https://images.unsplash.com/photo-1548142813-c348350df52b?w=200&h=200&fit=crop&crop=face",
    name: "Karen O'Brien",
    role: "University Professor, 57",
  },
  {
    text: "My previous advisor had me in high-fee mutual funds for 15 years. Everence showed me the true cost and built a strategy that actually works for my retirement — not Wall Street's.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face",
    name: "Michael Andersen",
    role: "Real Estate Developer, 60",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export default function Testimonials() {
  return (
    <section className="relative py-32 md:py-40 bg-gradient-to-b from-[#020806] via-[#071a14] to-[#020806] overflow-hidden">
      {/* Radial glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.12)_0%,transparent_60%)]" />
      <div className="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(ellipse_at_top_right,rgba(236,218,118,0.05)_0%,transparent_50%)]" />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center justify-center max-w-2xl mx-auto mb-16 text-center scroll-reveal">
          <span className="inline-block rounded-full border border-white/10 bg-white/[0.04] px-6 py-2 text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-400/80 mb-6">
            Client Stories
          </span>

          <h2 className="font-space-grotesk text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight mb-6">
            Real People.{" "}
            <span className="text-evergreen">Real Results.</span>
          </h2>

          <p className="text-base md:text-lg text-white/60 max-w-xl">
            Hear from professionals and retirees who took control of their
            financial future with Everence Wealth.
          </p>
        </div>

        {/* Scrolling columns */}
        <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-[740px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn
            testimonials={secondColumn}
            className="hidden md:block"
            duration={19}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={17}
          />
        </div>
      </div>
    </section>
  );
}
