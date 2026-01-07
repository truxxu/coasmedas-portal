"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/src/atoms";
import { useWelcomeBar } from "@/src/contexts";
import { mockUtilityPaymentResult } from "@/src/mocks";

const PSE_REDIRECT_DELAY = 3000; // 3 seconds before "redirecting"
const PSE_RETURN_DELAY = 5000; // 5 seconds simulating external site

export default function UtilityPaymentPSEPage() {
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const router = useRouter();
  const [isCheckingData, setIsCheckingData] = useState(true);

  // Configure WelcomeBar on mount
  useEffect(() => {
    setWelcomeBar({
      title: "Pago de Servicios Publicos",
      backHref: "/pagos/servicios-publicos",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  // Check for required data from previous steps
  useEffect(() => {
    const confirmationData = sessionStorage.getItem("utilityPaymentConfirmation");
    const detailsData = sessionStorage.getItem("utilityPaymentDetails");

    if (!confirmationData || !detailsData) {
      // No data, redirect to start
      router.push("/pagos/servicios-publicos/pagar/detalle");
      return;
    }

    // Verify PSE was selected
    const details = JSON.parse(detailsData);
    if (details.paymentMethod !== "pse") {
      router.push("/pagos/servicios-publicos/pagar/detalle");
      return;
    }

    setIsCheckingData(false);
  }, [router]);

  // Simulate PSE flow: loading -> redirect -> return with result
  useEffect(() => {
    if (isCheckingData) return;

    // First, show loading for a few seconds
    const redirectTimer = setTimeout(() => {
      // In a real app, this would redirect to the PSE external site
      // window.location.href = 'https://pse.example.com/pay?...'

      // For demo, we'll simulate returning from PSE after a delay
      const returnTimer = setTimeout(() => {
        // Get confirmation to populate result with actual amount
        const confirmationStr = sessionStorage.getItem("utilityPaymentConfirmation");
        if (confirmationStr) {
          const confirmation = JSON.parse(confirmationStr);
          const result = {
            ...mockUtilityPaymentResult,
            amountPaid: confirmation.totalAmount,
          };
          sessionStorage.setItem("utilityPaymentResult", JSON.stringify(result));
        } else {
          sessionStorage.setItem(
            "utilityPaymentResult",
            JSON.stringify(mockUtilityPaymentResult)
          );
        }

        router.push("/pagos/servicios-publicos/pagar/respuesta");
      }, PSE_RETURN_DELAY);

      return () => clearTimeout(returnTimer);
    }, PSE_REDIRECT_DELAY);

    return () => clearTimeout(redirectTimer);
  }, [isCheckingData, router]);

  if (isCheckingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-brand-gray-high">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="p-8 md:p-12 text-center max-w-md w-full">
        {/* Spinner */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 md:w-20 md:h-20 border-4 border-brand-border border-t-brand-primary rounded-full animate-spin" />
        </div>

        {/* Title */}
        <h2 className="text-xl md:text-2xl font-bold text-brand-navy mb-2">
          Conectando a PSE
        </h2>

        {/* Description */}
        <p className="text-sm md:text-base text-brand-gray-high">
          Estamos preparando tu solicitud con la plataforma de pagos segura.
        </p>
      </Card>
    </div>
  );
}
