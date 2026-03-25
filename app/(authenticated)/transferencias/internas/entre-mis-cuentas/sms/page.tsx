"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { CodeInputCard } from "@/src/organisms";
import { useWelcomeBar, useUserContext } from "@/src/contexts";
import { useSMSCodeVerification } from "@/src/hooks";
import { TRANSFER_STEPS } from "@/src/mocks";
import { createInternalTransfer } from "@/services/transfers.service";
import { sendTransactionOtp } from "@/services/auth.service";
import { mapTransferResult } from "@/lib/mappers/transfers.mapper";

export default function SMSVerificationPage() {
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
    sessionKey: "transferConfirmation",
    fallbackPath: "/transferencias/internas/entre-mis-cuentas",
    successPath: "/transferencias/internas/entre-mis-cuentas/resultado",
    onSubmit: async (otp) => {
      if (!documentType || !documentNumber) throw new Error("Sesion no valida");

      const txRequestStr = sessionStorage.getItem("transferTransactionRequest");
      if (!txRequestStr) throw new Error("Datos de transaccion no encontrados");

      const txRequest = JSON.parse(txRequestStr);
      const result = await createInternalTransfer({
        documentType,
        documentNumber,
        otp,
        ...txRequest,
      });

      // Map and store result for the resultado page
      const sourceName = sessionStorage.getItem("transferSourceName") || "";
      const destinationName =
        sessionStorage.getItem("transferDestinationName") || "";
      const mappedResult = mapTransferResult(result, {
        sourceType: sourceName,
        productNumber: destinationName,
      });
      sessionStorage.setItem("transferResult", JSON.stringify(mappedResult));
    },
    onResend: async () => {
      if (!documentType || !documentNumber) return;
      await sendTransactionOtp({
        documentType,
        documentNumber,
        trnType: "TransferInternal",
      });
    },
  });

  useEffect(() => {
    setWelcomeBar({
      title: "Entre mis Cuentas",
      backHref: "/transferencias/internas/entre-mis-cuentas/confirmacion",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const handleBack = () => {
    router.push("/transferencias/internas/entre-mis-cuentas/confirmacion");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Breadcrumbs
          items={["Inicio", "Transferencias", "Entre mis Cuentas"]}
        />
      </div>

      {/* Stepper */}
      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={3} steps={TRANSFER_STEPS} />
      </div>

      {/* SMS Input Card */}
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

      {/* Actions */}
      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          disabled={isLoading}
          className="text-sm font-medium text-brand-teal-dark hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Volver
        </button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isLoading || code.length !== 6}
        >
          {isLoading ? "Procesando..." : "Pagar"}
        </Button>
      </div>
    </div>
  );
}
