import { createContext, useState, useEffect, ReactNode, useContext } from 'react';

// Define the allowed theme types
type Theme = 'dark' | 'light' | 'system';

// Define the shape of the context state
interface ThemeProviderState {
  theme: Theme;                         // current theme value
  setTheme: (theme: Theme) => void;     // function to update theme
}

// Create a context with undefined default value
const ThemeProviderContext = createContext<ThemeProviderState | undefined>(undefined);

// Main ThemeProvider component
export function ThemeProvider({
  children,                     // components wrapped inside the provider
  defaultTheme = 'system',      // default theme if nothing is stored in localStorage
  storageKey = 'vite-ui-theme'  // key to store/retrieve theme from localStorage
}: {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}) {
  // State to hold the current theme, initializing from localStorage or default
  const [theme, setTheme] = useState<Theme>(() => 
    (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  // Effect to apply theme class to the HTML root element whenever `theme` changes
  useEffect(() => {
    const root = window.document.documentElement;

    // Remove existing theme classes
    root.classList.remove('light', 'dark');

    // If theme is set to system, detect system preference
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
      return;
    }

    // Apply the selected theme class
    root.classList.add(theme);
  }, [theme]);

  // Context value to provide to children
  const value = {
    theme,
    setTheme: (theme: Theme) => {
      // Save selected theme in localStorage
      localStorage.setItem(storageKey, theme);
      setTheme(theme); // Update the state
    },
  };

  // Return the context provider wrapping the children
  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  // Ensure the hook is used within a ThemeProvider
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context;
};
