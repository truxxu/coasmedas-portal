"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { BrebKeyTransferResultCard } from "@/src/organisms";
import { useUIContext } from "@/src/contexts";
import { useBrebPageHeader } from "@/src/hooks";
import type { BrebKeyTransferResult } from "@/src/types/brebKeyTransfer";
import { BREB_KEY_TRANSFER_STEPS } from "@/src/mocks";
import {
  BREB_SESSION_KEYS,
  clearBrebFlow,
} from "@/src/constants/brebSessionKeys";

export default function BrebKeyTransferResultadoPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  useBrebPageHeader("Pagar con Llave");

  const [result] = useState<BrebKeyTransferResult | null>(() => {
    if (typeof window === "undefined") return null;
    const data = sessionStorage.getItem(BREB_SESSION_KEYS.keyTransfer.result);
    if (!data) return null;
    try {
      return JSON.parse(data) as BrebKeyTransferResult;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!result) {
      router.push("/bre-b/pagar-transferir-llave");
    }
  }, [result, router]);

  const clearSessionStorage = () => clearBrebFlow("keyTransfer");

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
    sessionStorage.removeItem(BREB_SESSION_KEYS.keyTransfer.confirmation);
    sessionStorage.removeItem(BREB_SESSION_KEYS.keyTransfer.result);
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
