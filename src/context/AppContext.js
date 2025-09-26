import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the contexts
export const AppContext = createContext();
export const LibsContext = createContext();
export const ThemeContext = createContext();
export const LanguageContext = createContext();

export function AppProvider({ children }) {
  const [libs, setLibs] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');

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

  const languageValue = {
    language,
    setLanguage,
  };

  return (
    <AppContext.Provider value={appValue}>
      <LibsContext.Provider value={libsValue}>
        <ThemeContext.Provider value={themeValue}>
          <LanguageContext.Provider value={languageValue}>
            {children}
          </LanguageContext.Provider>
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

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within AppProvider');
  return ctx;
}

export default AppContext;
