"use client";

import { useState } from "react";
import { Button } from "@/src/atoms";
import { ResultPageShell, TarjetaClaveResultCard } from "@/src/organisms";
import { TarjetaClaveResult } from "@/src/types/tarjeta-clave";
import { TARJETA_CLAVE_STEPS } from "@/src/mocks";

const BREADCRUMBS = ["Inicio", "Gestionar Clave", "Cambiar Clave"];
const SESSION_KEYS = [
  "tarjetaClaveCambiarCardId",
  "tarjetaClaveCambiarProduct",
  "tarjetaClaveCambiarForm",
  "tarjetaClaveCambiarConfirmation",
  "tarjetaClaveCambiarResult",
];

export default function CambiarResultadoPage() {
  const [result] = useState<TarjetaClaveResult | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = sessionStorage.getItem("tarjetaClaveCambiarResult");
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
      welcomeBarTitle="Cambiar Clave"
      welcomeBarBackHref="/tarjeta"
      startFlowPath="/tarjeta/gestionar-clave/cambiar"
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
      {result && <TarjetaClaveResultCard mode="cambiar" result={result} />}
    </ResultPageShell>
  );
}
