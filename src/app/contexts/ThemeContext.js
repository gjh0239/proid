'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);  useEffect(() => {
    setMounted(true);
    
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme');
    console.log('Saved theme from localStorage:', savedTheme);
    
    if (savedTheme) {
      const isDark = savedTheme === 'dark';
      console.log('Setting theme from localStorage:', isDark ? 'dark' : 'light');
      setIsDarkMode(isDark);
    } else {
	// Check system preference
	const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
	setIsDarkMode(systemPrefersDark);
    }
  }, []);useEffect(() => {
    if (!mounted) return;
    
    // Apply theme to document with more explicit handling
    const root = document.documentElement;
    
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      console.log('Applied dark mode - classList:', root.classList.toString());
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      console.log('Applied light mode - classList:', root.classList.toString());
    }
  }, [isDarkMode, mounted]);
  const toggleTheme = () => {
    console.log('Theme toggle clicked. Current state:', isDarkMode);
    const newTheme = !isDarkMode;
    console.log('Setting new theme to:', newTheme ? 'dark' : 'light');
    setIsDarkMode(newTheme);
  };
  // Prevent hydration mismatch by not rendering until mounted
  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
