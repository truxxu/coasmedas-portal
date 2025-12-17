'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  const [isHydrated, setIsHydrated] = useState(false);

  // Persist hideBalances preference
  useEffect(() => {
    setIsHydrated(true);
    const stored = localStorage.getItem('hideBalances');
    if (stored) setHideBalances(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('hideBalances', JSON.stringify(hideBalances));
    }
  }, [hideBalances, isHydrated]);

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
