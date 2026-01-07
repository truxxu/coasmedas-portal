"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { CodeInputCard } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import { useSMSCodeVerification } from "@/src/hooks";
import { OTROS_ASOCIADOS_PAYMENT_STEPS, MOCK_VALID_CODE } from "@/src/mocks";

export default function OtrosAsociadosSmsPage() {
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

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
    sessionKey: "otrosAsociadosConfirmation",
    fallbackPath: "/pagos/otros-asociados/pago",
    successPath: "/pagos/otros-asociados/pago/resultado",
  });

  // Configure WelcomeBar on mount, clear on unmount
  useEffect(() => {
    setWelcomeBar({
      title: "Pago a otros asociados",
      backHref: "/pagos/otros-asociados/pago/confirmacion",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

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
        <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Procesando..." : "Pagar"}
        </Button>
      </div>
    </div>
  );
}
