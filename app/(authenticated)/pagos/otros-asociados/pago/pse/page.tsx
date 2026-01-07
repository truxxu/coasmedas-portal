"use client";

import React, { useEffect } from "react";
import { PSELoadingCard } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import { usePSERedirect } from "@/src/hooks";

export default function OtrosAsociadosPSEPage() {
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const { message } = usePSERedirect({
    sessionKey: "otrosAsociadosConfirmation",
    fallbackPath: "/pagos/otros-asociados/pago",
    successPath: "/pagos/otros-asociados/pago/resultado",
    phases: [
      { message: "Conectando con PSE...", duration: 2000 },
      { message: "Redirigiendo al banco...", duration: 2000 },
      { message: "Procesando pago en tu banco...", duration: 3000 },
      { message: "Confirmando transaccion...", duration: 1000 },
    ],
  });

  // Configure WelcomeBar on mount, clear on unmount
  useEffect(() => {
    setWelcomeBar({
      title: "Pago a otros asociados",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  return (
    <div className="space-y-6">
      <PSELoadingCard message={message} />
    </div>
  );
}
