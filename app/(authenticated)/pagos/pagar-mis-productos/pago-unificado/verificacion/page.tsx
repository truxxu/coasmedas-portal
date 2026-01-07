"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { CodeInputCard } from "@/src/organisms";
import { Button } from "@/src/atoms";
import { useWelcomeBar } from "@/src/contexts";
import { PAYMENT_STEPS, MOCK_VALID_CODE } from "@/src/mocks/mockPaymentData";

const RESEND_COOLDOWN = 60; // seconds

export default function VerificacionPage() {
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const router = useRouter();

  const [code, setCode] = useState("");
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingData, setIsCheckingData] = useState(true);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  // Configure WelcomeBar on mount
  useEffect(() => {
    setWelcomeBar({
      title: "Pago Unificado",
      backHref: "/pagos/pagar-mis-productos",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  // Check for required data from previous steps
  useEffect(() => {
    const confirmationData = sessionStorage.getItem("paymentConfirmationData");

    if (!confirmationData) {
      // No data from previous steps, redirect to start
      router.push("/pagos/pagar-mis-productos/pago-unificado");
      return;
    }

    setIsCheckingData(false);
  }, [router]);

  // Resend countdown timer
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (resendCountdown === 0 && resendDisabled) {
      setResendDisabled(false);
    }
  }, [resendCountdown, resendDisabled]);

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
    // Clear error when user starts typing
    if (newCode.length > 0) {
      setHasError(false);
      setErrorMessage("");
    }
  }, []);

  const handleResend = useCallback(() => {
    if (resendDisabled) return;

    // Start cooldown
    setResendDisabled(true);
    setResendCountdown(RESEND_COOLDOWN);

    // Clear current code and errors
    setCode("");
    setHasError(false);
    setErrorMessage("");

    // In a real app, this would call an API to resend the code
    console.log("Resending code...");
  }, [resendDisabled]);

  const handleSubmit = async () => {
    // Validate code length
    if (code.length !== 6) {
      setHasError(true);
      setErrorMessage("Por favor ingresa los 6 dígitos del código");
      return;
    }

    setIsLoading(true);
    setHasError(false);
    setErrorMessage("");

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Validate code (mock validation)
    if (code !== MOCK_VALID_CODE) {
      setIsLoading(false);
      setHasError(true);
      setErrorMessage("El código ingresado es incorrecto. Intenta de nuevo.");
      return;
    }

    // Code is valid, navigate to result page
    // Store success status for result page
    sessionStorage.setItem("paymentStatus", "success");
    router.push("/pagos/pagar-mis-productos/pago-unificado/resultado");
  };

  const handleBack = () => {
    router.push("/pagos/pagar-mis-productos/pago-unificado/confirmacion");
  };

  if (isCheckingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-brand-gray-high">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Breadcrumbs
          items={["Inicio", "Pagos", "Pagar mis productos", "Pago Unificado"]}
        />
        <Stepper currentStep={3} steps={PAYMENT_STEPS} />
      </div>

      <CodeInputCard
        code={code}
        onCodeChange={handleCodeChange}
        hasError={hasError}
        errorMessage={errorMessage}
        onResend={handleResend}
        resendDisabled={resendDisabled}
        resendCountdown={resendCountdown}
        disabled={isLoading}
      />

      <div className="flex justify-between">
        <Button variant="ghost" onClick={handleBack} disabled={isLoading}>
          Volver
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Procesando..." : "Pagar"}
        </Button>
      </div>
    </div>
  );
}
