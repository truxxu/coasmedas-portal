"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { ObligacionResultCard } from "@/src/organisms";
import { useUIContext } from "@/src/contexts/UIContext";
import { useWelcomeBar } from "@/src/contexts";
import {
  OBLIGACION_PAYMENT_STEPS,
  mockObligacionTransactionResult,
} from "@/src/mocks/mockObligacionPaymentData";
import {
  ObligacionTransactionResult,
  ObligacionPaymentProduct,
} from "@/src/types/obligacion-payment";

export default function ResultadoPage() {
  const { clearWelcomeBar, setWelcomeBar } = useWelcomeBar();
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const [result, setResult] = useState<ObligacionTransactionResult | null>(
    null
  );

  const breadcrumbItems = [
    "Inicio",
    "Pagos",
    "Pagar mis productos",
    "Pago de Obligaciones",
  ];

  useEffect(() => {
    setWelcomeBar({
      title: "Pago de Obligaciones",
      backHref: "/pagos/pagar-mis-productos",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    // Get data from session and build result
    const valor = sessionStorage.getItem("obligacionPaymentValor");
    const productStr = sessionStorage.getItem("obligacionPaymentProduct");

    if (valor && productStr) {
      const product: ObligacionPaymentProduct = JSON.parse(productStr);
      setResult({
        ...mockObligacionTransactionResult,
        valorPagado: parseInt(valor, 10),
        lineaCredito: product.name,
        numeroProducto: product.productNumber,
      });
    } else {
      setResult(mockObligacionTransactionResult);
    }
  }, []);

  const handlePrintSave = () => {
    window.print();
  };

  const handleFinish = () => {
    // Clear session storage
    sessionStorage.removeItem("obligacionPaymentProductId");
    sessionStorage.removeItem("obligacionPaymentValor");
    sessionStorage.removeItem("obligacionPaymentProduct");
    sessionStorage.removeItem("obligacionPaymentConfirmation");

    router.push("/pagos");
  };

  if (!result) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-[15px] text-gray-600">Cargando resultado...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbItems} />

      <Stepper currentStep={4} steps={OBLIGACION_PAYMENT_STEPS} />

      <ObligacionResultCard result={result} hideBalances={hideBalances} />

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={handlePrintSave}>
          Imprimir/Guardar
        </Button>
        <Button variant="primary" onClick={handleFinish}>
          Finalizar
        </Button>
      </div>
    </div>
  );
}
