"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { BrebKeyTransferResultCard } from "@/src/organisms";
import { useUIContext, useWelcomeBar } from "@/src/contexts";
import type { BrebKeyTransferResult } from "@/src/types/brebKeyTransfer";
import { BREB_KEY_TRANSFER_STEPS } from "@/src/mocks";

export default function BrebKeyTransferResultadoPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const [result] = useState<BrebKeyTransferResult | null>(() => {
    if (typeof window === "undefined") return null;
    const data = sessionStorage.getItem("brebKeyTransferResult");
    if (!data) return null;
    try {
      return JSON.parse(data) as BrebKeyTransferResult;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    setWelcomeBar({ title: "Pagar con Llave" });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    if (!result) {
      router.push("/bre-b/pagar-transferir-llave");
    }
  }, [result, router]);

  const clearSessionStorage = () => {
    sessionStorage.removeItem("brebKeyTransferSourceId");
    sessionStorage.removeItem("brebKeyTransferDestinationKey");
    sessionStorage.removeItem("brebKeyTransferAmount");
    sessionStorage.removeItem("brebKeyTransferConfirmation");
    sessionStorage.removeItem("brebKeyTransferResult");
  };

  const handleDownload = () => {
    window.print();
  };

  const handleNewTransaction = () => {
    clearSessionStorage();
    router.push("/bre-b/pagar-transferir-llave");
  };

  const handleFinish = () => {
    clearSessionStorage();
    router.push("/home");
  };

  const handleRetry = () => {
    sessionStorage.removeItem("brebKeyTransferConfirmation");
    sessionStorage.removeItem("brebKeyTransferResult");
    router.push("/bre-b/pagar-transferir-llave");
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
      <div className="flex items-center justify-between">
        <Breadcrumbs items={["Inicio", "Bre-B", "Pagar con Llave"]} />
      </div>

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={5} steps={BREB_KEY_TRANSFER_STEPS} />
      </div>

      <BrebKeyTransferResultCard result={result} hideBalances={hideBalances} />

      <div className="flex flex-wrap justify-end gap-3">
        {isSuccess ? (
          <>
            <Button variant="secondary" onClick={handleDownload}>
              Descargar Comprobante
            </Button>
            <Button variant="secondary" onClick={handleNewTransaction}>
              Realizar otra transacción Bre-B
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
