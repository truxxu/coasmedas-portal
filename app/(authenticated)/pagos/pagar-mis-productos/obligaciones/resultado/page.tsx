"use client";

import { useState } from "react";
import { Button } from "@/src/atoms";
import { ObligacionResultCard, ResultPageShell } from "@/src/organisms";
import { useUIContext } from "@/src/contexts";
import { OBLIGACION_PAYMENT_STEPS } from "@/src/mocks/mockObligacionPaymentData";
import { ObligacionTransactionResult } from "@/src/types/obligacion-payment";

const SESSION_KEYS = [
  "obligacionPaymentProductId",
  "obligacionPaymentValor",
  "obligacionPaymentProduct",
  "obligacionPaymentConfirmation",
  "obligacionPaymentMethod",
  "obligacionSourceAccountId",
  "obligacionSourceAccountDisplay",
  "obligacionSourceAccountApi",
  "obligacionTargetProductApi",
  "obligacionTransactionRequest",
  "obligacionPaymentResult",
  "pseTransactionError",
];

export default function ResultadoPage() {
  const { hideBalances } = useUIContext();

  const [result] = useState<ObligacionTransactionResult | null>(() => {
    if (typeof window === "undefined") return null;

    const apiResultStr = sessionStorage.getItem("obligacionPaymentResult");
    if (apiResultStr) {
      try {
        return JSON.parse(apiResultStr) as ObligacionTransactionResult;
      } catch {
        // fall through
      }
    }

    const pseErrorStr = sessionStorage.getItem("pseTransactionError");
    if (pseErrorStr) {
      const productStr = sessionStorage.getItem("obligacionPaymentProduct");
      const product = productStr ? JSON.parse(productStr) : null;
      return {
        status: "error",
        lineaCredito: product?.name ?? "Obligacion",
        numeroProducto: product?.productNumber ?? "",
        valorPagado: 0,
        costoTransaccion: 0,
        abonoExcedente: "-",
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
        "Pago de Obligaciones",
      ]}
      welcomeBarTitle="Pago de Obligaciones"
      welcomeBarBackHref="/pagos/pagar-mis-productos"
      startFlowPath="/pagos/pagar-mis-productos/obligaciones"
      homePath="/pagos"
      sessionKeysToClean={SESSION_KEYS}
      steps={OBLIGACION_PAYMENT_STEPS}
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
        <ObligacionResultCard result={result} hideBalances={hideBalances} />
      )}
    </ResultPageShell>
  );
}
