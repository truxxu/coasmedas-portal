"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { ExternalTransferResultCard } from "@/src/organisms";
import { useUIContext, useWelcomeBar } from "@/src/contexts";
import type { ExternalTransferResult } from "@/src/types/externalTransfer";
import { EXTERNAL_TRANSFER_STEPS } from "@/src/mocks";

export default function ResultadoPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const [result, setResult] = useState<ExternalTransferResult | null>(null);

  useEffect(() => {
    setWelcomeBar({
      title: "A Otros Bancos",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    // Get result from session storage
    const resultData = sessionStorage.getItem("externalTransferResult");

    if (!resultData) {
      router.push("/transferencias/otros-bancos");
      return;
    }

    try {
      const parsedResult = JSON.parse(resultData) as ExternalTransferResult;
      setResult(parsedResult);
    } catch {
      router.push("/transferencias/otros-bancos");
    }
  }, [router]);

  const clearSessionStorage = () => {
    sessionStorage.removeItem("externalTransferSourceId");
    sessionStorage.removeItem("externalTransferDestinationId");
    sessionStorage.removeItem("externalTransferAmount");
    sessionStorage.removeItem("externalTransferConcept");
    sessionStorage.removeItem("externalTransferConfirmation");
    sessionStorage.removeItem("externalTransferResult");
  };

  const handlePrintSave = () => {
    window.print();
  };

  const handleNewTransaction = () => {
    clearSessionStorage();
    router.push("/transferencias/otros-bancos");
  };

  const handleFinish = () => {
    clearSessionStorage();
    router.push("/home");
  };

  const handleRetry = () => {
    // Go back to details to try again
    sessionStorage.removeItem("externalTransferConfirmation");
    sessionStorage.removeItem("externalTransferResult");
    router.push("/transferencias/otros-bancos");
  };

  if (!result) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="text-brand-gray-medium">Cargando resultado...</span>
      </div>
    );
  }

  const isSuccess = result.status === "success";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Breadcrumbs items={["Inicio", "Transferencias", "A Otros Bancos"]} />
      </div>

      {/* Stepper - All completed */}
      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={5} steps={EXTERNAL_TRANSFER_STEPS} />
      </div>

      {/* Result Card */}
      <ExternalTransferResultCard result={result} hideBalances={hideBalances} />

      {/* Actions */}
      <div className="flex flex-wrap justify-end gap-3">
        {isSuccess ? (
          <>
            <Button variant="secondary" onClick={handlePrintSave}>
              Imprimir/Guardar
            </Button>
            <Button variant="secondary" onClick={handleNewTransaction}>
              Realizar otra transaccion
            </Button>
            <Button variant="primary" onClick={handleFinish}>
              Finalizar
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" onClick={handleRetry}>
              Reintentar
            </Button>
            <Button variant="primary" onClick={handleFinish}>
              Volver al inicio
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
