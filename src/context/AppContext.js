import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [libs, setLibs] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // example single definition of useLibs (function to update libs)
  function useLibs(newLibs) {
    setLibs(newLibs);
  }

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

  const value = {
    libs,
    setLibs,
    useLibs, // expose the single function
    user,
    setUser,
    loading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}

export default AppContext;
