"use client";

import { useState } from "react";
import { Button } from "@/src/atoms";
import { ResultPageShell, TransactionResultCard } from "@/src/organisms";
import { TransactionResult } from "@/src/types/payment";
import { PAYMENT_STEPS } from "@/src/mocks/mockPaymentData";

const SESSION_KEYS = [
  "paymentAccountId",
  "paymentMethod",
  "paymentConfirmationData",
  "unifiedSourceAccountApi",
  "unifiedPaymentProducts",
  "unifiedPendingPayments",
  "unifiedTransactionRequest",
  "unifiedPaymentResult",
  "pseTransactionError",
];

export default function ResultadoPage() {
  const [result] = useState<TransactionResult | null>(() => {
    if (typeof window === "undefined") return null;

    const resultStr = sessionStorage.getItem("unifiedPaymentResult");
    if (resultStr) {
      try {
        return JSON.parse(resultStr) as TransactionResult;
      } catch {
        // fall through
      }
    }

    const pseErrorStr = sessionStorage.getItem("pseTransactionError");
    if (pseErrorStr) {
      return {
        status: "error",
        transactionCost: 0,
        transactionDate: "",
        transactionTime: "",
        approvalNumber: "",
        description:
          JSON.parse(pseErrorStr).message || "Error al conectar con PSE",
      };
    }

    return null;
  });

  return (
    <ResultPageShell
      breadcrumbs={["Inicio", "Pagos", "Pagar mis productos", "Pago Unificado"]}
      welcomeBarTitle="Pago Unificado"
      welcomeBarBackHref="/pagos/pagar-mis-productos"
      startFlowPath="/pagos/pagar-mis-productos/pago-unificado"
      homePath="/pagos/pagar-mis-productos"
      sessionKeysToClean={SESSION_KEYS}
      steps={PAYMENT_STEPS}
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
      {result && <TransactionResultCard result={result} />}
    </ResultPageShell>
  );
}
