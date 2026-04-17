"use client";

import { useState } from "react";
import { Button } from "@/src/atoms";
import { ResultPageShell, TarjetaClaveResultCard } from "@/src/organisms";
import { TarjetaClaveResult } from "@/src/types/tarjeta-clave";
import { TARJETA_CLAVE_STEPS } from "@/src/mocks";

const BREADCRUMBS = ["Inicio", "Gestionar Clave", "Asignar Clave"];
const SESSION_KEYS = [
  "tarjetaClaveAsignarCardId",
  "tarjetaClaveAsignarProduct",
  "tarjetaClaveAsignarForm",
  "tarjetaClaveAsignarConfirmation",
  "tarjetaClaveAsignarResult",
];

export default function AsignarResultadoPage() {
  const [result] = useState<TarjetaClaveResult | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = sessionStorage.getItem("tarjetaClaveAsignarResult");
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
      welcomeBarTitle="Asignar Clave"
      welcomeBarBackHref="/tarjeta"
      startFlowPath="/tarjeta/gestionar-clave/asignar"
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
      {result && <TarjetaClaveResultCard mode="asignar" result={result} />}
    </ResultPageShell>
  );
}
