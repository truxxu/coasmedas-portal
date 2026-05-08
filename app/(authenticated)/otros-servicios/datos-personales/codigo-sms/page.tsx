"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs } from "@/src/molecules";
import { CodeInputCard } from "@/src/organisms";
import { useBrebPageHeader, useSMSCodeVerification } from "@/src/hooks";

const BASE_PATH = "/otros-servicios/datos-personales";
const DRAFT_KEY = "datosPersonalesDraft";
const STATUS_KEY = "datosPersonalesStatus";

export default function DatosPersonalesSmsPage() {
  useBrebPageHeader("Datos Personales", BASE_PATH);
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
    sessionKey: DRAFT_KEY,
    fallbackPath: BASE_PATH,
    successPath: `${BASE_PATH}/resultado?status=success`,
    onSuccess: () => {
      sessionStorage.setItem(STATUS_KEY, "success");
    },
    onError: () => {
      sessionStorage.setItem(STATUS_KEY, "error");
    },
  });

  const handleBack = () => {
    router.push(BASE_PATH);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          "Inicio",
          "Otros Servicios",
          "Datos Personales",
          "Verificación",
        ]}
      />
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
          type="button"
          onClick={handleBack}
          disabled={isLoading}
          className="text-sm font-medium text-brand-navy hover:underline disabled:opacity-50"
        >
          Volver
        </button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isLoading || code.length !== 6}
        >
          {isLoading ? "Procesando..." : "Confirmar"}
        </Button>
      </div>
    </div>
  );
}
