"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PSELoadingCard } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";

// Simulated PSE redirect delay (in ms)
const PSE_REDIRECT_DELAY = 2000;
// Simulated external bank processing time (in ms)
const PSE_PROCESSING_TIME = 3000;

export default function PSERedirectPage() {
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const router = useRouter();
  const [status, setStatus] = useState<
    "connecting" | "processing" | "returning"
  >("connecting");

  // Set welcome bar on mount
  useEffect(() => {
    setWelcomeBar({
      title: "Pago de Aportes",
      backHref: "/pagos/pagar-mis-productos/aportes/confirmacion",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  // Verify session data exists
  useEffect(() => {
    const confirmationData = sessionStorage.getItem(
      "aportesPaymentConfirmation"
    );
    if (!confirmationData) {
      router.push("/pagos/pagar-mis-productos/aportes");
    }
  }, [router]);

  // Simulate PSE redirect flow
  useEffect(() => {
    // Phase 1: Connecting to PSE
    const redirectTimer = setTimeout(() => {
      setStatus("processing");

      // Phase 2: Simulating external bank processing
      const processingTimer = setTimeout(() => {
        setStatus("returning");

        // Phase 3: Return to result page
        const returnTimer = setTimeout(() => {
          router.push("/pagos/pagar-mis-productos/aportes/resultado");
        }, 1000);

        return () => clearTimeout(returnTimer);
      }, PSE_PROCESSING_TIME);

      return () => clearTimeout(processingTimer);
    }, PSE_REDIRECT_DELAY);

    return () => clearTimeout(redirectTimer);
  }, [router]);

  const getMessage = () => {
    switch (status) {
      case "connecting":
        return "Conectando con PSE...";
      case "processing":
        return "Procesando pago en tu banco...";
      case "returning":
        return "Finalizando transacción...";
      default:
        return "Conectando con PSE...";
    }
  };

  return (
    <div className="space-y-6">
      <PSELoadingCard message={getMessage()} />
    </div>
  );
}
