"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { OtrosAsociadosResultCard } from "@/src/organisms";
import { useUIContext } from "@/src/contexts/UIContext";
import { useWelcomeBar } from "@/src/contexts";
import {
  OTROS_ASOCIADOS_PAYMENT_STEPS,
  OTROS_ASOCIADOS_PAYMENT_STEPS_PSE,
  mockOtrosAsociadosTransactionResult,
} from "@/src/mocks";
import { OtrosAsociadosTransactionResult, PayableProduct, FundingSourceType } from "@/src/types";

export default function OtrosAsociadosResultadoPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const [result, setResult] = useState<OtrosAsociadosTransactionResult | null>(
    null
  );
  const [sourceType, setSourceType] = useState<FundingSourceType>("cuenta");

  // Determine which stepper to use based on funding source
  const paymentSteps = sourceType === "pse"
    ? OTROS_ASOCIADOS_PAYMENT_STEPS_PSE
    : OTROS_ASOCIADOS_PAYMENT_STEPS;

  // Current step is final step: 4 for both flows
  const currentStep = 4;

  // Configure WelcomeBar on mount, clear on unmount
  useEffect(() => {
    setWelcomeBar({
      title: "Pago a otros asociados",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    // Get data from session and build result
    const totalAmount = sessionStorage.getItem("otrosAsociadosTotalAmount");
    const productsStr = sessionStorage.getItem("otrosAsociadosProducts");
    const storedSourceType = sessionStorage.getItem("otrosAsociadosSourceType") as FundingSourceType | null;

    // Set the source type for stepper display
    if (storedSourceType) {
      setSourceType(storedSourceType);
    }

    if (totalAmount && productsStr) {
      const products: PayableProduct[] = JSON.parse(productsStr);
      const firstProduct = products[0];

      setResult({
        ...mockOtrosAsociadosTransactionResult,
        amountPaid: parseInt(totalAmount, 10),
        creditLine: firstProduct?.name || "Pago a Asociado",
        productNumber: firstProduct?.productNumber || "***0000",
      });
    } else {
      setResult(mockOtrosAsociadosTransactionResult);
    }
  }, []);

  const handlePrintSave = () => {
    window.print();
  };

  const handleFinish = () => {
    // Clear session storage
    sessionStorage.removeItem("otrosAsociadosBeneficiary");
    sessionStorage.removeItem("otrosAsociadosAccountId");
    sessionStorage.removeItem("otrosAsociadosSourceType");
    sessionStorage.removeItem("otrosAsociadosProducts");
    sessionStorage.removeItem("otrosAsociadosTotalAmount");
    sessionStorage.removeItem("otrosAsociadosConfirmation");

    router.push("/pagos/otros-asociados");
  };

  if (!result) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-brand-gray-high">Cargando resultado...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Breadcrumbs items={["Inicio", "Pagos", "Pago a otros asociados"]} />
      </div>

      <Stepper currentStep={currentStep} steps={paymentSteps} />

      <OtrosAsociadosResultCard result={result} hideBalances={hideBalances} />

      <div className="flex justify-end gap-4">
        <Button variant="secondary" onClick={handlePrintSave}>
          Imprimir/Guardar
        </Button>
        <Button variant="primary" onClick={handleFinish}>
          Finalizar
        </Button>
      </div>
    </div>
  );
}
