"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { ProtectionPaymentResultCard } from "@/src/organisms";
import { useUIContext } from "@/src/contexts/UIContext";
import { useWelcomeBar } from "@/src/contexts";
import { PROTECTION_PAYMENT_STEPS } from "@/src/mocks";
import type { ProtectionPaymentResultData } from "@/src/types";

export default function ProteccionRespuestaPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const [result] = useState<ProtectionPaymentResultData | null>(() => {
    if (typeof window === "undefined") return null;

    // Try to read real API result first
    const resultStr = sessionStorage.getItem("protectionPaymentResult");
    if (resultStr) {
      try {
        return JSON.parse(resultStr) as ProtectionPaymentResultData;
      } catch {
        // fall through
      }
    }

    // Check for PSE error
    const pseErrorStr = sessionStorage.getItem("pseTransactionError");
    if (pseErrorStr) {
      const confirmationStr = sessionStorage.getItem(
        "protectionPaymentConfirmation",
      );
      const confirmation = confirmationStr ? JSON.parse(confirmationStr) : null;
      return {
        success: false,
        creditLine: confirmation?.productToPay ?? "Protección",
        productNumber: confirmation?.policyNumber ?? "",
        amountPaid: 0,
        transactionCost: 0,
        transmissionDate: "",
        transactionTime: "",
        approvalNumber: "",
        description:
          JSON.parse(pseErrorStr).message || "Error al conectar con PSE",
      };
    }

    return null;
  });

  useEffect(() => {
    setWelcomeBar({
      title: "Pago de Protección y Actividades",
      backHref: "/pagos/pagar-mis-productos",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    if (!result) {
      router.push("/pagos/pagar-mis-productos/proteccion");
    }
  }, [result, router]);

  const handlePrint = () => {
    window.print();
  };

  const handleFinish = () => {
    sessionStorage.removeItem("protectionPaymentDetails");
    sessionStorage.removeItem("protectionPaymentConfirmation");
    sessionStorage.removeItem("protectionPaymentResult");
    sessionStorage.removeItem("protectionSourceAccountApi");
    sessionStorage.removeItem("protectionTargetProductApi");
    sessionStorage.removeItem("protectionTransactionRequest");
    sessionStorage.removeItem("pseTransactionError");

    router.push("/pagos/pagar-mis-productos");
  };

  if (!result) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-[15px] text-brand-gray-high">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumbs items={["Inicio", "Pagos", "Pagos de Protección"]} />
      </div>

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={4} steps={PROTECTION_PAYMENT_STEPS} />
      </div>

      <ProtectionPaymentResultCard
        result={result}
        onPrint={handlePrint}
        onFinish={handleFinish}
        hideBalances={hideBalances}
      />
    </div>
  );
}
