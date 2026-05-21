"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs } from "@/src/molecules";
import { CodeInputCard } from "@/src/organisms";
import { useBrebPageHeader, useSMSCodeVerification } from "@/src/hooks";

const BASE_PATH = "/otros-servicios/seguridad/gestion-seguridad-productos";

export default function GestionSeguridadProductosSmsPage() {
  const router = useRouter();

  useBrebPageHeader("Gestión de Productos", BASE_PATH);

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
    sessionKey: "seguridadProductoDraft",
    fallbackPath: BASE_PATH,
    successPath: `${BASE_PATH}/resultado?status=success`,
    onSuccess: () => {
      sessionStorage.setItem("seguridadProductoStatus", "success");
    },
    onError: () => {
      sessionStorage.setItem("seguridadProductoStatus", "error");
    },
  });

  const handleBack = () => {
    router.push(BASE_PATH);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={["Inicio", "Seguridad", "Gestión de Productos", "Verificación"]}
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
