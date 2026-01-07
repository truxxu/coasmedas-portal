"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs, Stepper, HideBalancesToggle } from "@/src/molecules";
import { ProtectionPaymentResultCard } from "@/src/organisms";
import { useUIContext } from "@/src/contexts/UIContext";
import { useWelcomeBar } from "@/src/contexts";
import { PROTECTION_PAYMENT_STEPS } from "@/src/mocks";
import type { ProtectionPaymentResultData } from "@/src/types";

export default function ProteccionRespuestaPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const [result, setResult] = useState<ProtectionPaymentResultData | null>(
    null
  );

  // Configure WelcomeBar on mount, clear on unmount
  useEffect(() => {
    setWelcomeBar({
      title: "Pago de Proteccion",
      backHref: "/pagos/pagar-mis-productos",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  // Load result from sessionStorage
  useEffect(() => {
    const resultStr = sessionStorage.getItem("protectionPaymentResult");
    if (!resultStr) {
      router.push("/pagos/pagar-mis-productos/proteccion");
      return;
    }

    setResult(JSON.parse(resultStr));
  }, [router]);

  const handlePrint = () => {
    window.print();
  };

  const handleFinish = () => {
    // Clear all session data
    sessionStorage.removeItem("protectionPaymentDetails");
    sessionStorage.removeItem("protectionPaymentConfirmation");
    sessionStorage.removeItem("protectionPaymentResult");

    router.push("/pagos/pagar-mis-productos");
  };

  if (!result) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-[15px] text-[#58585B]">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Breadcrumbs items={["Inicio", "Pagos", "Pagos de Proteccion"]} />
        <HideBalancesToggle />
      </div>

      {/* Stepper - All steps completed */}
      <Stepper currentStep={4} steps={PROTECTION_PAYMENT_STEPS} />

      {/* Result Card */}
      <ProtectionPaymentResultCard
        result={result}
        onPrint={handlePrint}
        onFinish={handleFinish}
        hideBalances={hideBalances}
      />
    </div>
  );
}
