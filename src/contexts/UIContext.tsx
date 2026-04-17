"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  ReactNode,
} from "react";

interface HideBalancesContextType {
  hideBalances: boolean;
  setHideBalances: (value: boolean) => void;
  toggleHideBalances: () => void;
}

interface SidebarExpandedContextType {
  sidebarExpanded: Record<string, boolean>;
  toggleSidebarItem: (itemId: string) => void;
}

interface MobileSidebarContextType {
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (value: boolean) => void;
  toggleMobileSidebar: () => void;
}

const HideBalancesContext = createContext<HideBalancesContextType | undefined>(
  undefined,
);
const SidebarExpandedContext = createContext<
  SidebarExpandedContextType | undefined
>(undefined);
const MobileSidebarContext = createContext<
  MobileSidebarContextType | undefined
>(undefined);

const HIDE_BALANCES_STORAGE_KEY = "hideBalances";

const hideBalancesListeners = new Set<() => void>();

function subscribeHideBalances(listener: () => void) {
  hideBalancesListeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === HIDE_BALANCES_STORAGE_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    hideBalancesListeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

function getHideBalancesSnapshot(): boolean {
  const stored = localStorage.getItem(HIDE_BALANCES_STORAGE_KEY);
  if (!stored) return false;
  try {
    return JSON.parse(stored) === true;
  } catch {
    return false;
  }
}

function getHideBalancesServerSnapshot(): boolean {
  return false;
}

function writeHideBalances(value: boolean) {
  localStorage.setItem(HIDE_BALANCES_STORAGE_KEY, JSON.stringify(value));
  hideBalancesListeners.forEach((l) => l());
}

function HideBalancesProvider({ children }: { children: ReactNode }) {
  const hideBalances = useSyncExternalStore(
    subscribeHideBalances,
    getHideBalancesSnapshot,
    getHideBalancesServerSnapshot,
  );

  const setHideBalances = useCallback((value: boolean) => {
    writeHideBalances(value);
  }, []);

  const toggleHideBalances = useCallback(() => {
    writeHideBalances(!getHideBalancesSnapshot());
  }, []);

  const value = useMemo(
    () => ({ hideBalances, setHideBalances, toggleHideBalances }),
    [hideBalances, setHideBalances, toggleHideBalances],
  );

  return (
    <HideBalancesContext.Provider value={value}>
      {children}
    </HideBalancesContext.Provider>
  );
}

function SidebarExpandedProvider({ children }: { children: ReactNode }) {
  const [sidebarExpanded, setSidebarExpanded] = useState<
    Record<string, boolean>
  >({});

  const toggleSidebarItem = useCallback((itemId: string) => {
    setSidebarExpanded((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  }, []);

  const value = useMemo(
    () => ({ sidebarExpanded, toggleSidebarItem }),
    [sidebarExpanded, toggleSidebarItem],
  );

  return (
    <SidebarExpandedContext.Provider value={value}>
      {children}
    </SidebarExpandedContext.Provider>
  );
}

function MobileSidebarProvider({ children }: { children: ReactNode }) {
  const [mobileSidebarOpen, setMobileSidebarOpenState] = useState(false);

  const setMobileSidebarOpen = useCallback((v: boolean) => {
    setMobileSidebarOpenState(v);
  }, []);

  const toggleMobileSidebar = useCallback(() => {
    setMobileSidebarOpenState((prev) => !prev);
  }, []);

  const value = useMemo(
    () => ({ mobileSidebarOpen, setMobileSidebarOpen, toggleMobileSidebar }),
    [mobileSidebarOpen, setMobileSidebarOpen, toggleMobileSidebar],
  );

  return (
    <MobileSidebarContext.Provider value={value}>
      {children}
    </MobileSidebarContext.Provider>
  );
}

export function UIProvider({ children }: { children: ReactNode }) {
  return (
    <HideBalancesProvider>
      <SidebarExpandedProvider>
        <MobileSidebarProvider>{children}</MobileSidebarProvider>
      </SidebarExpandedProvider>
    </HideBalancesProvider>
  );
}

export function useHideBalancesContext() {
  const ctx = useContext(HideBalancesContext);
  if (!ctx) {
    throw new Error("useHideBalancesContext must be used within UIProvider");
  }
  return ctx;
}

export function useSidebarExpandedContext() {
  const ctx = useContext(SidebarExpandedContext);
  if (!ctx) {
    throw new Error("useSidebarExpandedContext must be used within UIProvider");
  }
  return ctx;
}

export function useMobileSidebarContext() {
  const ctx = useContext(MobileSidebarContext);
  if (!ctx) {
    throw new Error("useMobileSidebarContext must be used within UIProvider");
  }
  return ctx;
}

// Back-compat: existing callers do `const { hideBalances } = useUIContext()`.
// Preserve that surface by aliasing to the hide-balances context — the only
// field they read in practice.
export const useUIContext = useHideBalancesContext;
