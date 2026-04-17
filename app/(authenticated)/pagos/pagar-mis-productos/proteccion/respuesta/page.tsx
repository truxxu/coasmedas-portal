"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProtectionPaymentResultCard, ResultPageShell } from "@/src/organisms";
import { useUIContext } from "@/src/contexts";
import { PROTECTION_PAYMENT_STEPS } from "@/src/mocks";
import type { ProtectionPaymentResultData } from "@/src/types";

const SESSION_KEYS = [
  "protectionPaymentDetails",
  "protectionPaymentConfirmation",
  "protectionPaymentResult",
  "protectionSourceAccountApi",
  "protectionTargetProductApi",
  "protectionTransactionRequest",
  "pseTransactionError",
];

export default function ProteccionRespuestaPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();

  const [result] = useState<ProtectionPaymentResultData | null>(() => {
    if (typeof window === "undefined") return null;

    const resultStr = sessionStorage.getItem("protectionPaymentResult");
    if (resultStr) {
      try {
        return JSON.parse(resultStr) as ProtectionPaymentResultData;
      } catch {
        // fall through
      }
    }

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

  const handlePrint = () => window.print();
  const handleFinish = () => {
    for (const key of SESSION_KEYS) sessionStorage.removeItem(key);
    router.push("/pagos/pagar-mis-productos");
  };

  return (
    <ResultPageShell
      breadcrumbs={["Inicio", "Pagos", "Pagos de Protección"]}
      welcomeBarTitle="Pago de Protección y Actividades"
      welcomeBarBackHref="/pagos/pagar-mis-productos"
      startFlowPath="/pagos/pagar-mis-productos/proteccion"
      sessionKeysToClean={SESSION_KEYS}
      steps={PROTECTION_PAYMENT_STEPS}
      stepperCurrentStep={4}
      hasResult={!!result}
      hideActions
    >
      {result && (
        <ProtectionPaymentResultCard
          result={result}
          onPrint={handlePrint}
          onFinish={handleFinish}
          hideBalances={hideBalances}
        />
      )}
    </ResultPageShell>
  );
}
