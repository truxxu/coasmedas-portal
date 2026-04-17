"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

const RESEND_COOLDOWN_SECONDS = 60;

export interface SMSCodeVerificationConfig {
  /** Session storage key to check for session validation */
  sessionKey: string;
  /** Path to redirect if session is invalid */
  fallbackPath: string;
  /** Path to redirect on successful verification */
  successPath: string;
  /** Async handler for real API submission. Receives OTP code. Should throw on failure. */
  onSubmit?: (code: string) => Promise<void>;
  /** Optional callback to build and store result before redirecting */
  onSuccess?: (code: string) => void;
  /** Optional callback on error */
  onError?: (code: string) => void;
  /** Async handler for resending OTP */
  onResend?: () => Promise<void>;
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
  config: SMSCodeVerificationConfig,
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

  useEffect(() => {
    if (resendCountdown <= 0) return;
    const timer = setTimeout(() => {
      setResendCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  useEffect(() => {
    if (resendCountdown === 0 && isResendDisabled) {
      setIsResendDisabled(false);
    }
  }, [resendCountdown, isResendDisabled]);

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
    setError("");
  }, []);

  const handleResendCode = useCallback(() => {
    setIsResendDisabled(true);
    setResendCountdown(RESEND_COOLDOWN_SECONDS);
    setCode("");
    setError("");

    if (config.onResend) {
      config.onResend().catch((err) => {
        console.error("Error resending OTP:", err);
      });
    }
  }, [config]);

  const handleSubmit = async () => {
    if (code.length !== 6) {
      setError("Por favor ingresa el codigo de 6 digitos");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      if (config.onSubmit) {
        // Real API flow
        await config.onSubmit(code);
        config.onSuccess?.(code);
        router.push(config.successPath);
      } else {
        // Mock flow: accept any 6-digit code
        await new Promise((resolve) => setTimeout(resolve, 1500));
        config.onSuccess?.(code);
        router.push(config.successPath);
      }
    } catch (err) {
      config.onError?.(code);
      const message =
        err instanceof Error
          ? err.message
          : "Error al procesar el pago. Por favor intenta nuevamente.";
      setError(message);
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
