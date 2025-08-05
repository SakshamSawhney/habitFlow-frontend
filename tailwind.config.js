export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          background: '#1a202c', // A darker gray for the main background
          card: '#2d3748',       // A slightly lighter gray for cards/modals
          primary: '#4299e1',    // A nice blue for primary actions and links
          text: '#e2e8f0',       // Lighter text for good contrast
          subtext: '#a0aec0',    // Subtler text for secondary info
        }
      }
    },
  },
  plugins: [],
}