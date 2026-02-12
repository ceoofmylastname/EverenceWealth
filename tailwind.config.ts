import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        evergreen: "#1A4D3E",
        slate: "#4A5565",
        "custom-white": "#FFFFFF",
        "light-gray": "#F9FAFB",
        border: "#E5E7EB",
        success: "#10B981",
        error: "#EF4444",
        warning: "#F59E0B",
        "brand-gold": "#ECDA76",
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
        'space-grotesk': ['var(--font-space-grotesk)', 'Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
export default config;
