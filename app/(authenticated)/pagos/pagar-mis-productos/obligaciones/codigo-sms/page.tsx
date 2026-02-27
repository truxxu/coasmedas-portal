"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { CodeInputCard } from "@/src/organisms";
import { useWelcomeBar, useUserContext } from "@/src/contexts";
import { useSMSCodeVerification } from "@/src/hooks";
import { OBLIGACION_PAYMENT_STEPS_ACCOUNT } from "@/src/mocks/mockObligacionPaymentData";
import { createPaymentTransaction } from "@/services/payments.service";
import { sendTransactionOtp } from "@/services/auth.service";
import { mapResultToObligacion } from "@/lib/mappers/payments.mapper";
import type { ObligacionPaymentProduct } from "@/src/types/obligacion-payment";

export default function ObligacionCodigoSmsPage() {
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
    sessionKey: "obligacionPaymentConfirmation",
    fallbackPath: "/pagos/pagar-mis-productos/obligaciones",
    successPath: "/pagos/pagar-mis-productos/obligaciones/resultado",
    onSubmit: async (otp) => {
      if (!documentType || !documentNumber) throw new Error("Sesion no valida");
      const txRequestStr = sessionStorage.getItem("obligacionTransactionRequest");
      if (!txRequestStr) throw new Error("Datos de transaccion no encontrados");
      const txRequest = JSON.parse(txRequestStr);
      const result = await createPaymentTransaction({
        documentType,
        documentNumber,
        otp,
        ...txRequest,
      });
      // Map and store result
      const productStr = sessionStorage.getItem("obligacionPaymentProduct");
      const product: ObligacionPaymentProduct | null = productStr ? JSON.parse(productStr) : null;
      const mappedResult = mapResultToObligacion(result, {
        lineaCredito: product?.name ?? "Obligacion",
        numeroProducto: product?.productNumber ?? "",
      });
      sessionStorage.setItem("obligacionPaymentResult", JSON.stringify(mappedResult));
    },
    onResend: async () => {
      if (!documentType || !documentNumber) return;
      await sendTransactionOtp({ documentType, documentNumber, trnType: "PaymentInternal" });
    },
  });

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
      <Breadcrumbs items={["Inicio", "Pagos", "Pago de Obligaciones"]} />

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={3} steps={OBLIGACION_PAYMENT_STEPS_ACCOUNT} />
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
