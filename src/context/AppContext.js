import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the context and export it as LibsContext (for components that import it directly)
const AppContext = createContext();
export const LibsContext = AppContext; // Add this export for components expecting LibsContext

export function AppProvider({ children }) {
  const [libs, setLibs] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Define the useLibs function inside the component to have access to setLibs
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
    useLibs, // Provide the function in the context
    user,
    setUser,
    loading,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Export the hook for using the context
export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
}

// Export useLibs as a standalone function that consumers can import directly
export function useLibs(newLibs) {
  const { setLibs } = useAppContext();
  setLibs(newLibs);
}

export default AppContext;
