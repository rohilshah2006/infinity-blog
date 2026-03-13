import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    'animate-fadeInUp',
    'animate-zoomIn',
    'animate-slideRight',
    'animate-flip',
    'animate-fadeIn'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: "#f9fafb",      // Inverted so text becomes white
          light: "#0a0a0a",     // Inverted so root backgrounds become dark
          surface: "#171717",   // New token for cards and modals
          mid: "#a1a1aa",       // Muted text
          lightgray: "#27272a", // Subtle borders
          orange: "var(--brand-accent)",    // Vibrant Neon Accent (now dynamic)
          blue: "#38bdf8",
          green: "#4ade80",
        }
      },
      fontFamily: {
        poppins: ["var(--font-poppins)", "Arial", "sans-serif"],
        lora: ["var(--font-lora)", "Georgia", "serif"],
      },
      boxShadow: {
        'subtle': '0 4px 20px -2px rgba(20, 20, 19, 0.05)',
        'subtle-hover': '0 12px 30px -4px rgba(20, 20, 19, 0.1)',
      }
    },
  },
  plugins: [],
} satisfies Config;

// Trigger tailwind reload for Next.js