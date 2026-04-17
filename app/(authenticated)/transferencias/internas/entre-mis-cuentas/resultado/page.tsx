"use client";

import { useState } from "react";
import { ResultPageShell, TransferResultCard } from "@/src/organisms";
import { useUIContext } from "@/src/contexts";
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
  const { hideBalances } = useUIContext();
  const [result] = useState<TransferResult | null>(() => {
    if (typeof window === "undefined") return null;
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

  return (
    <ResultPageShell
      breadcrumbs={["Inicio", "Transferencias", "Entre mis Cuentas"]}
      welcomeBarTitle="Entre mis Cuentas"
      startFlowPath="/transferencias/internas/entre-mis-cuentas"
      sessionKeysToClean={SESSION_KEYS}
      steps={TRANSFER_STEPS}
      hasResult={!!result}
    >
      {result && (
        <TransferResultCard result={result} hideBalances={hideBalances} />
      )}
    </ResultPageShell>
  );
}
