"use client";

import { useState } from "react";
import { PSERechargeResultCard, ResultPageShell } from "@/src/organisms";
import { useUIContext } from "@/src/contexts";
import type { PSERechargeResult } from "@/src/types/pseRecharge";
import { TRANSFER_STEPS } from "@/src/mocks";

const SESSION_KEYS = [
  "pseRechargeDestinationId",
  "pseRechargeAmount",
  "pseRechargeConfirmation",
  "pseRechargeTransactionResult",
];

export default function ResultadoPage() {
  const { hideBalances } = useUIContext();
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

  return (
    <ResultPageShell
      breadcrumbs={["Inicio", "Transferencias", "Recargar con PSE"]}
      welcomeBarTitle="Recargar con PSE"
      startFlowPath="/transferencias/internas/recargar-pse"
      homePath="/transferencias/internas/"
      sessionKeysToClean={SESSION_KEYS}
      steps={TRANSFER_STEPS}
      hasResult={!!result}
    >
      {result && (
        <PSERechargeResultCard result={result} hideBalances={hideBalances} />
      )}
    </ResultPageShell>
  );
}
