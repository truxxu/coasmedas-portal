"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { CodeInputCard } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import { useSMSCodeVerification } from "@/src/hooks";
import {
  PROTECTION_PAYMENT_STEPS,
  MOCK_PROTECTION_VALID_CODE,
  mockProtectionPaymentResult,
  mockProtectionPaymentResultError,
} from "@/src/mocks";

export default function ProteccionCodigoSmsPage() {
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const handleSuccess = () => {
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
  };

  const handleError = () => {
    sessionStorage.setItem(
      "protectionPaymentResult",
      JSON.stringify(mockProtectionPaymentResultError)
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
    validCode: MOCK_PROTECTION_VALID_CODE,
    sessionKey: "protectionPaymentConfirmation",
    fallbackPath: "/pagos/pagar-mis-productos/proteccion",
    successPath: "/pagos/pagar-mis-productos/proteccion/respuesta",
    onSuccess: handleSuccess,
    onError: handleError,
  });

  // Configure WelcomeBar on mount, clear on unmount
  useEffect(() => {
    setWelcomeBar({
      title: "Pago de Proteccion",
      backHref: "/pagos/pagar-mis-productos/proteccion/confirmacion",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

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
        <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Procesando..." : "Pagar"}
        </Button>
      </div>
    </div>
  );
}
