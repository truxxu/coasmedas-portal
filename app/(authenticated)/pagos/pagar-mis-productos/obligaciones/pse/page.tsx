"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { PSELoadingCard } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import { OBLIGACION_PAYMENT_STEPS } from "@/src/mocks/mockObligacionPaymentData";

export default function PSEPage() {
  const { clearWelcomeBar, setWelcomeBar } = useWelcomeBar();
  const router = useRouter();

  const breadcrumbItems = [
    "Inicio",
    "Pagos",
    "Pagar mis productos",
    "Pago de Obligaciones",
  ];

  useEffect(() => {
    setWelcomeBar({
      title: "Pago de Obligaciones",
      backHref: "/pagos/pagar-mis-productos/obligaciones",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    // Check if previous steps were completed
    const confirmationData = sessionStorage.getItem(
      "obligacionPaymentConfirmation"
    );
    if (!confirmationData) {
      router.push("/pagos/pagar-mis-productos/obligaciones");
      return;
    }

    // Simulate PSE connection delay
    const timer = setTimeout(() => {
      // In production, this would handle PSE callback
      router.push("/pagos/pagar-mis-productos/obligaciones/resultado");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbItems} />

      <Stepper currentStep={3} steps={OBLIGACION_PAYMENT_STEPS} />

      <PSELoadingCard message="Conectando con PSE..." />
    </div>
  );
}
