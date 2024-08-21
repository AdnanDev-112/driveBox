/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // HomePageLeft: '#FFBB5C',
        // HomePageRight: '#E25E3E',
        HomePageLeft: 'rgba(255, 187, 92, 0.8)', // Lighter shade with 50% opacity
        HomePageRight: 'rgba(226, 94, 62, 0.8)', // Lighter shade with 50% opacity
      
        logoLeft: '#EBF400',
        logoRight: '#FFDE4D',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
