"use client";

import { useState } from "react";
import { Button } from "@/src/atoms";
import { ResultPageShell, TarjetaBloqueoResultCard } from "@/src/organisms";
import { TarjetaBloqueoResult } from "@/src/types/tarjeta-bloqueo";
import { TARJETA_BLOQUEO_STEPS } from "@/src/mocks";

const BREADCRUMBS = ["Inicio", "Tarjeta de Crédito", "Bloqueo y Activación"];
const SESSION_KEYS = [
  "tarjetaBloqueoCardId",
  "tarjetaBloqueoProduct",
  "tarjetaBloqueoConfirmation",
  "tarjetaBloqueoResult",
];

export default function BloquearResultadoPage() {
  const [result] = useState<TarjetaBloqueoResult | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = sessionStorage.getItem("tarjetaBloqueoResult");
    if (!stored) return null;
    try {
      return JSON.parse(stored) as TarjetaBloqueoResult;
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
      steps={TARJETA_BLOQUEO_STEPS}
      stepperCurrentStep={4}
      hasResult={!!result}
      actionsClassName="flex justify-end"
      renderActions={({ clearAndGoToHome }) => (
        <Button variant="primary" onClick={clearAndGoToHome}>
          Finalizar
        </Button>
      )}
    >
      {result && <TarjetaBloqueoResultCard result={result} />}
    </ResultPageShell>
  );
}
