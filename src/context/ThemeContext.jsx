import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  // Apply theme by only changing body background color and text color
  useEffect(() => {
    if (theme === 'dark') {
      document.body.style.backgroundColor = '#1a202c'; // Dark background color
      document.body.style.color = '#aad576'; // Light green text for dark mode
    } else {
      document.body.style.backgroundColor = '#f0fff1'; // Light mint green background for light mode
      document.body.style.color = '#143601'; // Dark green text for light mode
    }
  }, [theme]);

  // Toggle theme function
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const value = {
    theme,
    toggleTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};