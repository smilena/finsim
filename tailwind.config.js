/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Futuristic palette - neon on dark, high contrast
        background: '#080810',
        surface: '#0f0f1a',
        primary: {
          DEFAULT: '#00d4ff',
          hover: '#22e3ff',
          foreground: '#080810',
        },
        secondary: {
          DEFAULT: '#a855f7',
          hover: '#c084fc',
          foreground: '#ffffff',
        },
        success: {
          DEFAULT: '#00ff88',
          hover: '#5cffb0',
          foreground: '#080810',
        },
        warning: {
          DEFAULT: '#facc15',
          hover: '#fde047',
          foreground: '#080810',
        },
        error: {
          DEFAULT: '#ff4757',
          hover: '#ff6b7a',
          foreground: '#ffffff',
        },
        muted: {
          DEFAULT: '#1e1e2e',
          foreground: '#94a3b8',
        },
        accent: {
          DEFAULT: '#00d4ff',
          foreground: '#080810',
        },
        border: '#2a2a3e',
        input: '#12121f',
        ring: '#00d4ff',
        foreground: '#f1f5f9',
        'foreground-secondary': '#94a3b8',
      },
      borderRadius: {
        lg: '0.5rem',
        md: '0.375rem',
        sm: '0.25rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
