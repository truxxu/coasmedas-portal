"use client";

import { useState } from "react";
import { Button } from "@/src/atoms";
import { AportesTransactionResultCard, ResultPageShell } from "@/src/organisms";
import { useUIContext } from "@/src/contexts";
import { APORTES_PAYMENT_STEPS } from "@/src/mocks/mockAportesPaymentData";
import { AportesTransactionResult } from "@/src/types/aportes-payment";

const SESSION_KEYS = [
  "aportesPaymentAccountId",
  "aportesPaymentValor",
  "aportesPaymentBreakdown",
  "aportesPaymentConfirmation",
  "aportesPaymentMethod",
  "aportesSourceAccount",
  "aportesContributions",
  "aportesTransactionRequest",
  "aportesPaymentResult",
  "pseTransactionError",
];

export default function ResultadoAportesPage() {
  const { hideBalances } = useUIContext();

  const [result] = useState<AportesTransactionResult | null>(() => {
    if (typeof window === "undefined") return null;

    const apiResultStr = sessionStorage.getItem("aportesPaymentResult");
    if (apiResultStr) {
      try {
        return JSON.parse(apiResultStr) as AportesTransactionResult;
      } catch {
        // fall through
      }
    }

    const pseErrorStr = sessionStorage.getItem("pseTransactionError");
    if (pseErrorStr) {
      const breakdownStr = sessionStorage.getItem("aportesPaymentBreakdown");
      const breakdown = breakdownStr ? JSON.parse(breakdownStr) : null;
      return {
        status: "error",
        lineaCredito: breakdown?.planName ?? "Aportes",
        numeroProducto: breakdown?.productNumber ?? "",
        valorPagado: 0,
        costoTransaccion: 0,
        fechaTransmision: "",
        horaTransaccion: "",
        numeroAprobacion: "-",
        descripcion:
          JSON.parse(pseErrorStr).message || "Error al conectar con PSE",
      };
    }

    return null;
  });

  return (
    <ResultPageShell
      breadcrumbs={[
        "Inicio",
        "Pagos",
        "Pagar mis productos",
        "Pago de Aportes",
      ]}
      welcomeBarTitle="Pago de Aportes"
      welcomeBarBackHref="/pagos/pagar-mis-productos"
      startFlowPath="/pagos/pagar-mis-productos/aportes"
      homePath="/pagos/pagar-mis-productos"
      sessionKeysToClean={SESSION_KEYS}
      steps={APORTES_PAYMENT_STEPS}
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
        <AportesTransactionResultCard
          result={result}
          hideBalances={hideBalances}
        />
      )}
    </ResultPageShell>
  );
}
