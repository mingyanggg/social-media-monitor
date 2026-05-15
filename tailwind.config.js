module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#0f172a',
        foreground: '#ffffff',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
