import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useDarkMode } from "./DarkModeContext";

// Define theme types
type ThemeVariant = 'earth' | 'kente' | 'ankara' | 'chitenge';

interface AfricanThemeContextType {
  themeVariant: ThemeVariant;
  setThemeVariant: (variant: ThemeVariant) => void;
  patternType: string;
  setPatternType: (pattern: string) => void;
  patternOpacity: number;
  setPatternOpacity: (opacity: number) => void;
  getThemeColors: () => {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    pattern: string;
  };
}

// Create context with default values
const AfricanThemeContext = createContext<AfricanThemeContextType>({
  themeVariant: 'kente',
  setThemeVariant: () => {},
  patternType: 'kente',
  setPatternType: () => {},
  patternOpacity: 0.1,
  setPatternOpacity: () => {},
  getThemeColors: () => ({
    primary: '',
    secondary: '',
    accent: '',
    background: '',
    text: '',
    pattern: '',
  }),
});

// Custom hook to use the African theme context
export const useAfricanTheme = () => useContext(AfricanThemeContext);

// Theme provider component
export const AfricanThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Get dark mode state from DarkModeContext
  const { darkMode } = useDarkMode();

  // Theme state
  const [themeVariant, setThemeVariant] = useState<ThemeVariant>('kente');
  const [patternType, setPatternType] = useState('kente');
  const [patternOpacity, setPatternOpacity] = useState(0.1);

  // Load theme preferences from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('africanThemeVariant') as ThemeVariant;
    const savedPattern = localStorage.getItem('africanPatternType');
    const savedOpacity = localStorage.getItem('africanPatternOpacity');

    if (savedTheme) setThemeVariant(savedTheme);
    if (savedPattern) setPatternType(savedPattern);
    if (savedOpacity) setPatternOpacity(parseFloat(savedOpacity));
  }, []);

  // Save theme preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('africanThemeVariant', themeVariant);
    localStorage.setItem('africanPatternType', patternType);
    localStorage.setItem('africanPatternOpacity', patternOpacity.toString());
  }, [themeVariant, patternType, patternOpacity]);

  // Function to get theme colors based on variant and dark mode
  const getThemeColors = () => {
    // Default colors for each theme variant in light and dark modes
    const themeColors = {
      earth: {
        light: {
          primary: 'clay-500',
          secondary: 'terracotta-600',
          accent: 'sand-500',
          background: 'white',
          text: 'gray-800',
          pattern: 'clay-800',
        },
        dark: {
          primary: 'clay-400',
          secondary: 'terracotta-500',
          accent: 'sand-400',
          background: 'gray-900',
          text: 'gray-100',
          pattern: 'clay-400',
        },
      },
      kente: {
        light: {
          primary: 'kente-gold-500',
          secondary: 'kente-green-600',
          accent: 'kente-red-500',
          background: 'white',
          text: 'gray-800',
          pattern: 'kente-gold-800',
        },
        dark: {
          primary: 'kente-gold-400',
          secondary: 'kente-green-500',
          accent: 'kente-red-400',
          background: 'gray-900',
          text: 'gray-100',
          pattern: 'kente-gold-400',
        },
      },
      ankara: {
        light: {
          primary: 'ankara-purple-500',
          secondary: 'ankara-teal-600',
          accent: 'ankara-orange-500',
          background: 'white',
          text: 'gray-800',
          pattern: 'ankara-purple-800',
        },
        dark: {
          primary: 'ankara-purple-400',
          secondary: 'ankara-teal-500',
          accent: 'ankara-orange-400',
          background: 'gray-900',
          text: 'gray-100',
          pattern: 'ankara-purple-400',
        },
      },
      chitenge: {
        light: {
          primary: 'chitenge-indigo-500',
          secondary: 'chitenge-turquoise-600',
          accent: 'chitenge-magenta-500',
          background: 'white',
          text: 'gray-800',
          pattern: 'chitenge-indigo-800',
        },
        dark: {
          primary: 'chitenge-indigo-400',
          secondary: 'chitenge-turquoise-500',
          accent: 'chitenge-magenta-400',
          background: 'gray-900',
          text: 'gray-100',
          pattern: 'chitenge-indigo-400',
        },
      },
    };

    const mode = darkMode ? 'dark' : 'light';
    return themeColors[themeVariant][mode];
  };

  return (
    <AfricanThemeContext.Provider
      value={{
        themeVariant,
        setThemeVariant,
        patternType,
        setPatternType,
        patternOpacity,
        setPatternOpacity,
        getThemeColors,
      }}
    >
      {children}
    </AfricanThemeContext.Provider>
  );
};
