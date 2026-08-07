/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './lib/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.25rem',
        sm: '1.5rem',
        lg: '5rem',
      },
      screens: {
        '2xl': '1440px'
      }
    },
    extend: {
      fontFamily: {
        display: ['var(--font-playfair)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Luxury palette
        canvas: '#FAF8F5',
        ink: '#171717',
        muted: '#6B7280',
        gold: {
          DEFAULT: '#A8843F',
          hover: '#8B6D32',
          soft: '#C9A76A',
        },
        line: '#E5E5E5',
        // shadcn tokens mapped to luxury palette
        border: '#E5E5E5',
        input: '#E5E5E5',
        ring: '#A8843F',
        background: '#FAF8F5',
        foreground: '#171717',
        primary: {
          DEFAULT: '#171717',
          foreground: '#FAF8F5'
        },
        secondary: {
          DEFAULT: '#F1EDE6',
          foreground: '#171717'
        },
        destructive: {
          DEFAULT: '#B23A3A',
          foreground: '#FFFFFF'
        },
        accent: {
          DEFAULT: '#A8843F',
          foreground: '#FFFFFF'
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#171717'
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#171717'
        },
      },
      borderRadius: {
        lg: '20px',
        md: '14px',
        sm: '8px',
      },
      boxShadow: {
        'soft': '0 2px 24px rgba(23,23,23,0.06)',
        'soft-lg': '0 20px 60px rgba(23,23,23,0.10)',
      },
      maxWidth: {
        'container': '1440px',
      },
      letterSpacing: {
        'tighter-2': '-0.03em',
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
}
