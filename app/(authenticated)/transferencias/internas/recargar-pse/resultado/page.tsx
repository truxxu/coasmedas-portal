"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { PSERechargeResultCard } from "@/src/organisms";
import { useUIContext, useWelcomeBar } from "@/src/contexts";
import type { PSERechargeResult } from "@/src/types/pseRecharge";
import { TRANSFER_STEPS } from "@/src/mocks";

export default function ResultadoPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const [result] = useState<PSERechargeResult | null>(() => {
    if (typeof window === "undefined") return null;

    const resultData = sessionStorage.getItem("pseRechargeTransactionResult");
    if (!resultData) return null;

    try {
      return JSON.parse(resultData) as PSERechargeResult;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    setWelcomeBar({
      title: "Recargar con PSE",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    if (!result) {
      router.push("/transferencias/internas/recargar-pse");
    }
  }, [result, router]);

  const clearSessionStorage = () => {
    sessionStorage.removeItem("pseRechargeDestinationId");
    sessionStorage.removeItem("pseRechargeAmount");
    sessionStorage.removeItem("pseRechargeConfirmation");
    sessionStorage.removeItem("pseRechargeTransactionResult");
  };

  const handlePrintSave = () => {
    window.print();
  };

  const handleNewTransaction = () => {
    clearSessionStorage();
    router.push("/transferencias/internas/recargar-pse");
  };

  const handleFinish = () => {
    clearSessionStorage();
    router.push("/transferencias/internas/");
  };

  if (!result) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="text-brand-gray-medium">Cargando resultado...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Breadcrumbs items={["Inicio", "Transferencias", "Recargar con PSE"]} />
      </div>

      {/* Stepper - All completed */}
      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={5} steps={TRANSFER_STEPS} />
      </div>

      {/* Result Card */}
      <PSERechargeResultCard result={result} hideBalances={hideBalances} />

      {/* Actions */}
      <div className="flex flex-wrap justify-end gap-3">
        <Button variant="secondary" onClick={handlePrintSave}>
          Imprimir/Guardar
        </Button>
        <Button variant="secondary" onClick={handleNewTransaction}>
          Realizar otra transaccion
        </Button>
        <Button variant="primary" onClick={handleFinish}>
          Finalizar
        </Button>
      </div>
    </div>
  );
}
