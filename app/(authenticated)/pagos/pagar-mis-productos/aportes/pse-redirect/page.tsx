"use client";

import React, { useEffect } from "react";
import { PSELoadingCard } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import { usePSERedirect } from "@/src/hooks";

export default function PSERedirectPage() {
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const { message } = usePSERedirect({
    sessionKey: "aportesPaymentConfirmation",
    fallbackPath: "/pagos/pagar-mis-productos/aportes",
    successPath: "/pagos/pagar-mis-productos/aportes/resultado",
    phases: [
      { message: "Conectando con PSE...", duration: 2000 },
      { message: "Procesando pago en tu banco...", duration: 3000 },
      { message: "Finalizando transaccion...", duration: 1000 },
    ],
  });

  // Set welcome bar on mount
  useEffect(() => {
    setWelcomeBar({
      title: "Pago de Aportes",
      backHref: "/pagos/pagar-mis-productos/aportes/confirmacion",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  return (
    <div className="space-y-6">
      <PSELoadingCard message={message} />
    </div>
  );
}
