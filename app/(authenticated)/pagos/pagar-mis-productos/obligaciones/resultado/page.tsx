"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { ObligacionResultCard } from "@/src/organisms";
import { useUIContext } from "@/src/contexts/UIContext";
import { useWelcomeBar } from "@/src/contexts";
import { OBLIGACION_PAYMENT_STEPS } from "@/src/mocks/mockObligacionPaymentData";
import { ObligacionTransactionResult } from "@/src/types/obligacion-payment";

export default function ResultadoPage() {
  const { clearWelcomeBar, setWelcomeBar } = useWelcomeBar();
  const router = useRouter();
  const { hideBalances } = useUIContext();

  const [result] = useState<ObligacionTransactionResult | null>(() => {
    if (typeof window === "undefined") return null;

    // Try to read real API result first (stored by codigo-sms page)
    const apiResultStr = sessionStorage.getItem("obligacionPaymentResult");
    if (apiResultStr) {
      try {
        return JSON.parse(apiResultStr) as ObligacionTransactionResult;
      } catch {
        // fall through
      }
    }

    // Check for PSE error
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
        descripcion: JSON.parse(pseErrorStr).message || "Error al conectar con PSE",
      };
    }

    return null;
  });

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
    if (!result) {
      router.push("/pagos/pagar-mis-productos/obligaciones");
    }
  }, [result, router]);

  const handlePrintSave = () => {
    window.print();
  };

  const handleFinish = () => {
    sessionStorage.removeItem("obligacionPaymentProductId");
    sessionStorage.removeItem("obligacionPaymentValor");
    sessionStorage.removeItem("obligacionPaymentProduct");
    sessionStorage.removeItem("obligacionPaymentConfirmation");
    sessionStorage.removeItem("obligacionPaymentMethod");
    sessionStorage.removeItem("obligacionSourceAccountId");
    sessionStorage.removeItem("obligacionSourceAccountDisplay");
    sessionStorage.removeItem("obligacionSourceAccountApi");
    sessionStorage.removeItem("obligacionTargetProductApi");
    sessionStorage.removeItem("obligacionTransactionRequest");
    sessionStorage.removeItem("obligacionPaymentResult");
    sessionStorage.removeItem("pseTransactionError");

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

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={4} steps={OBLIGACION_PAYMENT_STEPS} />
      </div>

      <ObligacionResultCard result={result} hideBalances={hideBalances} />

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
