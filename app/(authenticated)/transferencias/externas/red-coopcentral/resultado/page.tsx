"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { RedCoopTransferResultCard, ResultPageShell } from "@/src/organisms";
import { useUIContext } from "@/src/contexts";
import type { RedCoopTransferResult } from "@/src/types/redCoopTransfer";
import { RED_COOP_TRANSFER_STEPS } from "@/src/mocks";

const SESSION_KEYS = [
  "redCoopTransferSourceId",
  "redCoopTransferDestinationId",
  "redCoopTransferAmount",
  "redCoopTransferConcept",
  "redCoopTransferConfirmation",
  "redCoopTransferResult",
  "redCoopTransferSavingsApi",
  "redCoopTransferCreditsApi",
  "redCoopTransferTxRequest",
  "redCoopTransferSourceName",
  "redCoopTransferDestBank",
  "redCoopTransferDestAccNum",
];

export default function RedCoopResultadoPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
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

  const isSuccess = result?.status === "success";

  const handleRetry = () => {
    sessionStorage.removeItem("redCoopTransferConfirmation");
    sessionStorage.removeItem("redCoopTransferResult");
    router.push("/transferencias/externas/red-coopcentral");
  };

  return (
    <ResultPageShell
      breadcrumbs={["Inicio", "Transferencias", "Red Coopcentral"]}
      welcomeBarTitle="Cuentas de mi Red Coopcentral"
      startFlowPath="/transferencias/externas/red-coopcentral"
      sessionKeysToClean={SESSION_KEYS}
      steps={RED_COOP_TRANSFER_STEPS}
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
        <RedCoopTransferResultCard
          result={result}
          hideBalances={hideBalances}
        />
      )}
    </ResultPageShell>
  );
}
