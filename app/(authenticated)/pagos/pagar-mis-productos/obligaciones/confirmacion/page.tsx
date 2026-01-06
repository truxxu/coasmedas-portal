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
} from "@/src/mocks/mockObligacionPaymentData";
import {
  ObligacionConfirmationData,
  ObligacionPaymentProduct,
} from "@/src/types/obligacion-payment";

export default function ConfirmacionPage() {
  const { clearWelcomeBar, setWelcomeBar } = useWelcomeBar();
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const [confirmationData, setConfirmationData] =
    useState<ObligacionConfirmationData | null>(null);

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

    if (!productStr || !valor) {
      router.push("/pagos/pagar-mis-productos/obligaciones");
      return;
    }

    const product: ObligacionPaymentProduct = JSON.parse(productStr);

    setConfirmationData({
      titular: mockObligacionUserData.name,
      documento: mockObligacionUserData.document,
      productoAPagar: product.name,
      numeroProducto: product.productNumber,
      productoADebitar: "PSE (Pagos con otras entidades)",
      valorAPagar: parseInt(valor, 10),
    });
  }, [router]);

  const handleConfirm = () => {
    if (confirmationData) {
      sessionStorage.setItem(
        "obligacionPaymentConfirmation",
        JSON.stringify(confirmationData)
      );
    }

    // Navigate to PSE loading
    router.push("/pagos/pagar-mis-productos/obligaciones/pse");
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

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbItems} />

      <Stepper currentStep={2} steps={OBLIGACION_PAYMENT_STEPS} />

      <ObligacionConfirmationCard
        confirmationData={confirmationData}
        hideBalances={hideBalances}
      />

      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          className="text-sm font-medium text-[#1D4E8F] hover:underline"
        >
          Volver
        </button>
        <Button variant="primary" onClick={handleConfirm}>
          Confirmar Pago
        </Button>
      </div>
    </div>
  );
}
