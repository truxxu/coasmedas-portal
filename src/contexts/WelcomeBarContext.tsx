"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
} from "react";

interface WelcomeBarConfig {
  title?: ReactNode;
  backHref?: string;
}

interface WelcomeBarContextType {
  config: WelcomeBarConfig;
  setWelcomeBar: (config: WelcomeBarConfig) => void;
  clearWelcomeBar: () => void;
}

const WelcomeBarContext = createContext<WelcomeBarContextType | undefined>(
  undefined,
);

export function WelcomeBarProvider({ children }: { children: ReactNode }) {
  const [config, setConfig] = useState<WelcomeBarConfig>({});

  const setWelcomeBar = useCallback((newConfig: WelcomeBarConfig) => {
    setConfig(newConfig);
  }, []);

  const clearWelcomeBar = useCallback(() => {
    setConfig({});
  }, []);

  const value = useMemo(
    () => ({ config, setWelcomeBar, clearWelcomeBar }),
    [config, setWelcomeBar, clearWelcomeBar],
  );

  return (
    <WelcomeBarContext.Provider value={value}>
      {children}
    </WelcomeBarContext.Provider>
  );
}

export function useWelcomeBar() {
  const context = useContext(WelcomeBarContext);
  if (context === undefined) {
    throw new Error("useWelcomeBar must be used within a WelcomeBarProvider");
  }
  return context;
}

export function useWelcomeBarConfig() {
  const context = useContext(WelcomeBarContext);
  if (context === undefined) {
    throw new Error(
      "useWelcomeBarConfig must be used within a WelcomeBarProvider",
    );
  }
  return context.config;
}
