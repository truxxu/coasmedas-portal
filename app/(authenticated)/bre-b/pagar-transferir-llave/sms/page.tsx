"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { CodeInputCard } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import { useSMSCodeVerification } from "@/src/hooks";
import {
  BREB_KEY_TRANSFER_STEPS,
  mockBrebKeyTransferResultSuccess,
} from "@/src/mocks";
import type { BrebKeyTransferResult } from "@/src/types/brebKeyTransfer";

export default function BrebKeyTransferSmsPage() {
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
    sessionKey: "brebKeyTransferConfirmation",
    fallbackPath: "/bre-b/pagar-transferir-llave",
    successPath: "/bre-b/pagar-transferir-llave/resultado",
    onSuccess: () => {
      const confirmationStr = sessionStorage.getItem(
        "brebKeyTransferConfirmation",
      );
      if (!confirmationStr) return;
      const confirmation = JSON.parse(confirmationStr);

      const now = new Date();
      const dateLabel = now.toLocaleDateString("es-CO", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      const timeLabel = now
        .toLocaleTimeString("es-CO", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
        .toLowerCase();

      const result: BrebKeyTransferResult = {
        ...mockBrebKeyTransferResultSuccess,
        sourceAccount: confirmation.sourceProduct,
        destinationHolder: confirmation.destinationHolder,
        destinationKey: confirmation.destinationKey,
        amount: confirmation.amount,
        transactionDate: dateLabel,
        transactionTime: timeLabel,
      };
      sessionStorage.setItem("brebKeyTransferResult", JSON.stringify(result));
    },
  });

  useEffect(() => {
    setWelcomeBar({
      title: "Pagar con Llave",
      backHref: "/bre-b/pagar-transferir-llave/confirmacion",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const handleBack = () => {
    router.push("/bre-b/pagar-transferir-llave/confirmacion");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumbs items={["Inicio", "Bre-B", "Pagar con Llave"]} />
      </div>

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={3} steps={BREB_KEY_TRANSFER_STEPS} />
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
          {isLoading ? "Procesando..." : "Continuar"}
        </Button>
      </div>
    </div>
  );
}
