"use client";

import { useState } from "react";
import { Button } from "@/src/atoms";
import { ResultPageShell, TarjetaAvanceResultCard } from "@/src/organisms";
import { useUIContext } from "@/src/contexts";
import { TarjetaAvanceResult } from "@/src/types/tarjeta-avance";
import { TARJETA_AVANCE_STEPS } from "@/src/mocks";

const BREADCRUMBS = ["Inicio", "Tarjeta de Crédito", "Realizar Avance"];
const SESSION_KEYS = [
  "tarjetaAvanceCardId",
  "tarjetaAvanceProduct",
  "tarjetaAvanceValor",
  "tarjetaAvanceCuotas",
  "tarjetaAvanceDestinationId",
  "tarjetaAvanceDestinationDisplay",
  "tarjetaAvanceConfirmation",
  "tarjetaAvanceResult",
];

export default function AvanceResultadoPage() {
  const { hideBalances } = useUIContext();

  const [result] = useState<TarjetaAvanceResult | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = sessionStorage.getItem("tarjetaAvanceResult");
    if (!stored) return null;
    try {
      return JSON.parse(stored) as TarjetaAvanceResult;
    } catch {
      return null;
    }
  });

  return (
    <ResultPageShell
      breadcrumbs={BREADCRUMBS}
      welcomeBarTitle="Realizar Avance"
      welcomeBarBackHref="/tarjeta"
      startFlowPath="/tarjeta/avance"
      homePath="/tarjeta"
      sessionKeysToClean={SESSION_KEYS}
      steps={TARJETA_AVANCE_STEPS}
      stepperCurrentStep={4}
      hasResult={!!result}
      actionsClassName="flex justify-end"
      renderActions={({ clearAndGoToHome }) => (
        <Button variant="primary" onClick={clearAndGoToHome}>
          Finalizar
        </Button>
      )}
    >
      {result && (
        <TarjetaAvanceResultCard result={result} hideBalances={hideBalances} />
      )}
    </ResultPageShell>
  );
}
