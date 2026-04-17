"use client";

import { useState } from "react";
import { CupoRotativoResultCard, ResultPageShell } from "@/src/organisms";
import { useUIContext } from "@/src/contexts";
import type { CupoRotativoTransferResult } from "@/src/types";
import { TRANSFER_STEPS } from "@/src/mocks";

const SESSION_KEYS = [
  "cupoRotativoSelectedCupoId",
  "cupoRotativoDestinationId",
  "cupoRotativoAmount",
  "cupoRotativoConfirmation",
  "cupoRotativoTransferResult",
];

export default function ResultadoPage() {
  const { hideBalances } = useUIContext();
  const [result] = useState<CupoRotativoTransferResult | null>(() => {
    if (typeof window === "undefined") return null;

    const resultData = sessionStorage.getItem("cupoRotativoTransferResult");
    if (!resultData) return null;

    try {
      return JSON.parse(resultData) as CupoRotativoTransferResult;
    } catch {
      return null;
    }
  });

  return (
    <ResultPageShell
      breadcrumbs={["Inicio", "Transferencias", "Desde Cupos Rotativos"]}
      welcomeBarTitle="Desde Cupos Rotativos"
      startFlowPath="/transferencias/internas/desde-cupos-rotativos"
      homePath="/transferencias/internas"
      sessionKeysToClean={SESSION_KEYS}
      steps={TRANSFER_STEPS}
      hasResult={!!result}
      newTransactionLabel="Realizar otra transacción"
    >
      {result && (
        <CupoRotativoResultCard result={result} hideBalances={hideBalances} />
      )}
    </ResultPageShell>
  );
}
