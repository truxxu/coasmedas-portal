"use client";

import { useState } from "react";
import { Button } from "@/src/atoms";
import { ResultPageShell, TarjetaClaveResultCard } from "@/src/organisms";
import { TarjetaClaveResult } from "@/src/types/tarjeta-clave";
import { TARJETA_CLAVE_STEPS } from "@/src/mocks";

const BREADCRUMBS = ["Inicio", "Gestionar Clave", "Olvidé mi Clave"];
const SESSION_KEYS = [
  "tarjetaClaveOlvideCardId",
  "tarjetaClaveOlvideProduct",
  "tarjetaClaveOlvideForm",
  "tarjetaClaveOlvideConfirmation",
  "tarjetaClaveOlvideResult",
];

export default function OlvideResultadoPage() {
  const [result] = useState<TarjetaClaveResult | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = sessionStorage.getItem("tarjetaClaveOlvideResult");
    if (!stored) return null;
    try {
      return JSON.parse(stored) as TarjetaClaveResult;
    } catch {
      return null;
    }
  });

  return (
    <ResultPageShell
      breadcrumbs={BREADCRUMBS}
      welcomeBarTitle="Olvidé mi Clave"
      welcomeBarBackHref="/tarjeta"
      startFlowPath="/tarjeta/gestionar-clave/olvide"
      homePath="/tarjeta"
      sessionKeysToClean={SESSION_KEYS}
      steps={TARJETA_CLAVE_STEPS}
      stepperCurrentStep={4}
      hasResult={!!result}
      actionsClassName="flex justify-end"
      renderActions={({ clearAndGoToHome }) => (
        <Button variant="primary" onClick={clearAndGoToHome}>
          Finalizar
        </Button>
      )}
    >
      {result && <TarjetaClaveResultCard mode="olvide" result={result} />}
    </ResultPageShell>
  );
}
