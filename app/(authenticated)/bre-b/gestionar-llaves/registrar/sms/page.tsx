"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { CodeInputCard } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import { useSMSCodeVerification } from "@/src/hooks";
import { BREB_KEY_REGISTRATION_STEPS } from "@/src/mocks";
import type {
  BrebKeyRegistrationConfirmationData,
  BrebKeyRegistrationResult,
} from "@/src/types/brebKeyRegistration";

export default function RegistrarLlaveSmsPage() {
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
    sessionKey: "brebKeyRegistrationConfirmation",
    fallbackPath: "/bre-b/gestionar-llaves/registrar",
    successPath: "/bre-b/gestionar-llaves/registrar/resultado",
    onSuccess: () => {
      const raw = sessionStorage.getItem("brebKeyRegistrationConfirmation");
      if (!raw) return;
      const confirmation = JSON.parse(
        raw,
      ) as BrebKeyRegistrationConfirmationData;
      const result: BrebKeyRegistrationResult = {
        success: true,
        keyValue: confirmation.keyValue,
        keyTypeLabel: confirmation.keyTypeLabel,
        accountLabel: confirmation.accountLabel,
      };
      sessionStorage.setItem(
        "brebKeyRegistrationResult",
        JSON.stringify(result),
      );
    },
  });

  useEffect(() => {
    setWelcomeBar({
      title: "Registrar Llave",
      backHref: "/bre-b/gestionar-llaves/registrar/confirmacion",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const handleBack = () => {
    router.push("/bre-b/gestionar-llaves/registrar/confirmacion");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumbs items={["Inicio", "Gestión Llaves", "Registrar Llave"]} />
      </div>

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={3} steps={BREB_KEY_REGISTRATION_STEPS} />
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
