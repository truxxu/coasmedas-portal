"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { CodeInputCard } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import {
  PROTECTION_PAYMENT_STEPS,
  MOCK_PROTECTION_VALID_CODE,
  mockProtectionPaymentResult,
  mockProtectionPaymentResultError,
} from "@/src/mocks";

const RESEND_COOLDOWN_SECONDS = 60;

export default function ProteccionCodigoSmsPage() {
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
      title: "Pago de Proteccion",
      backHref: "/pagos/pagar-mis-productos/proteccion/confirmacion",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  // Check if previous steps were completed
  useEffect(() => {
    const confirmationData = sessionStorage.getItem("protectionPaymentConfirmation");
    if (!confirmationData) {
      router.push("/pagos/pagar-mis-productos/proteccion");
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
    setCode("");
    setError("");
  }, []);

  const handlePay = async () => {
    if (code.length !== 6) {
      setError("Por favor ingresa el codigo de 6 digitos");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (code === MOCK_PROTECTION_VALID_CODE) {
        // Get confirmation data to populate result with actual amount
        const confirmationStr = sessionStorage.getItem("protectionPaymentConfirmation");
        if (confirmationStr) {
          const confirmation = JSON.parse(confirmationStr);
          const result = {
            ...mockProtectionPaymentResult,
            creditLine: confirmation.productToPay,
            productNumber: confirmation.policyNumber,
            amountPaid: confirmation.amountToPay,
          };
          sessionStorage.setItem("protectionPaymentResult", JSON.stringify(result));
        } else {
          sessionStorage.setItem(
            "protectionPaymentResult",
            JSON.stringify(mockProtectionPaymentResult)
          );
        }
        router.push("/pagos/pagar-mis-productos/proteccion/respuesta");
      } else {
        // Store error result
        sessionStorage.setItem(
          "protectionPaymentResult",
          JSON.stringify(mockProtectionPaymentResultError)
        );
        setError("Codigo incorrecto. Por favor intenta nuevamente.");
      }
    } catch {
      setError("Error al procesar el pago. Por favor intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/pagos/pagar-mis-productos/proteccion/confirmacion");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Breadcrumbs items={["Inicio", "Pagos", "Pagos de Proteccion"]} />
        <Stepper currentStep={3} steps={PROTECTION_PAYMENT_STEPS} />
      </div>

      {/* SMS Code Input Card */}
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

      {/* Footer Actions */}
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
