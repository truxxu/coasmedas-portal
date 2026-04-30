"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { CodeInputCard } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import { useSMSCodeVerification } from "@/src/hooks";
import { BREB_KEY_MODIFICATION_STEPS } from "@/src/mocks";
import type {
  BrebKeyModificationConfirmationData,
  BrebKeyModificationResult,
} from "@/src/types/brebKeyModification";

export default function ModificarLlaveSmsPage() {
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
    sessionKey: "brebKeyModificationConfirmation",
    fallbackPath: "/bre-b/gestionar-llaves/modificar",
    successPath: "/bre-b/gestionar-llaves/modificar/resultado",
    onSuccess: () => {
      const raw = sessionStorage.getItem("brebKeyModificationConfirmation");
      if (!raw) return;
      const confirmation = JSON.parse(
        raw,
      ) as BrebKeyModificationConfirmationData;
      const result: BrebKeyModificationResult = {
        success: true,
        newKeyTypeLabel: confirmation.newKeyTypeLabel,
        newKeyValue: confirmation.newKeyValue,
        accountLabel: confirmation.accountLabel,
      };
      sessionStorage.setItem(
        "brebKeyModificationResult",
        JSON.stringify(result),
      );
    },
  });

  useEffect(() => {
    setWelcomeBar({
      title: "Modificar Llave",
      backHref: "/bre-b/gestionar-llaves/modificar/confirmacion",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const handleBack = () => {
    router.push("/bre-b/gestionar-llaves/modificar/confirmacion");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumbs items={["Inicio", "Bre-B", "Modificar Llave"]} />
      </div>

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={3} steps={BREB_KEY_MODIFICATION_STEPS} />
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
