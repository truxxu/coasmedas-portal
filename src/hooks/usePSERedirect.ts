"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface PSEPhase {
  message: string;
  duration: number;
}

export interface PSERedirectConfig {
  /** Session storage key to check for session validation */
  sessionKey: string;
  /** Path to redirect if session is invalid */
  fallbackPath: string;
  /** Path to redirect on completion */
  successPath: string;
  /**
   * Phases to show during the PSE flow.
   * If not provided, defaults to single phase "Conectando con PSE..." for 3 seconds.
   */
  phases?: PSEPhase[];
  /** Optional callback before redirecting to success path */
  onBeforeRedirect?: () => void;
}

const DEFAULT_PHASES: PSEPhase[] = [
  { message: "Conectando con PSE...", duration: 3000 },
];

export interface PSERedirectState {
  message: string;
  currentPhase: number;
  isSessionValid: boolean;
}

export function usePSERedirect(config: PSERedirectConfig): PSERedirectState {
  const router = useRouter();
  const phases = config.phases ?? DEFAULT_PHASES;
  const [currentPhase, setCurrentPhase] = useState(0);
  const [isSessionValid, setIsSessionValid] = useState(false);

  // Check if previous steps were completed
  useEffect(() => {
    const sessionData = sessionStorage.getItem(config.sessionKey);
    if (!sessionData) {
      router.push(config.fallbackPath);
    } else {
      setIsSessionValid(true);
    }
  }, [router, config.sessionKey, config.fallbackPath]);

  // Handle PSE redirect flow with phases
  useEffect(() => {
    if (!isSessionValid) return;

    const runPhases = async () => {
      for (let i = 0; i < phases.length; i++) {
        setCurrentPhase(i);
        await new Promise((resolve) => setTimeout(resolve, phases[i].duration));
      }

      // All phases complete, trigger callback and redirect
      config.onBeforeRedirect?.();
      router.push(config.successPath);
    };

    runPhases();
  }, [isSessionValid, router, config, phases]);

  return {
    message: phases[currentPhase]?.message ?? "Conectando con PSE...",
    currentPhase,
    isSessionValid,
  };
}
