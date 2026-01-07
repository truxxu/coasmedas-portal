"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { UtilityPaymentConfirmationCard } from "@/src/organisms";
import { useUIContext } from "@/src/contexts/UIContext";
import { useWelcomeBar } from "@/src/contexts";
import { mockRegisteredServices, UTILITY_PAYMENT_STEPS } from "@/src/mocks";
import type { UtilityPaymentDetails, UtilityPaymentConfirmation } from "@/src/types";

export default function PagarServiciosConfirmacionPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const [confirmation, setConfirmation] = useState<UtilityPaymentConfirmation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Configure WelcomeBar on mount, clear on unmount
  useEffect(() => {
    setWelcomeBar({
      title: "Pago de Servicios Publicos",
      backHref: "/pagos/servicios-publicos/pagar/detalle",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    // Check if we have details data
    const detailsStr = sessionStorage.getItem("utilityPaymentDetails");
    if (!detailsStr) {
      router.push("/pagos/servicios-publicos/pagar/detalle");
      return;
    }

    const details: UtilityPaymentDetails = JSON.parse(detailsStr);
    const service = mockRegisteredServices.find((s) => s.id === details.serviceId);

    // Build confirmation data from details + mock user context
    const confirmationData: UtilityPaymentConfirmation = {
      holderName: "CAMILO ANDRES CRUZ", // Would come from user context
      holderDocument: "CC 1.***.***234", // Would come from user context (masked)
      serviceToPay: service ? `${service.provider} - ${service.serviceType}` : "",
      invoiceReference: service?.reference || "",
      productToDebit: details.sourceAccountDisplay.split(" - ")[0] || "Cuenta de Ahorros",
      totalAmount: details.amount,
    };

    setConfirmation(confirmationData);
  }, [router]);

  const handleConfirm = async () => {
    if (!confirmation) return;

    setIsLoading(true);

    try {
      // Store confirmation data in sessionStorage
      sessionStorage.setItem(
        "utilityPaymentConfirmation",
        JSON.stringify(confirmation)
      );

      // Check payment method from details
      const detailsStr = sessionStorage.getItem("utilityPaymentDetails");
      const details: UtilityPaymentDetails | null = detailsStr ? JSON.parse(detailsStr) : null;
      const isPSE = details?.paymentMethod === "pse";

      if (isPSE) {
        // Navigate to PSE loading page
        router.push("/pagos/servicios-publicos/pagar/pse");
      } else {
        // Simulate SMS send delay for account-based payment
        await new Promise((resolve) => setTimeout(resolve, 1000));
        router.push("/pagos/servicios-publicos/pagar/codigo-sms");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/pagos/servicios-publicos/pagar/detalle");
  };

  if (!confirmation) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-[#58585B]">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Breadcrumbs items={["Inicio", "Pagos", "Pago Servicio Publico"]} />
      </div>

      {/* Stepper */}
      <Stepper currentStep={2} steps={UTILITY_PAYMENT_STEPS} />

      {/* Confirmation Card */}
      <UtilityPaymentConfirmationCard
        confirmation={confirmation}
        hideBalances={hideBalances}
        onConfirm={handleConfirm}
        onBack={handleBack}
        isLoading={isLoading}
      />
    </div>
  );
}
