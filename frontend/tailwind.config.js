/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from 'tailwindcss-animate'

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        primary: ['var(--font-family-primary)'],
        default: ['var(--font-family-default)'],
      },
      backgroundImage: {
        'grad-cta': 'var(--grad-cta)',
        'grad-story': 'var(--grad-story)',
        'grad-header-home': 'var(--grad-header-home)',
        'grad-header-purple': 'var(--grad-header-purple)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        brand: {
          base: 'var(--bg-base)',
          black: 'var(--bg-black)',
          light: 'var(--bg-light)',
          panel: 'var(--bg-panel)',
          'sidebar-head': 'var(--bg-sidebar-head)',
          text: {
            primary: 'var(--text-primary)',
            muted: 'var(--text-muted)',
            dark: 'var(--text-dark)',
          },
          accent: {
            magenta: 'var(--accent-magenta)',
            pink: 'var(--accent-pink)',
            violet: 'var(--accent-violet)',
            blue: 'var(--accent-blue)',
          },
          glow: {
            warm: 'var(--glow-warm)',
            rose: 'var(--glow-rose)',
          },
          border: {
            subtle: 'var(--border-subtle)',
          },
        },
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        chart: {
          1: 'var(--chart-1)',
          2: 'var(--chart-2)',
          3: 'var(--chart-3)',
          4: 'var(--chart-4)',
          5: 'var(--chart-5)',
        },
        sidebar: {
          DEFAULT: 'var(--sidebar)',
          foreground: 'var(--sidebar-foreground)',
          primary: 'var(--sidebar-primary)',
          'primary-foreground': 'var(--sidebar-primary-foreground)',
          accent: 'var(--sidebar-accent)',
          'accent-foreground': 'var(--sidebar-accent-foreground)',
          border: 'var(--sidebar-border)',
          ring: 'var(--sidebar-ring)',
        },
      },
    },
  },
  plugins: [tailwindcssAnimate],
}
