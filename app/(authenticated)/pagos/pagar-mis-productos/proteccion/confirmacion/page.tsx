"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { ProtectionPaymentConfirmationCard } from "@/src/organisms";
import { useUIContext } from "@/src/contexts/UIContext";
import { useWelcomeBar } from "@/src/contexts";
import { PROTECTION_PAYMENT_STEPS } from "@/src/mocks";
import type {
  ProtectionPaymentDetailsFormData,
  ProtectionPaymentConfirmationData,
  ProtectionPaymentMethod,
} from "@/src/types";

export default function ProteccionConfirmacionPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const [paymentMethod] =
    useState<ProtectionPaymentMethod>(() => {
      if (typeof window === 'undefined') return "account";
      const detailsStr = sessionStorage.getItem("protectionPaymentDetails");
      if (!detailsStr) return "account";
      const details: ProtectionPaymentDetailsFormData = JSON.parse(detailsStr);
      return details.paymentMethod;
    });

  const [confirmation] =
    useState<ProtectionPaymentConfirmationData | null>(() => {
      if (typeof window === 'undefined') return null;

      const detailsStr = sessionStorage.getItem("protectionPaymentDetails");
      if (!detailsStr) return null;

      const details: ProtectionPaymentDetailsFormData = JSON.parse(detailsStr);

      const isPSE = details.paymentMethod === "pse";
      const productToDebit = isPSE
        ? "PSE (Pagos con otras entidades)"
        : details.sourceAccountDisplay.split(" - ")[0] || "Cuenta de Ahorros";

      return {
        holderName: "CAMILO ANDRES CRUZ",
        holderDocument: "CC 1.***.***234",
        productToPay: details.selectedProduct?.title || "",
        policyNumber: details.selectedProduct?.productNumber || "",
        productToDebit,
        amountToPay: details.selectedProduct?.nextPaymentAmount || 0,
      };
    });

  const [isLoading, setIsLoading] = useState(false);

  // Configure WelcomeBar on mount, clear on unmount
  useEffect(() => {
    setWelcomeBar({
      title: "Pago de Proteccion",
      backHref: "/pagos/pagar-mis-productos/proteccion",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  // Redirect if data is missing
  useEffect(() => {
    if (!confirmation) {
      router.push("/pagos/pagar-mis-productos/proteccion");
    }
  }, [confirmation, router]);

  const handleConfirm = async () => {
    if (!confirmation) return;

    setIsLoading(true);

    try {
      // Store confirmation data for result page
      sessionStorage.setItem(
        "protectionPaymentConfirmation",
        JSON.stringify(confirmation)
      );

      if (paymentMethod === "pse") {
        // PSE flow: redirect to PSE loading page (then external site)
        router.push("/pagos/pagar-mis-productos/proteccion/pse");
      } else {
        // Account flow: simulate SMS send delay, then go to code input
        await new Promise((resolve) => setTimeout(resolve, 1000));
        router.push("/pagos/pagar-mis-productos/proteccion/codigo-sms");
      }
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/pagos/pagar-mis-productos/proteccion");
  };

  if (!confirmation) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-[15px] text-brand-gray-high">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Breadcrumbs items={["Inicio", "Pagos", "Pagos de Proteccion"]} />
      </div>

      {/* Stepper */}
      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={2} steps={PROTECTION_PAYMENT_STEPS} />
      </div>

      {/* Confirmation Card */}
      <ProtectionPaymentConfirmationCard
        confirmation={confirmation}
        hideBalances={hideBalances}
      />

      {/* Footer Actions */}
      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          disabled={isLoading}
          className="text-sm font-medium text-brand-navy hover:underline disabled:opacity-50"
        >
          Volver
        </button>
        <Button variant="primary" onClick={handleConfirm} disabled={isLoading}>
          {isLoading ? "Procesando..." : "Confirmar Pago"}
        </Button>
      </div>
    </div>
  );
}
