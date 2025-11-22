/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0A1A3A',     // Deepest background
          primary: '#112D55',  // Card/Component background
          blue: '#2A66F0',     // Primary Action
          gold: '#F4A640',     // Accent/Warning
          success: '#10B981',  // Done
          danger: '#EF4444',   // Canceled
          muted: '#64748B',    // Text muted
        }
      },
      backgroundImage: {
        'app-gradient': 'linear-gradient(to bottom right, #0A1A3A, #112D55)',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
