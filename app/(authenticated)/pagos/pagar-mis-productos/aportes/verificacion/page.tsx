"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { CodeInputCard } from "@/src/organisms";
import { Button } from "@/src/atoms";
import { useWelcomeBar } from "@/src/contexts";
import { useSMSCodeVerification } from "@/src/hooks";
import {
  APORTES_PAYMENT_STEPS,
  APORTES_MOCK_VALID_CODE,
} from "@/src/mocks/mockAportesPaymentData";

export default function VerificacionAportesPage() {
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const router = useRouter();

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
    validCode: APORTES_MOCK_VALID_CODE,
    sessionKey: "aportesPaymentConfirmation",
    fallbackPath: "/pagos/pagar-mis-productos/aportes",
    successPath: "/pagos/pagar-mis-productos/aportes/resultado",
  });

  // Set welcome bar on mount
  useEffect(() => {
    setWelcomeBar({
      title: "Pago de Aportes",
      backHref: "/pagos/pagar-mis-productos/aportes/confirmacion",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const handleBack = () => {
    router.push("/pagos/pagar-mis-productos/aportes/confirmacion");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Breadcrumbs
          items={["Inicio", "Pagos", "Pagar mis productos", "Pago de Aportes"]}
        />
        <Stepper currentStep={3} steps={APORTES_PAYMENT_STEPS} />
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
