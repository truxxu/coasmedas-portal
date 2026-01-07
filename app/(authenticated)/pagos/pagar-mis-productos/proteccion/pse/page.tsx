"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PSELoadingCard } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import { mockProtectionPaymentResult } from "@/src/mocks";

export default function ProteccionPSEPage() {
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  // Configure WelcomeBar on mount, clear on unmount
  useEffect(() => {
    setWelcomeBar({
      title: "Pago de Proteccion",
      backHref: "/pagos/pagar-mis-productos/proteccion/confirmacion",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    // Check if previous steps were completed
    const confirmationData = sessionStorage.getItem(
      "protectionPaymentConfirmation"
    );
    if (!confirmationData) {
      router.push("/pagos/pagar-mis-productos/proteccion");
      return;
    }

    // Simulate PSE connection and external site redirect
    const timer = setTimeout(() => {
      // In production, this would handle PSE callback after returning from external site
      // For now, simulate successful payment
      const confirmation = JSON.parse(confirmationData);
      const result = {
        ...mockProtectionPaymentResult,
        creditLine: confirmation.productToPay,
        productNumber: confirmation.policyNumber,
        amountPaid: confirmation.amountToPay,
      };
      sessionStorage.setItem("protectionPaymentResult", JSON.stringify(result));

      router.push("/pagos/pagar-mis-productos/proteccion/respuesta");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="space-y-6">
      {/* PSE Loading Card */}
      <PSELoadingCard message="Conectando con PSE..." />
    </div>
  );
}
