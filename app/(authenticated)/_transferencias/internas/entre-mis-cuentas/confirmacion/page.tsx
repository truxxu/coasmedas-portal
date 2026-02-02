"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { TransferConfirmationCard } from "@/src/organisms";
import { useUIContext, useWelcomeBar } from "@/src/contexts";
import type { TransferConfirmationData } from "@/src/types/transfer";
import {
  mockTransferAccounts,
  mockDestinationProducts,
  mockUserData,
  TRANSFER_STEPS,
} from "@/src/mocks";
import { maskNumber } from "@/src/utils";

export default function ConfirmacionPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const [confirmationData, setConfirmationData] =
    useState<TransferConfirmationData | null>(null);

  useEffect(() => {
    setWelcomeBar({
      title: "Entre mis Cuentas",
      backHref: "/transferencias/internas/entre-mis-cuentas",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    // Get data from previous step
    const sourceId = sessionStorage.getItem("transferSourceId");
    const destinationId = sessionStorage.getItem("transferDestinationId");
    const amount = sessionStorage.getItem("transferAmount");

    if (!sourceId || !destinationId || !amount) {
      router.push("/transferencias/internas/entre-mis-cuentas");
      return;
    }

    const sourceAccount = mockTransferAccounts.find(
      (acc) => acc.id === sourceId
    );
    const destination = mockDestinationProducts.find(
      (p) => p.id === destinationId
    );

    if (!sourceAccount || !destination) {
      router.push("/transferencias/internas/entre-mis-cuentas");
      return;
    }

    setConfirmationData({
      holderName: mockUserData.name,
      documentNumber: mockUserData.document,
      sourceAccount: `${sourceAccount.name} (${maskNumber(sourceAccount.productNumber)})`,
      destinationProduct: `${destination.name} (${maskNumber(destination.productNumber)})`,
      amount: Number(amount),
    });
  }, [router]);

  const handleConfirmPayment = () => {
    if (confirmationData) {
      sessionStorage.setItem(
        "transferConfirmation",
        JSON.stringify(confirmationData)
      );
    }

    router.push("/transferencias/internas/entre-mis-cuentas/sms");
  };

  const handleBack = () => {
    router.push("/transferencias/internas/entre-mis-cuentas");
  };

  if (!confirmationData) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="text-brand-gray-medium">Cargando...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Breadcrumbs
          items={["Inicio", "Transferencias", "Entre mis Cuentas"]}
        />
      </div>

      {/* Stepper */}
      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={2} steps={TRANSFER_STEPS} />
      </div>

      {/* Confirmation Card */}
      <TransferConfirmationCard
        confirmationData={confirmationData}
        hideBalances={hideBalances}
      />

      {/* Actions */}
      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          className="text-sm font-medium text-brand-teal-dark hover:underline"
        >
          Volver
        </button>
        <Button variant="primary" onClick={handleConfirmPayment}>
          Confirmar Pago
        </Button>
      </div>
    </div>
  );
}
