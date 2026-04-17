"use client";

import { useState } from "react";
import { Button } from "@/src/atoms";
import { OtrosAsociadosResultCard, ResultPageShell } from "@/src/organisms";
import { useUIContext } from "@/src/contexts";
import {
  OTROS_ASOCIADOS_PAYMENT_STEPS,
  OTROS_ASOCIADOS_PAYMENT_STEPS_PSE,
  mockOtrosAsociadosTransactionResult,
} from "@/src/mocks";
import {
  OtrosAsociadosTransactionResult,
  PayableProduct,
  FundingSourceType,
} from "@/src/types";

const SESSION_KEYS = [
  "otrosAsociadosBeneficiary",
  "otrosAsociadosAccountId",
  "otrosAsociadosSourceType",
  "otrosAsociadosProducts",
  "otrosAsociadosTotalAmount",
  "otrosAsociadosConfirmation",
];

export default function OtrosAsociadosResultadoPage() {
  const { hideBalances } = useUIContext();
  const [sourceType] = useState<FundingSourceType>(() => {
    if (typeof window === "undefined") return "cuenta";
    const stored = sessionStorage.getItem(
      "otrosAsociadosSourceType",
    ) as FundingSourceType | null;
    return stored || "cuenta";
  });

  const [result] = useState<OtrosAsociadosTransactionResult>(() => {
    if (typeof window === "undefined")
      return mockOtrosAsociadosTransactionResult;
    const totalAmount = sessionStorage.getItem("otrosAsociadosTotalAmount");
    const productsStr = sessionStorage.getItem("otrosAsociadosProducts");

    if (totalAmount && productsStr) {
      const products: PayableProduct[] = JSON.parse(productsStr);
      const firstProduct = products[0];
      return {
        ...mockOtrosAsociadosTransactionResult,
        amountPaid: parseInt(totalAmount, 10),
        creditLine: firstProduct?.name || "Pago a Asociado",
        productNumber: firstProduct?.productNumber || "***0000",
      };
    }

    return mockOtrosAsociadosTransactionResult;
  });

  const paymentSteps =
    sourceType === "pse"
      ? OTROS_ASOCIADOS_PAYMENT_STEPS_PSE
      : OTROS_ASOCIADOS_PAYMENT_STEPS;

  return (
    <ResultPageShell
      breadcrumbs={["Inicio", "Pagos", "Pago a otros asociados"]}
      welcomeBarTitle="Pago a otros asociados"
      startFlowPath="/pagos/otros-asociados"
      homePath="/pagos/otros-asociados"
      sessionKeysToClean={SESSION_KEYS}
      steps={paymentSteps}
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
        <OtrosAsociadosResultCard result={result} hideBalances={hideBalances} />
      )}
    </ResultPageShell>
  );
}
