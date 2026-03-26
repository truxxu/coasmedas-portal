"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { AportesTransactionResultCard } from "@/src/organisms";
import { Button } from "@/src/atoms";
import { useUIContext } from "@/src/contexts/UIContext";
import { useWelcomeBar } from "@/src/contexts";
import { APORTES_PAYMENT_STEPS } from "@/src/mocks/mockAportesPaymentData";
import { AportesTransactionResult } from "@/src/types/aportes-payment";

export default function ResultadoAportesPage() {
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const router = useRouter();
  const { hideBalances } = useUIContext();

  const [result] = useState<AportesTransactionResult | null>(() => {
    if (typeof window === "undefined") return null;

    // Try to read real API result first (stored by verificacion page)
    const apiResultStr = sessionStorage.getItem("aportesPaymentResult");
    if (apiResultStr) {
      try {
        return JSON.parse(apiResultStr) as AportesTransactionResult;
      } catch {
        // fall through
      }
    }

    // Check for PSE error
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

  // Set welcome bar on mount
  useEffect(() => {
    setWelcomeBar({
      title: "Pago de Aportes",
      backHref: "/pagos/pagar-mis-productos",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  // Redirect if no result data
  useEffect(() => {
    if (!result) {
      router.push("/pagos/pagar-mis-productos/aportes");
    }
  }, [result, router]);

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
    sessionStorage.removeItem("aportesSourceAccount");
    sessionStorage.removeItem("aportesContributions");
    sessionStorage.removeItem("aportesTransactionRequest");
    sessionStorage.removeItem("aportesPaymentResult");
    sessionStorage.removeItem("pseTransactionError");

    router.push("/pagos/pagar-mis-productos");
  };

  if (!result) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={["Inicio", "Pagos", "Pagar mis productos", "Pago de Aportes"]}
      />

      <div className="-mx-8 bg-white shadow-sm">
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
