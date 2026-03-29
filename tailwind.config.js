/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Instrument Serif', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        background: 'hsl(201 100% 13%)',
        foreground: 'hsl(0 0% 100%)',
        'muted-foreground': 'hsl(240 4% 66%)',
        primary: {
          DEFAULT: 'hsl(0 0% 100%)',
          foreground: 'hsl(0 0% 4%)',
        },
        secondary: 'hsl(0 0% 10%)',
        muted: 'hsl(0 0% 10%)',
        accent: 'hsl(0 0% 10%)',
        border: 'hsl(0 0% 18%)',
        input: 'hsl(0 0% 18%)',
      },
    },
  },
  plugins: [],
}
