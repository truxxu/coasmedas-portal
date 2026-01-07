"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { CodeInputCard } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import { useSMSCodeVerification } from "@/src/hooks";
import {
  OBLIGACION_PAYMENT_STEPS_ACCOUNT,
  MOCK_OBLIGACION_VALID_CODE,
  mockObligacionTransactionResult,
  mockObligacionTransactionResultError,
} from "@/src/mocks/mockObligacionPaymentData";
import { ObligacionConfirmationData } from "@/src/types/obligacion-payment";

export default function ObligacionCodigoSmsPage() {
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const handleSuccess = () => {
    const confirmationStr = sessionStorage.getItem("obligacionPaymentConfirmation");
    if (confirmationStr) {
      const confirmation: ObligacionConfirmationData = JSON.parse(confirmationStr);
      const result = {
        ...mockObligacionTransactionResult,
        lineaCredito: confirmation.productoAPagar,
        numeroProducto: confirmation.numeroProducto,
        valorPagado: confirmation.valorAPagar,
      };
      sessionStorage.setItem("obligacionPaymentResult", JSON.stringify(result));
    } else {
      sessionStorage.setItem(
        "obligacionPaymentResult",
        JSON.stringify(mockObligacionTransactionResult)
      );
    }
  };

  const handleError = () => {
    sessionStorage.setItem(
      "obligacionPaymentResult",
      JSON.stringify(mockObligacionTransactionResultError)
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
    validCode: MOCK_OBLIGACION_VALID_CODE,
    sessionKey: "obligacionPaymentConfirmation",
    fallbackPath: "/pagos/pagar-mis-productos/obligaciones",
    successPath: "/pagos/pagar-mis-productos/obligaciones/resultado",
    onSuccess: handleSuccess,
    onError: handleError,
  });

  // Configure WelcomeBar on mount, clear on unmount
  useEffect(() => {
    setWelcomeBar({
      title: "Pago de Obligaciones",
      backHref: "/pagos/pagar-mis-productos/obligaciones/confirmacion",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const handleBack = () => {
    router.push("/pagos/pagar-mis-productos/obligaciones/confirmacion");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <Breadcrumbs items={["Inicio", "Pagos", "Pago de Obligaciones"]} />
        <Stepper currentStep={3} steps={OBLIGACION_PAYMENT_STEPS_ACCOUNT} />
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
          className="text-sm font-medium text-brand-navy hover:underline disabled:opacity-50"
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
