export default {
  // Enable dark mode using class strategy (e.g. `dark:` variants activated when `.dark` class is on <html>)
  darkMode: 'class',

  // Files Tailwind should scan for class names
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Includes all source files (JS, TS, JSX, TSX)
  ],

  theme: {
    extend: {
      colors: {
        // Custom dark mode color palette
        dark: {
          background: '#1a202c', // Dark gray for overall background
          card: '#2d3748',       // Slightly lighter gray for cards, modals, etc.
          primary: '#4299e1',    // Blue for buttons, links, and primary actions
          text: '#e2e8f0',       // Light gray text for better readability
          subtext: '#a0aec0',    // Dimmer text for subtitles or secondary info
        }
      }
    },
  },

  plugins: [], // You can add Tailwind plugins here (e.g., forms, typography)
}
