"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { PSERechargeConfirmationCard } from "@/src/organisms";
import { useUIContext, useWelcomeBar } from "@/src/contexts";
import type { PSERechargeConfirmationData } from "@/src/types/pseRecharge";
import { mockPSERechargeAccounts, mockPSERechargeUserData, TRANSFER_STEPS } from "@/src/mocks";

export default function ConfirmacionPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const [confirmationData, setConfirmationData] =
    useState<PSERechargeConfirmationData | null>(null);

  useEffect(() => {
    setWelcomeBar({
      title: "Recargar con PSE",
      backHref: "/transferencias/internas/recargar-pse",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    // Get data from previous step
    const destinationId = sessionStorage.getItem("pseRechargeDestinationId");
    const amount = sessionStorage.getItem("pseRechargeAmount");

    if (!destinationId || !amount) {
      router.push("/transferencias/internas/recargar-pse");
      return;
    }

    const destination = mockPSERechargeAccounts.find(
      (acc) => acc.id === destinationId
    );

    if (!destination) {
      router.push("/transferencias/internas/recargar-pse");
      return;
    }

    setConfirmationData({
      holderName: mockPSERechargeUserData.holderName,
      documentNumber: mockPSERechargeUserData.documentNumber,
      productToRecharge: `${destination.name} (${destination.maskedNumber})`,
      amount: Number(amount),
      method: "PSE",
    });
  }, [router]);

  const handleConfirmPayment = () => {
    if (confirmationData) {
      sessionStorage.setItem(
        "pseRechargeConfirmation",
        JSON.stringify(confirmationData)
      );
    }

    router.push("/transferencias/internas/recargar-pse/pse");
  };

  const handleBack = () => {
    router.push("/transferencias/internas/recargar-pse");
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
          items={["Inicio", "Transferencias", "Recargar con PSE"]}
        />
      </div>

      {/* Stepper */}
      <div className="bg-white rounded-2xl shadow-sm">
        <Stepper currentStep={2} steps={TRANSFER_STEPS} />
      </div>

      {/* Confirmation Card */}
      <PSERechargeConfirmationCard
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
