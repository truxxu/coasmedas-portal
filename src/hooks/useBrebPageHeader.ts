"use client";

import { useEffect } from "react";
import { useWelcomeBar } from "@/src/contexts";

export function useBrebPageHeader(title: string, backHref?: string): void {
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  useEffect(() => {
    setWelcomeBar({ title, ...(backHref ? { backHref } : {}) });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar, title, backHref]);
}
