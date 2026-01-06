"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper, HideBalancesToggle } from "@/src/molecules";
import { OtrosAsociadosConfirmationCard } from "@/src/organisms";
import { useUIContext } from "@/src/contexts/UIContext";
import { useWelcomeBar } from "@/src/contexts";
import {
  mockUserData,
  mockSourceAccounts,
  OTROS_ASOCIADOS_PAYMENT_STEPS,
} from "@/src/mocks";
import {
  RegisteredBeneficiary,
  PayableProduct,
  OtrosAsociadosConfirmationData,
} from "@/src/types";

export default function OtrosAsociadosConfirmacionPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const [confirmationData, setConfirmationData] =
    useState<OtrosAsociadosConfirmationData | null>(null);

  // Configure WelcomeBar on mount, clear on unmount
  useEffect(() => {
    setWelcomeBar({
      title: "Pago a otros asociados",
      backHref: "/pagos/otros-asociados/pago",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    // Get data from sessionStorage
    const beneficiaryStr = sessionStorage.getItem("otrosAsociadosBeneficiary");
    const accountId = sessionStorage.getItem("otrosAsociadosAccountId");
    const productsStr = sessionStorage.getItem("otrosAsociadosProducts");
    const totalAmount = sessionStorage.getItem("otrosAsociadosTotalAmount");

    if (!beneficiaryStr || !accountId || !productsStr || !totalAmount) {
      router.push("/pagos/otros-asociados/pago");
      return;
    }

    const beneficiary: RegisteredBeneficiary = JSON.parse(beneficiaryStr);
    const products: PayableProduct[] = JSON.parse(productsStr);
    const account = mockSourceAccounts.find((a) => a.id === accountId);

    if (!account) {
      router.push("/pagos/otros-asociados/pago");
      return;
    }

    setConfirmationData({
      titular: mockUserData.name,
      documento: mockUserData.document,
      productoADebitar: account.type,
      beneficiaryName: beneficiary.fullName,
      products: products.map((p) => ({
        name: p.name,
        amount: p.amountToPay,
      })),
      totalAmount: parseInt(totalAmount, 10),
    });
  }, [router]);

  const handleConfirm = () => {
    if (confirmationData) {
      sessionStorage.setItem(
        "otrosAsociadosConfirmation",
        JSON.stringify(confirmationData)
      );
    }

    // Navigate to SMS verification
    router.push("/pagos/otros-asociados/pago/sms");
  };

  const handleBack = () => {
    router.push("/pagos/otros-asociados/pago");
  };

  if (!confirmationData) {
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
        <Breadcrumbs items={["Inicio", "Pagos", "Pago a otros asociados"]} />
        <HideBalancesToggle />
      </div>

      <Stepper currentStep={2} steps={OTROS_ASOCIADOS_PAYMENT_STEPS} />

      <OtrosAsociadosConfirmationCard
        confirmationData={confirmationData}
        hideBalances={hideBalances}
      />

      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          className="text-sm font-medium text-[#004266] hover:underline"
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
