"use client";

import { useMemo } from "react";
import { Button } from "@/src/atoms";
import { ResultPageShell, TarjetaPaymentResultCard } from "@/src/organisms";
import { useUIContext } from "@/src/contexts";
import { TarjetaPaymentResult } from "@/src/types/tarjeta-payment";
import { TARJETA_PAYMENT_STEPS } from "@/src/mocks";

const BREADCRUMBS = ["Inicio", "Tarjeta de Crédito", "Pagar Tarjeta"];
const SESSION_KEYS = [
  "tarjetaPaymentCardId",
  "tarjetaPaymentProduct",
  "tarjetaPaymentValor",
  "tarjetaSourceAccountId",
  "tarjetaSourceAccountDisplay",
  "tarjetaPaymentConfirmation",
  "tarjetaPaymentResult",
];

export default function PagarTarjetaResultadoPage() {
  const { hideBalances } = useUIContext();

  const result = useMemo<TarjetaPaymentResult | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = sessionStorage.getItem("tarjetaPaymentResult");
    if (!stored) return null;
    try {
      return JSON.parse(stored) as TarjetaPaymentResult;
    } catch {
      return null;
    }
  }, []);

  return (
    <ResultPageShell
      breadcrumbs={BREADCRUMBS}
      welcomeBarTitle="Pagar Tarjeta"
      welcomeBarBackHref="/tarjeta"
      startFlowPath="/tarjeta/pagar"
      homePath="/tarjeta"
      sessionKeysToClean={SESSION_KEYS}
      steps={TARJETA_PAYMENT_STEPS}
      stepperCurrentStep={4}
      hasResult={!!result}
      actionsClassName="flex justify-end gap-4"
      renderActions={({ printSave, clearAndGoToHome }) => (
        <>
          <Button variant="secondary" onClick={printSave}>
            Imprimir/Guardar
          </Button>
          <Button variant="primary" onClick={clearAndGoToHome}>
            Finalizar
          </Button>
        </>
      )}
    >
      {result && (
        <TarjetaPaymentResultCard result={result} hideBalances={hideBalances} />
      )}
    </ResultPageShell>
  );
}
