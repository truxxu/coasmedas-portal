"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { CodeInputCard } from "@/src/organisms";
import { useWelcomeBar, useUserContext } from "@/src/contexts";
import { useSMSCodeVerification } from "@/src/hooks";
import { PROTECTION_PAYMENT_STEPS } from "@/src/mocks";
import { createPaymentTransaction } from "@/services/payments.service";
import { sendTransactionOtp } from "@/services/auth.service";
import { mapResultToProtection } from "@/lib/mappers/payments.mapper";
import type { ProtectionPaymentConfirmationData } from "@/src/types/protection-payment";

export default function ProteccionCodigoSmsPage() {
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
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
    sessionKey: "protectionPaymentConfirmation",
    fallbackPath: "/pagos/pagar-mis-productos/proteccion",
    successPath: "/pagos/pagar-mis-productos/proteccion/respuesta",
    onSubmit: async (otp) => {
      if (!documentType || !documentNumber) throw new Error("Sesion no valida");
      const txRequestStr = sessionStorage.getItem(
        "protectionTransactionRequest",
      );
      if (!txRequestStr) throw new Error("Datos de transaccion no encontrados");
      const txRequest = JSON.parse(txRequestStr);
      const result = await createPaymentTransaction({
        documentType,
        documentNumber,
        otp,
        ...txRequest,
      });
      // Map and store result
      const confirmationStr = sessionStorage.getItem(
        "protectionPaymentConfirmation",
      );
      const confirmation: ProtectionPaymentConfirmationData | null =
        confirmationStr ? JSON.parse(confirmationStr) : null;
      const mappedResult = mapResultToProtection(result, {
        creditLine: confirmation?.productToPay ?? "Protección",
        productNumber: confirmation?.policyNumber ?? "",
      });
      sessionStorage.setItem(
        "protectionPaymentResult",
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

  useEffect(() => {
    setWelcomeBar({
      title: "Pago de Protección y Actividades",
      backHref: "/pagos/pagar-mis-productos/proteccion/confirmacion",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const handleBack = () => {
    router.push("/pagos/pagar-mis-productos/proteccion/confirmacion");
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={["Inicio", "Pagos", "Pagos de Protección"]} />

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={3} steps={PROTECTION_PAYMENT_STEPS} />
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
