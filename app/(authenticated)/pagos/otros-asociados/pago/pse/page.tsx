"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PSELoadingCard } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";

const PSE_REDIRECT_DELAY = 2000; // 2 seconds before "redirect"
const PSE_RETURN_DELAY = 3000; // 3 seconds to simulate bank interaction

export default function OtrosAsociadosPSEPage() {
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const [message, setMessage] = useState("Conectando con PSE...");

  // Configure WelcomeBar on mount, clear on unmount
  useEffect(() => {
    setWelcomeBar({
      title: "Pago a otros asociados",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  // Check if previous steps were completed
  useEffect(() => {
    const confirmationData = sessionStorage.getItem(
      "otrosAsociadosConfirmation"
    );
    if (!confirmationData) {
      router.push("/pagos/otros-asociados/pago");
    }
  }, [router]);

  // Simulate PSE redirect flow
  useEffect(() => {
    // Step 1: Show connecting message
    const redirectTimer = setTimeout(() => {
      setMessage("Redirigiendo al banco...");

      // Step 2: Simulate being at bank site
      setTimeout(() => {
        setMessage("Procesando pago en tu banco...");

        // Step 3: Simulate returning from bank
        setTimeout(() => {
          setMessage("Confirmando transacción...");

          // Step 4: Navigate to result
          setTimeout(() => {
            router.push("/pagos/otros-asociados/pago/resultado");
          }, 1000);
        }, PSE_RETURN_DELAY);
      }, PSE_REDIRECT_DELAY);
    }, PSE_REDIRECT_DELAY);

    return () => clearTimeout(redirectTimer);
  }, [router]);

  return (
    <div className="space-y-6">
      <PSELoadingCard message={message} />
    </div>
  );
}
