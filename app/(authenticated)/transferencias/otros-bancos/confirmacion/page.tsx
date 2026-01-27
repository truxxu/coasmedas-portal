"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { ExternalTransferConfirmationCard } from "@/src/organisms";
import { useUIContext, useWelcomeBar } from "@/src/contexts";
import type { ExternalTransferConfirmationData } from "@/src/types/externalTransfer";
import {
  mockExternalTransferSourceAccounts,
  mockExternalTransferDestinations,
  mockExternalTransferUserData,
  EXTERNAL_TRANSFER_STEPS,
} from "@/src/mocks";

export default function ConfirmacionPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const [confirmationData, setConfirmationData] =
    useState<ExternalTransferConfirmationData | null>(null);

  useEffect(() => {
    setWelcomeBar({
      title: "A Otros Bancos",
      backHref: "/transferencias/otros-bancos",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    // Get data from previous step
    const sourceId = sessionStorage.getItem("externalTransferSourceId");
    const destinationId = sessionStorage.getItem(
      "externalTransferDestinationId",
    );
    const amount = sessionStorage.getItem("externalTransferAmount");
    const concept = sessionStorage.getItem("externalTransferConcept");

    if (!sourceId || !destinationId || !amount) {
      router.push("/transferencias/otros-bancos");
      return;
    }

    const sourceAccount = mockExternalTransferSourceAccounts.find(
      (acc) => acc.id === sourceId,
    );
    const destination = mockExternalTransferDestinations.find(
      (acc) => acc.id === destinationId,
    );

    if (!sourceAccount || !destination) {
      router.push("/transferencias/otros-bancos");
      return;
    }

    // Build confirmation data
    setConfirmationData({
      holderName: mockExternalTransferUserData.holderName,
      holderDocument: mockExternalTransferUserData.holderDocument,
      sourceProduct: sourceAccount.type,
      destinationHolder: destination.holderName,
      destinationBank: destination.bankName,
      destinationAccountType:
        destination.accountType === "ahorros" ? "Ahorros" : "Corriente",
      destinationAccountNumber: destination.accountNumber,
      amount: Number(amount),
      concept: concept || "",
    });
  }, [router]);

  const handleConfirmPayment = () => {
    if (confirmationData) {
      sessionStorage.setItem(
        "externalTransferConfirmation",
        JSON.stringify(confirmationData),
      );
    }

    router.push("/transferencias/otros-bancos/sms");
  };

  const handleBack = () => {
    router.push("/transferencias/otros-bancos");
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
        <Breadcrumbs items={["Inicio", "Transferencias", "A Otros Bancos"]} />
      </div>

      {/* Stepper */}
      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={2} steps={EXTERNAL_TRANSFER_STEPS} />
      </div>

      {/* Confirmation Card */}
      <ExternalTransferConfirmationCard
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
