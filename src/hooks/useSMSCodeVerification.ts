"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const RESEND_COOLDOWN_SECONDS = 60;

export interface SMSCodeVerificationConfig {
  /** Valid code for mock validation */
  validCode: string;
  /** Session storage key to check for session validation */
  sessionKey: string;
  /** Path to redirect if session is invalid */
  fallbackPath: string;
  /** Path to redirect on successful verification */
  successPath: string;
  /** Optional callback to build and store result before redirecting */
  onSuccess?: (code: string) => void;
  /** Optional callback on error */
  onError?: (code: string) => void;
}

export interface SMSCodeVerificationState {
  code: string;
  error: string;
  isResendDisabled: boolean;
  resendCountdown: number;
  isLoading: boolean;
}

export interface SMSCodeVerificationActions {
  handleCodeChange: (newCode: string) => void;
  handleResendCode: () => void;
  handleSubmit: () => Promise<void>;
}

export function useSMSCodeVerification(
  config: SMSCodeVerificationConfig
): SMSCodeVerificationState & SMSCodeVerificationActions {
  const router = useRouter();
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(false);
  const [resendCountdown, setResendCountdown] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Check if previous steps were completed
  useEffect(() => {
    const sessionData = sessionStorage.getItem(config.sessionKey);
    if (!sessionData) {
      router.push(config.fallbackPath);
    }
  }, [router, config.sessionKey, config.fallbackPath]);

  // Countdown timer for resend button
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCountdown > 0) {
      timer = setTimeout(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    } else if (resendCountdown === 0 && isResendDisabled) {
      setIsResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown, isResendDisabled]);

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
    setError("");
  }, []);

  const handleResendCode = useCallback(() => {
    console.log("Resending code...");
    setIsResendDisabled(true);
    setResendCountdown(RESEND_COOLDOWN_SECONDS);
    setCode("");
    setError("");
    // TODO: API call to resend SMS code
  }, []);

  const handleSubmit = async () => {
    if (code.length !== 6) {
      setError("Por favor ingresa el codigo de 6 digitos");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (code === config.validCode) {
        config.onSuccess?.(code);
        router.push(config.successPath);
      } else {
        config.onError?.(code);
        setError("Codigo incorrecto. Por favor intenta nuevamente.");
      }
    } catch {
      setError("Error al procesar el pago. Por favor intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    code,
    error,
    isResendDisabled,
    resendCountdown,
    isLoading,
    handleCodeChange,
    handleResendCode,
    handleSubmit,
  };
}
