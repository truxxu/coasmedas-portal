"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { ObligacionConfirmationCard } from "@/src/organisms";
import { useUIContext } from "@/src/contexts/UIContext";
import { useWelcomeBar } from "@/src/contexts";
import {
  mockObligacionUserData,
  OBLIGACION_PAYMENT_STEPS,
  OBLIGACION_PAYMENT_STEPS_ACCOUNT,
} from "@/src/mocks/mockObligacionPaymentData";
import {
  ObligacionConfirmationData,
  ObligacionPaymentProduct,
  ObligacionPaymentMethod,
} from "@/src/types/obligacion-payment";

export default function ConfirmacionPage() {
  const { clearWelcomeBar, setWelcomeBar } = useWelcomeBar();
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const [confirmationData, setConfirmationData] =
    useState<ObligacionConfirmationData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<ObligacionPaymentMethod>("pse");
  const [isLoading, setIsLoading] = useState(false);

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
    // Get data from previous step
    const productStr = sessionStorage.getItem("obligacionPaymentProduct");
    const valor = sessionStorage.getItem("obligacionPaymentValor");
    const method = sessionStorage.getItem("obligacionPaymentMethod") as ObligacionPaymentMethod;
    const sourceAccountDisplay = sessionStorage.getItem("obligacionSourceAccountDisplay");

    if (!productStr || !valor) {
      router.push("/pagos/pagar-mis-productos/obligaciones");
      return;
    }

    const product: ObligacionPaymentProduct = JSON.parse(productStr);

    // Store payment method for routing decision
    if (method) {
      setPaymentMethod(method);
    }

    // Determine product to debit display
    const productoADebitar = method === 'pse'
      ? "PSE (Pagos con otras entidades)"
      : (sourceAccountDisplay?.split(' - ')[0] || 'Cuenta de Ahorros');

    setConfirmationData({
      titular: mockObligacionUserData.name,
      documento: mockObligacionUserData.document,
      productoAPagar: product.name,
      numeroProducto: product.productNumber,
      productoADebitar,
      valorAPagar: parseInt(valor, 10),
    });
  }, [router]);

  const handleConfirm = async () => {
    if (!confirmationData) return;

    setIsLoading(true);

    try {
      // Store confirmation data for result page
      sessionStorage.setItem(
        "obligacionPaymentConfirmation",
        JSON.stringify(confirmationData)
      );

      if (paymentMethod === 'pse') {
        // PSE flow: redirect to PSE loading page (then external site)
        router.push("/pagos/pagar-mis-productos/obligaciones/pse");
      } else {
        // Account flow: simulate SMS send delay, then go to code input
        await new Promise((resolve) => setTimeout(resolve, 1000));
        router.push("/pagos/pagar-mis-productos/obligaciones/codigo-sms");
      }
    } catch (error) {
      console.error('Error:', error);
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/pagos/pagar-mis-productos/obligaciones");
  };

  if (!confirmationData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-[15px] text-gray-600">Cargando...</div>
      </div>
    );
  }

  // Determine which steps to show based on payment method
  const currentSteps = paymentMethod === 'pse'
    ? OBLIGACION_PAYMENT_STEPS
    : OBLIGACION_PAYMENT_STEPS_ACCOUNT;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbItems} />

      <Stepper currentStep={2} steps={currentSteps} />

      <ObligacionConfirmationCard
        confirmationData={confirmationData}
        hideBalances={hideBalances}
      />

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
