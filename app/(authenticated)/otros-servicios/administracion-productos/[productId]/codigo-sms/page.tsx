"use client";

import { useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs } from "@/src/molecules";
import { CodeInputCard } from "@/src/organisms";
import { useBrebPageHeader, useSMSCodeVerification } from "@/src/hooks";
import { mockAdminProducts } from "@/src/mocks";

const BASE_PATH = "/otros-servicios/administracion-productos";

export default function AdminProductoSmsPage() {
  const router = useRouter();
  const params = useParams<{ productId: string }>();
  const productId = params?.productId ?? "";

  const product = useMemo(
    () => mockAdminProducts.find((p) => p.id === productId),
    [productId],
  );

  useBrebPageHeader(
    product
      ? `Editando ${product.displayName.split(" (")[0]}`
      : "Administración de Productos",
    `${BASE_PATH}/${productId}`,
  );

  const sessionKey = `adminProductoDraft:${productId}`;

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
    sessionKey,
    fallbackPath: `${BASE_PATH}/${productId}`,
    successPath: `${BASE_PATH}/${productId}/resultado?status=success`,
    onSuccess: () => {
      sessionStorage.setItem(`adminProductoStatus:${productId}`, "success");
    },
    onError: () => {
      sessionStorage.setItem(`adminProductoStatus:${productId}`, "error");
    },
  });

  const handleBack = () => {
    router.push(`${BASE_PATH}/${productId}`);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          "Inicio",
          "Administración de Productos",
          product
            ? `Editando ${product.displayName.split(" (")[0]}`
            : "Verificación",
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
