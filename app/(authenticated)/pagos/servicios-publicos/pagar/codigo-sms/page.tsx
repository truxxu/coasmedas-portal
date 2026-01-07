"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { CodeInputCard } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import { useSMSCodeVerification } from "@/src/hooks";
import {
  UTILITY_PAYMENT_STEPS,
  MOCK_VALID_CODE,
  mockUtilityPaymentResult,
  mockUtilityPaymentResultError,
} from "@/src/mocks";

export default function PagarServiciosCodigoSmsPage() {
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const handleSuccess = () => {
    const confirmationStr = sessionStorage.getItem("utilityPaymentConfirmation");
    if (confirmationStr) {
      const confirmation = JSON.parse(confirmationStr);
      const result = {
        ...mockUtilityPaymentResult,
        amountPaid: confirmation.totalAmount,
      };
      sessionStorage.setItem("utilityPaymentResult", JSON.stringify(result));
    } else {
      sessionStorage.setItem(
        "utilityPaymentResult",
        JSON.stringify(mockUtilityPaymentResult)
      );
    }
  };

  const handleError = () => {
    sessionStorage.setItem(
      "utilityPaymentResult",
      JSON.stringify(mockUtilityPaymentResultError)
    );
  };

  const {
    code,
    error,
    isResendDisabled,
    resendCountdown,
    isLoading,
    handleCodeChange,
    handleResendCode,
    handleSubmit,
  } = useSMSCodeVerification({
    validCode: MOCK_VALID_CODE,
    sessionKey: "utilityPaymentConfirmation",
    fallbackPath: "/pagos/servicios-publicos/pagar/detalle",
    successPath: "/pagos/servicios-publicos/pagar/respuesta",
    onSuccess: handleSuccess,
    onError: handleError,
  });

  // Configure WelcomeBar on mount, clear on unmount
  useEffect(() => {
    setWelcomeBar({
      title: "Pago de Servicios Publicos",
      backHref: "/pagos/servicios-publicos/pagar/confirmacion",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const handleBack = () => {
    router.push("/pagos/servicios-publicos/pagar/confirmacion");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Breadcrumbs items={["Inicio", "Pagos", "Pago Servicio Publico"]} />
        <Stepper currentStep={3} steps={UTILITY_PAYMENT_STEPS} />
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
        <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Procesando..." : "Pagar"}
        </Button>
      </div>
    </div>
  );
}
