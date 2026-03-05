"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { CodeInputCard } from "@/src/organisms";
import { Button } from "@/src/atoms";
import { useWelcomeBar, useUserContext } from "@/src/contexts";
import { useSMSCodeVerification } from "@/src/hooks";
import { PAYMENT_STEPS } from "@/src/mocks/mockPaymentData";
import { createPaymentTransaction } from "@/services/payments.service";
import { sendTransactionOtp } from "@/services/auth.service";
import { mapResultToTransaction } from "@/lib/mappers/payments.mapper";

export default function VerificacionPage() {
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
    sessionKey: "paymentConfirmationData",
    fallbackPath: "/pagos/pagar-mis-productos/pago-unificado",
    successPath: "/pagos/pagar-mis-productos/pago-unificado/resultado",
    onSubmit: async (otp) => {
      if (!documentType || !documentNumber) throw new Error("Sesion no valida");
      const txRequestStr = sessionStorage.getItem("unifiedTransactionRequest");
      if (!txRequestStr) throw new Error("Datos de transaccion no encontrados");
      const txRequest = JSON.parse(txRequestStr);
      const result = await createPaymentTransaction({
        documentType,
        documentNumber,
        otp,
        ...txRequest,
      });
      // Map and store result
      const mappedResult = mapResultToTransaction(result);
      sessionStorage.setItem("unifiedPaymentResult", JSON.stringify(mappedResult));
    },
    onResend: async () => {
      if (!documentType || !documentNumber) return;
      await sendTransactionOtp({ documentType, documentNumber, trnType: "PaymentInternal" });
    },
  });

  useEffect(() => {
    setWelcomeBar({
      title: "Pago Unificado",
      backHref: "/pagos/pagar-mis-productos",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const handleBack = () => {
    router.push("/pagos/pagar-mis-productos/pago-unificado/confirmacion");
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={["Inicio", "Pagos", "Pagar mis productos", "Pago Unificado"]}
      />

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={3} steps={PAYMENT_STEPS} />
      </div>

      <CodeInputCard
        code={code}
        onCodeChange={handleCodeChange}
        hasError={!!error}
        errorMessage={error}
        onResend={handleResendCode}
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
