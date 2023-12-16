/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          "primary": "#ff00a9",
          "secondary": "#008fc4",
          "accent": "#6d28d9",
          "neutral": "#333",
          "base-100": "#f0ebf8",
          "info": "#0069ff",
          "success": "#0d9488",
          "warning": "#ffac00",
          "error": "#f14256",
        },
      },
    ],
  },
  plugins: [
    require('daisyui', '@tailwindcss/transition'),
  ],
}
