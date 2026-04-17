"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { ExternalTransferResultCard, ResultPageShell } from "@/src/organisms";
import { useUIContext } from "@/src/contexts";
import type { ExternalTransferResult } from "@/src/types/externalTransfer";
import { EXTERNAL_TRANSFER_STEPS } from "@/src/mocks";

const SESSION_KEYS = [
  "externalTransferSourceId",
  "externalTransferDestinationId",
  "externalTransferAmount",
  "externalTransferConcept",
  "externalTransferConfirmation",
  "externalTransferResult",
  "externalTransferSavingsApi",
  "externalTransferCreditsApi",
  "externalTransferTxRequest",
  "externalTransferSourceName",
  "externalTransferDestBank",
  "externalTransferDestAccNum",
];

export default function ResultadoPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const [result] = useState<ExternalTransferResult | null>(() => {
    if (typeof window === "undefined") return null;
    const resultData = sessionStorage.getItem("externalTransferResult");
    if (!resultData) return null;
    try {
      return JSON.parse(resultData) as ExternalTransferResult;
    } catch {
      return null;
    }
  });

  const isSuccess = result?.status === "success";

  const handleRetry = () => {
    sessionStorage.removeItem("externalTransferConfirmation");
    sessionStorage.removeItem("externalTransferResult");
    router.push("/transferencias/externas/otros-bancos");
  };

  return (
    <ResultPageShell
      breadcrumbs={["Inicio", "Transferencias", "A Otros Bancos"]}
      welcomeBarTitle="A Otros Bancos"
      startFlowPath="/transferencias/externas/otros-bancos"
      sessionKeysToClean={SESSION_KEYS}
      steps={EXTERNAL_TRANSFER_STEPS}
      hasResult={!!result}
      renderActions={({ printSave, clearAndGoToStart, clearAndGoToHome }) =>
        isSuccess ? (
          <>
            <Button variant="secondary" onClick={printSave}>
              Imprimir/Guardar
            </Button>
            <Button variant="secondary" onClick={clearAndGoToStart}>
              Realizar otra transaccion
            </Button>
            <Button variant="primary" onClick={clearAndGoToHome}>
              Finalizar
            </Button>
          </>
        ) : (
          <>
            <Button variant="secondary" onClick={handleRetry}>
              Reintentar
            </Button>
            <Button variant="primary" onClick={clearAndGoToHome}>
              Volver al inicio
            </Button>
          </>
        )
      }
    >
      {result && (
        <ExternalTransferResultCard
          result={result}
          hideBalances={hideBalances}
        />
      )}
    </ResultPageShell>
  );
}
