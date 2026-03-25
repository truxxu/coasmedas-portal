"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { CodeInputCard } from "@/src/organisms";
import { Button } from "@/src/atoms";
import { useWelcomeBar, useUserContext } from "@/src/contexts";
import { useSMSCodeVerification } from "@/src/hooks";
import { APORTES_PAYMENT_STEPS } from "@/src/mocks/mockAportesPaymentData";
import { createPaymentTransaction } from "@/services/payments.service";
import { sendTransactionOtp } from "@/services/auth.service";
import { mapResultToAportes } from "@/lib/mappers/payments.mapper";
import type { AportesPaymentBreakdown } from "@/src/types/aportes-payment";

export default function VerificacionAportesPage() {
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const router = useRouter();
  const { user } = useUserContext();
  const { documentType, documentNumber } = user ?? {};

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
    sessionKey: "aportesPaymentConfirmation",
    fallbackPath: "/pagos/pagar-mis-productos/aportes",
    successPath: "/pagos/pagar-mis-productos/aportes/resultado",
    onSubmit: async (otp) => {
      if (!documentType || !documentNumber) throw new Error("Sesion no valida");
      const txRequestStr = sessionStorage.getItem("aportesTransactionRequest");
      if (!txRequestStr) throw new Error("Datos de transaccion no encontrados");
      const txRequest = JSON.parse(txRequestStr);
      const result = await createPaymentTransaction({
        documentType,
        documentNumber,
        otp,
        ...txRequest,
      });
      // Map and store result for the resultado page
      const breakdownStr = sessionStorage.getItem("aportesPaymentBreakdown");
      const breakdown: AportesPaymentBreakdown | null = breakdownStr
        ? JSON.parse(breakdownStr)
        : null;
      const mappedResult = mapResultToAportes(result, {
        lineaCredito: breakdown?.planName ?? "Aportes",
        numeroProducto: breakdown?.productNumber ?? "",
      });
      sessionStorage.setItem(
        "aportesPaymentResult",
        JSON.stringify(mappedResult),
      );
    },
    onResend: async () => {
      if (!documentType || !documentNumber) return;
      await sendTransactionOtp({
        documentType,
        documentNumber,
        trnType: "PaymentInternal",
      });
    },
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
      <Breadcrumbs
        items={["Inicio", "Pagos", "Pagar mis productos", "Pago de Aportes"]}
      />

      <div className="-mx-8 bg-white shadow-sm">
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
