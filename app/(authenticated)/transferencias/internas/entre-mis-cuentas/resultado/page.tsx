"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { TransferResultCard } from "@/src/organisms";
import { useUIContext, useWelcomeBar } from "@/src/contexts";
import type { TransferResult } from "@/src/types/transfer";
import { TRANSFER_STEPS } from "@/src/mocks";

const SESSION_KEYS = [
  "transferSourceId",
  "transferDestinationId",
  "transferAmount",
  "transferSourcesSavingsApi",
  "transferSourcesCreditsApi",
  "transferTargetSavingsApi",
  "transferTargetCreditsApi",
  "transferTargetInvestmentsApi",
  "transferTransactionRequest",
  "transferConfirmation",
  "transferSourceName",
  "transferDestinationName",
  "transferResult",
];

export default function ResultadoPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const [result] = useState<TransferResult | null>(() => {
    if (typeof window === "undefined") return null;

    // Read real API result stored by SMS step
    const apiResultStr = sessionStorage.getItem("transferResult");
    if (apiResultStr) {
      try {
        return JSON.parse(apiResultStr) as TransferResult;
      } catch {
        // fall through
      }
    }

    return null;
  });

  useEffect(() => {
    setWelcomeBar({
      title: "Entre mis Cuentas",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    if (!result) {
      router.push("/transferencias/internas/entre-mis-cuentas");
    }
  }, [result, router]);

  const clearSessionData = () => {
    for (const key of SESSION_KEYS) {
      sessionStorage.removeItem(key);
    }
  };

  const handlePrintSave = () => {
    window.print();
  };

  const handleNewTransaction = () => {
    clearSessionData();
    router.push("/transferencias/internas/entre-mis-cuentas");
  };

  const handleFinish = () => {
    clearSessionData();
    router.push("/home");
  };

  if (!result) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Breadcrumbs
          items={["Inicio", "Transferencias", "Entre mis Cuentas"]}
        />
      </div>

      {/* Stepper - All completed */}
      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={5} steps={TRANSFER_STEPS} />
      </div>

      {/* Result Card */}
      <TransferResultCard result={result} hideBalances={hideBalances} />

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
