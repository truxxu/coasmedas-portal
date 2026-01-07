"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { CodeInputCard } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import {
  OTROS_ASOCIADOS_PAYMENT_STEPS,
  MOCK_VALID_CODE,
} from "@/src/mocks";

const RESEND_COOLDOWN_SECONDS = 60;

export default function OtrosAsociadosSmsPage() {
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const [code, setCode] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(false);
  const [resendCountdown, setResendCountdown] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Configure WelcomeBar on mount, clear on unmount
  useEffect(() => {
    setWelcomeBar({
      title: "Pago a otros asociados",
      backHref: "/pagos/otros-asociados/pago/confirmacion",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  // Check if previous steps were completed
  useEffect(() => {
    const confirmationData = sessionStorage.getItem("otrosAsociadosConfirmation");
    if (!confirmationData) {
      router.push("/pagos/otros-asociados/pago");
    }
  }, [router]);

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
    // TODO: API call to resend SMS code
  }, []);

  const handlePay = async () => {
    if (code.length !== 6) {
      setError("Por favor ingresa el código de 6 dígitos");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (code === MOCK_VALID_CODE) {
        router.push("/pagos/otros-asociados/pago/resultado");
      } else {
        setError("Código incorrecto. Por favor intenta nuevamente.");
      }
    } catch {
      setError("Error al procesar el pago. Por favor intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/pagos/otros-asociados/pago/confirmacion");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Breadcrumbs items={["Inicio", "Pagos", "Pago a otros asociados"]} />
        <Stepper currentStep={3} steps={OTROS_ASOCIADOS_PAYMENT_STEPS} />
      </div>

      <CodeInputCard
        code={code}
        onCodeChange={handleCodeChange}
        onResend={handleResendCode}
        hasError={!!error}
        errorMessage={error}
        resendDisabled={isResendDisabled}
        resendCountdown={resendCountdown > 0 ? resendCountdown : undefined}
        disabled={isLoading}
      />

      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          disabled={isLoading}
          className="text-sm font-medium text-brand-teal-dark hover:underline disabled:opacity-50"
        >
          Volver
        </button>
        <Button variant="primary" onClick={handlePay} disabled={isLoading}>
          {isLoading ? "Procesando..." : "Pagar"}
        </Button>
      </div>
    </div>
  );
}
