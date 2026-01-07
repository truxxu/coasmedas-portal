"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { AportesTransactionResultCard } from "@/src/organisms";
import { Button } from "@/src/atoms";
import { useUIContext } from "@/src/contexts/UIContext";
import { useWelcomeBar } from "@/src/contexts";
import {
  APORTES_PAYMENT_STEPS,
  mockAportesTransactionResult,
} from "@/src/mocks/mockAportesPaymentData";
import { AportesTransactionResult } from "@/src/types/aportes-payment";

export default function ResultadoAportesPage() {
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const [result, setResult] = useState<AportesTransactionResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Set welcome bar on mount
  useEffect(() => {
    setWelcomeBar({
      title: "Pago de Aportes",
      backHref: "/pagos/pagar-mis-productos",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    // Get data from session and build result
    const valor = sessionStorage.getItem("aportesPaymentValor");
    const breakdownStr = sessionStorage.getItem("aportesPaymentBreakdown");

    if (valor && breakdownStr) {
      try {
        const breakdown = JSON.parse(breakdownStr);
        setResult({
          ...mockAportesTransactionResult,
          valorPagado: parseInt(valor, 10),
          lineaCredito: breakdown.planName,
          numeroProducto: breakdown.productNumber,
        });
      } catch {
        // If parsing fails, use default mock result
        setResult(mockAportesTransactionResult);
      }
    } else {
      // No session data, use default mock result
      setResult(mockAportesTransactionResult);
    }
    setIsLoading(false);
  }, []);

  const handlePrintSave = () => {
    window.print();
  };

  const handleFinish = () => {
    // Clear all session storage keys for this flow
    sessionStorage.removeItem("aportesPaymentAccountId");
    sessionStorage.removeItem("aportesPaymentValor");
    sessionStorage.removeItem("aportesPaymentBreakdown");
    sessionStorage.removeItem("aportesPaymentConfirmation");
    sessionStorage.removeItem("aportesPaymentMethod");

    router.push("/pagos/pagar-mis-productos");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-brand-navy">Cargando resultado...</div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Breadcrumbs
          items={["Inicio", "Pagos", "Pagar mis productos", "Pago de Aportes"]}
        />
        <Stepper currentStep={4} steps={APORTES_PAYMENT_STEPS} />
      </div>

      <AportesTransactionResultCard
        result={result}
        hideBalances={hideBalances}
      />

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
