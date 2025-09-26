import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the contexts
export const AppContext = createContext();
export const LibsContext = createContext(); // Add this export
export const ThemeContext = createContext(); // Add this export

export function AppProvider({ children }) {
  const [libs, setLibs] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('light'); // Add theme state

  // Export this function for direct use
  const updateLibs = (newLibs) => {
    setLibs(newLibs);
  };

  useEffect(() => {
    // dummy async init example; replace with your real init
    async function init() {
      try {
        // load initial data if needed
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
    init();
  }, []);

  const appValue = {
    user,
    setUser,
    loading,
  };

  const libsValue = {
    libs,
    setLibs,
  };

  const themeValue = {
    theme,
    setTheme,
  };

  return (
    <AppContext.Provider value={appValue}>
      <LibsContext.Provider value={libsValue}>
        <ThemeContext.Provider value={themeValue}>
          {children}
        </ThemeContext.Provider>
      </LibsContext.Provider>
    </AppContext.Provider>
  );
}

// Custom hooks to use each context
export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}

export function useLibs() {
  const ctx = useContext(LibsContext);
  if (!ctx) throw new Error('useLibs must be used within AppProvider');
  return ctx;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within AppProvider');
  return ctx;
}

export default AppContext;
