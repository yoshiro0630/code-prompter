/** @type {import('tailwindcss').Config} */
import plugin from '@tailwindcss/some-plugin';
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      animation: {
        spin: 'spin 1s linear infinite',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      },
      colors: {
        dark: {
          DEFAULT: '#121212',
          secondary: '#1E1E1E',
          accent: '#2D2D2D'
        }
      },
      backgroundColor: {
        dark: {
          DEFAULT: '#121212',
          secondary: '#1E1E1E',
          accent: '#2D2D2D'
        }
      },
      textColor: {
        dark: {
          DEFAULT: '#FFFFFF',
          secondary: '#AAAAAA'
        }
      },
      borderColor: {
        dark: {
          DEFAULT: '#2D2D2D',
          accent: '#3D3D3D'
        }
      }
    },
  },
  plugins: [plugin],
}