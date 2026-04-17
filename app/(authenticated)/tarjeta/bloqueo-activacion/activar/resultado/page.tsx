"use client";

import { useState } from "react";
import { Button } from "@/src/atoms";
import { ResultPageShell, TarjetaActivacionResultCard } from "@/src/organisms";
import { TarjetaActivacionResult } from "@/src/types/tarjeta-activacion";
import { TARJETA_ACTIVACION_STEPS } from "@/src/mocks";

const BREADCRUMBS = ["Inicio", "Tarjeta de Crédito", "Bloqueo y Activación"];
const SESSION_KEYS = [
  "tarjetaActivacionCardId",
  "tarjetaActivacionProduct",
  "tarjetaActivacionForm",
  "tarjetaActivacionConfirmation",
  "tarjetaActivacionResult",
];

export default function ActivarResultadoPage() {
  const [result] = useState<TarjetaActivacionResult | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = sessionStorage.getItem("tarjetaActivacionResult");
    if (!stored) return null;
    try {
      return JSON.parse(stored) as TarjetaActivacionResult;
    } catch {
      return null;
    }
  });

  return (
    <ResultPageShell
      breadcrumbs={BREADCRUMBS}
      welcomeBarTitle="Bloqueo y Activación"
      welcomeBarBackHref="/tarjeta"
      startFlowPath="/tarjeta/bloqueo-activacion"
      homePath="/tarjeta"
      sessionKeysToClean={SESSION_KEYS}
      steps={TARJETA_ACTIVACION_STEPS}
      stepperCurrentStep={4}
      hasResult={!!result}
      actionsClassName="flex justify-end"
      renderActions={({ clearAndGoToHome }) => (
        <Button variant="primary" onClick={clearAndGoToHome}>
          Finalizar
        </Button>
      )}
    >
      {result && <TarjetaActivacionResultCard result={result} />}
    </ResultPageShell>
  );
}
