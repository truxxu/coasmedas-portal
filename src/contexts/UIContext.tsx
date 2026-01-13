'use client';

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';

interface UIContextType {
  hideBalances: boolean;
  setHideBalances: (value: boolean) => void;
  toggleHideBalances: () => void;
  sidebarExpanded: Record<string, boolean>;
  toggleSidebarItem: (itemId: string) => void;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (value: boolean) => void;
  toggleMobileSidebar: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: ReactNode }) {
  const [hideBalances, setHideBalances] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState<Record<string, boolean>>({});
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  // Use ref instead of state for hydration tracking to avoid cascading renders
  const isHydrated = useRef(false);

  // Load hideBalances from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('hideBalances');
    if (stored) {
      const parsedValue = JSON.parse(stored);
      // Only update state if different from default to avoid unnecessary render
      if (parsedValue !== false) {
        setHideBalances(parsedValue);
      }
    }
    isHydrated.current = true;
  }, []);

  // Persist hideBalances to localStorage when it changes
  useEffect(() => {
    if (isHydrated.current) {
      localStorage.setItem('hideBalances', JSON.stringify(hideBalances));
    }
  }, [hideBalances]);

  const toggleHideBalances = () => setHideBalances(!hideBalances);

  const toggleSidebarItem = (itemId: string) => {
    setSidebarExpanded(prev => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const toggleMobileSidebar = () => setMobileSidebarOpen(!mobileSidebarOpen);

  return (
    <UIContext.Provider value={{
      hideBalances,
      setHideBalances,
      toggleHideBalances,
      sidebarExpanded,
      toggleSidebarItem,
      mobileSidebarOpen,
      setMobileSidebarOpen,
      toggleMobileSidebar,
    }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUIContext() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUIContext must be used within UIProvider');
  }
  return context;
}
