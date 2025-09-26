import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

// Define useLibs outside the AppProvider component so it can be exported
export function useLibs(newLibs, setLibs) {
  setLibs(newLibs);
}

export function AppProvider({ children }) {
  const [libs, setLibs] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Create a wrapper function that uses the component's state
  const updateLibs = (newLibs) => {
    useLibs(newLibs, setLibs);
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

  const value = {
    libs,
    setLibs,
    useLibs: updateLibs, // provide the wrapper function in the context
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
