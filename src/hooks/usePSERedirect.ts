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
  /** Path to redirect on completion (used by mock flow; real flow redirects externally) */
  successPath: string;
  /**
   * Phases to show during the PSE flow.
   * If not provided, defaults to single phase "Conectando con PSE..." for 3 seconds.
   */
  phases?: PSEPhase[];
  /** Optional callback before redirecting to success path */
  onBeforeRedirect?: () => void;
  /** Async handler that calls the API and returns an external redirect URL */
  onCreateTransaction?: () => Promise<string>;
  /** Path to redirect on API error (typically the result page with error state) */
  errorPath?: string;
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
      if (config.onCreateTransaction) {
        // Real API flow: show first phase, then call API
        setCurrentPhase(0);
        await new Promise((resolve) =>
          setTimeout(resolve, phases[0]?.duration ?? 2000),
        );

        try {
          const paymentUrl = await config.onCreateTransaction();
          config.onBeforeRedirect?.();
          window.location.href = paymentUrl;
        } catch (err) {
          console.error("PSE transaction error:", err);
          // Store error state for result page
          const errorMessage =
            err instanceof Error ? err.message : "Error al conectar con PSE";
          sessionStorage.setItem(
            "pseTransactionError",
            JSON.stringify({ error: true, message: errorMessage }),
          );
          router.push(config.errorPath ?? config.successPath);
        }
      } else {
        // Legacy mock flow: run all phases, then redirect internally
        for (let i = 0; i < phases.length; i++) {
          setCurrentPhase(i);
          await new Promise((resolve) =>
            setTimeout(resolve, phases[i].duration),
          );
        }

        config.onBeforeRedirect?.();
        router.push(config.successPath);
      }
    };

    runPhases();
  }, [isSessionValid, router, config, phases]);

  return {
    message: phases[currentPhase]?.message ?? "Conectando con PSE...",
    currentPhase,
    isSessionValid,
  };
}
