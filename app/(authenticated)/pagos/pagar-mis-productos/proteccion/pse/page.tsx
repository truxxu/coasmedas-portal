"use client";

import React, { useEffect } from "react";
import { PSELoadingCard } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import { usePSERedirect } from "@/src/hooks";
import { mockProtectionPaymentResult } from "@/src/mocks";

export default function ProteccionPSEPage() {
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const handleBeforeRedirect = () => {
    const confirmationData = sessionStorage.getItem("protectionPaymentConfirmation");
    if (confirmationData) {
      const confirmation = JSON.parse(confirmationData);
      const result = {
        ...mockProtectionPaymentResult,
        creditLine: confirmation.productToPay,
        productNumber: confirmation.policyNumber,
        amountPaid: confirmation.amountToPay,
      };
      sessionStorage.setItem("protectionPaymentResult", JSON.stringify(result));
    }
  };

  const { message } = usePSERedirect({
    sessionKey: "protectionPaymentConfirmation",
    fallbackPath: "/pagos/pagar-mis-productos/proteccion",
    successPath: "/pagos/pagar-mis-productos/proteccion/respuesta",
    onBeforeRedirect: handleBeforeRedirect,
  });

  // Configure WelcomeBar on mount, clear on unmount
  useEffect(() => {
    setWelcomeBar({
      title: "Pago de Proteccion",
      backHref: "/pagos/pagar-mis-productos/proteccion/confirmacion",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  return (
    <div className="space-y-6">
      <PSELoadingCard message={message} />
    </div>
  );
}
