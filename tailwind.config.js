/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F7FAFD',
          100: '#EEF4FA',
          200: '#D5E8F5',
          300: '#6B9EC5',
          400: '#3D82C4',
          500: '#1565C0',
          600: '#0D3B6E',
          700: '#1565C0',
          800: '#0D3B6E',
          900: '#0D2137',
        },
        secondary: {
          50: '#F7FAFD',
          100: '#EEF4FA',
          200: '#EEF4FA',
          300: '#D5E8F5',
          400: '#B3CEDF',
          500: '#8FB3D4',
        },
        accent: {
          DEFAULT: '#6B9EC5',
          light: '#9FC3DE',
          dark: '#4A7FA8',
        },
        pink: {
          50: '#F7FAFD',
          100: '#D5E8F5',
          light: '#D5E8F5',
          DEFAULT: '#6B9EC5',
          dark: '#0D3B6E',
        },
        coral: {
          light: '#3D82C4',
          DEFAULT: '#1565C0',
          dark: '#0D3B6E',
        },
        purple: {
          light: '#3D82C4',
          DEFAULT: '#1565C0',
          dark: '#0D3B6E',
          900: '#0D2137',
          800: '#0D3B6E',
        },
        cream: '#EEF4FA',
        dark: '#0D2137',
        gray: {
          DEFAULT: '#5B7A96',
          light: '#8AA3BC',
          dark: '#3A5068',
        },
      },
      fontFamily: {
        heading: ['Quicksand', 'system-ui', 'sans-serif'],
        body: ['Quicksand', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-1': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-2': ['3.5rem', { lineHeight: '1.15', letterSpacing: '-0.02em' }],
        'heading-1': ['2.5rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'heading-2': ['2rem', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        'heading-3': ['1.5rem', { lineHeight: '1.3' }],
        'heading-4': ['1.25rem', { lineHeight: '1.4' }],
        'body-lg': ['1.125rem', { lineHeight: '1.7' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'body-sm': ['0.875rem', { lineHeight: '1.5' }],
        'caption': ['0.75rem', { lineHeight: '1.4' }],
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(13, 33, 55, 0.1)',
        'card': '0 4px 20px rgba(13, 33, 55, 0.1)',
        'card-hover': '0 8px 30px rgba(21, 101, 192, 0.2)',
        'elevated': '0 12px 40px rgba(13, 33, 55, 0.2)',
        'inner-glow': 'inset 0 1px 2px rgba(255, 255, 255, 0.5), 0 2px 4px rgba(13, 33, 55, 0.1)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'float': 'float 6s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
};
