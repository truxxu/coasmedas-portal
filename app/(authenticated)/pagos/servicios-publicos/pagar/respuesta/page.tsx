"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { UtilityPaymentResultCard } from "@/src/organisms";
import { useUIContext } from "@/src/contexts/UIContext";
import { useWelcomeBar } from "@/src/contexts";
import { UTILITY_PAYMENT_STEPS } from "@/src/mocks";
import type { UtilityPaymentResult } from "@/src/types";

export default function PagarServiciosRespuestaPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const [result, setResult] = useState<UtilityPaymentResult | null>(null);

  // Configure WelcomeBar on mount, clear on unmount
  useEffect(() => {
    setWelcomeBar({
      title: "Pago de Servicios Publicos",
      backHref: "/home",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  // Load result from sessionStorage
  useEffect(() => {
    const resultStr = sessionStorage.getItem("utilityPaymentResult");
    if (!resultStr) {
      router.push("/pagos/servicios-publicos/pagar/detalle");
      return;
    }

    setResult(JSON.parse(resultStr));
  }, [router]);

  const handlePrint = () => {
    window.print();
  };

  const handleFinish = () => {
    // Clear all session data
    sessionStorage.removeItem("utilityPaymentDetails");
    sessionStorage.removeItem("utilityPaymentConfirmation");
    sessionStorage.removeItem("utilityPaymentResult");

    router.push("/pagos/servicios-publicos");
  };

  if (!result) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-[#58585B]">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Breadcrumbs items={["Inicio", "Pagos", "Pago Servicio Publico"]} />
      </div>

      {/* Stepper */}
      <Stepper currentStep={4} steps={UTILITY_PAYMENT_STEPS} />

      {/* Result Card */}
      <UtilityPaymentResultCard
        result={result}
        hideBalances={hideBalances}
        onPrint={handlePrint}
        onFinish={handleFinish}
      />
    </div>
  );
}
