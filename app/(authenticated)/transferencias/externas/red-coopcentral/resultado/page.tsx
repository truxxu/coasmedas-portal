"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { RedCoopTransferResultCard } from "@/src/organisms";
import { useUIContext, useWelcomeBar } from "@/src/contexts";
import type { RedCoopTransferResult } from "@/src/types/redCoopTransfer";
import { RED_COOP_TRANSFER_STEPS } from "@/src/mocks";

export default function RedCoopResultadoPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const [result] = useState<RedCoopTransferResult | null>(() => {
    if (typeof window === "undefined") return null;

    const resultData = sessionStorage.getItem("redCoopTransferResult");
    if (!resultData) return null;

    try {
      return JSON.parse(resultData) as RedCoopTransferResult;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    setWelcomeBar({
      title: "Cuentas de mi Red Coopcentral",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    if (!result) {
      router.push("/transferencias/externas/red-coopcentral");
    }
  }, [result, router]);

  const clearSessionStorage = () => {
    sessionStorage.removeItem("redCoopTransferSourceId");
    sessionStorage.removeItem("redCoopTransferDestinationId");
    sessionStorage.removeItem("redCoopTransferAmount");
    sessionStorage.removeItem("redCoopTransferConcept");
    sessionStorage.removeItem("redCoopTransferConfirmation");
    sessionStorage.removeItem("redCoopTransferResult");
    sessionStorage.removeItem("redCoopTransferSavingsApi");
    sessionStorage.removeItem("redCoopTransferCreditsApi");
    sessionStorage.removeItem("redCoopTransferTxRequest");
    sessionStorage.removeItem("redCoopTransferSourceName");
    sessionStorage.removeItem("redCoopTransferDestBank");
    sessionStorage.removeItem("redCoopTransferDestAccNum");
  };

  const handlePrintSave = () => {
    window.print();
  };

  const handleNewTransaction = () => {
    clearSessionStorage();
    router.push("/transferencias/externas/red-coopcentral");
  };

  const handleFinish = () => {
    clearSessionStorage();
    router.push("/home");
  };

  const handleRetry = () => {
    // Go back to details to try again
    sessionStorage.removeItem("redCoopTransferConfirmation");
    sessionStorage.removeItem("redCoopTransferResult");
    router.push("/transferencias/externas/red-coopcentral");
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
        <Breadcrumbs items={["Inicio", "Transferencias", "Red Coopcentral"]} />
      </div>

      {/* Stepper - All completed */}
      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={5} steps={RED_COOP_TRANSFER_STEPS} />
      </div>

      {/* Result Card */}
      <RedCoopTransferResultCard result={result} hideBalances={hideBalances} />

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
