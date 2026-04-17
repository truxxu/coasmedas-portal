"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ResultPageShell, UtilityPaymentResultCard } from "@/src/organisms";
import { useUIContext } from "@/src/contexts";
import { UTILITY_PAYMENT_STEPS } from "@/src/mocks";
import type { UtilityPaymentResult } from "@/src/types";

const SESSION_KEYS = [
  "utilityPaymentDetails",
  "utilityPaymentConfirmation",
  "utilityPaymentResult",
];

export default function PagarServiciosRespuestaPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();

  const [result] = useState<UtilityPaymentResult | null>(() => {
    if (typeof window === "undefined") return null;
    const resultStr = sessionStorage.getItem("utilityPaymentResult");
    return resultStr ? (JSON.parse(resultStr) as UtilityPaymentResult) : null;
  });

  const handlePrint = () => window.print();
  const handleFinish = () => {
    for (const key of SESSION_KEYS) sessionStorage.removeItem(key);
    router.push("/pagos/servicios-publicos");
  };

  return (
    <ResultPageShell
      breadcrumbs={["Inicio", "Pagos", "Pago Servicio Publico"]}
      welcomeBarTitle="Pago de Servicios Públicos"
      welcomeBarBackHref="/home"
      startFlowPath="/pagos/servicios-publicos/pagar/detalle"
      sessionKeysToClean={SESSION_KEYS}
      steps={UTILITY_PAYMENT_STEPS}
      stepperCurrentStep={4}
      hasResult={!!result}
      hideActions
    >
      {result && (
        <UtilityPaymentResultCard
          result={result}
          hideBalances={hideBalances}
          onPrint={handlePrint}
          onFinish={handleFinish}
        />
      )}
    </ResultPageShell>
  );
}
