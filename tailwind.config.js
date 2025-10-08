/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx,html}",
    "./public/index.html"
  ],
  theme: {
      extend: {
          colors: {
              // Custom light mode colors - warmer, more personality
              'light-bg': '#fdfcfb',
              'light-surface': '#ffffff',
              'light-accent': '#f0f7ff',
              // Custom dark mode colors - richer, not just black
              'dark-bg': '#0a0e1a',
              'dark-surface': '#131825',
              'dark-accent': '#1a2332',
              // Brand colors with personality
              'brand': {
                  50: '#f0f9ff',
                  100: '#e0f2fe',
                  200: '#bae6fd',
                  300: '#7dd3fc',
                  400: '#38bdf8',
                  500: '#0ea5e9',
                  600: '#0284c7',
                  700: '#0369a1',
                  800: '#075985',
                  900: '#0c4a6e',
              },
              'accent': {
                  50: '#fdf4ff',
                  100: '#fae8ff',
                  200: '#f5d0fe',
                  300: '#f0abfc',
                  400: '#e879f9',
                  500: '#d946ef',
                  600: '#c026d3',
                  700: '#a21caf',
                  800: '#86198f',
                  900: '#701a75',
              },
          },
          backgroundImage: {
              'gradient-light': 'linear-gradient(135deg, #fdfcfb 0%, #f0f7ff 100%)',
              'gradient-dark': 'linear-gradient(135deg, #0a0e1a 0%, #1a2332 100%)',
              'gradient-hero-light': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              'gradient-hero-dark': 'linear-gradient(135deg, #1e3a8a 0%, #3730a3 100%)',
          },
      },
  },
  plugins: [],
};
