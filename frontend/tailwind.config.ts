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
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        zoomIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        slideRight: {
          "0%": { opacity: "0", transform: "translateX(-24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        flip: {
          "0%": { opacity: "0", transform: "rotateX(-90deg)" },
          "100%": { opacity: "1", transform: "rotateX(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        fadeInUp: "fadeInUp 0.6s ease-out both",
        zoomIn: "zoomIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) both",
        slideRight: "slideRight 0.6s ease-out both",
        flip: "flip 0.8s ease-out both",
        fadeIn: "fadeIn 0.3s ease-out both",
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