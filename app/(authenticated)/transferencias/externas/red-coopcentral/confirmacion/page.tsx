"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { RedCoopTransferConfirmationCard } from "@/src/organisms";
import { useUIContext, useWelcomeBar } from "@/src/contexts";
import type { RedCoopTransferConfirmationData } from "@/src/types/redCoopTransfer";
import {
  mockRedCoopSourceAccounts,
  mockRedCoopDestinationAccounts,
  mockRedCoopUserData,
  RED_COOP_TRANSFER_STEPS,
} from "@/src/mocks";

export default function RedCoopConfirmacionPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const [confirmationData] = useState<RedCoopTransferConfirmationData | null>(
    () => {
      if (typeof window === "undefined") return null;

      const sourceId = sessionStorage.getItem("redCoopTransferSourceId");
      const destinationId = sessionStorage.getItem(
        "redCoopTransferDestinationId",
      );
      const amount = sessionStorage.getItem("redCoopTransferAmount");
      const concept = sessionStorage.getItem("redCoopTransferConcept");

      if (!sourceId || !destinationId || !amount) {
        return null;
      }

      const sourceAccount = mockRedCoopSourceAccounts.find(
        (acc) => acc.id === sourceId,
      );
      const destination = mockRedCoopDestinationAccounts.find(
        (acc) => acc.id === destinationId,
      );

      if (!sourceAccount || !destination) {
        return null;
      }

      return {
        holderName: mockRedCoopUserData.holderName,
        holderDocument: mockRedCoopUserData.holderDocument,
        sourceProduct: sourceAccount.type,
        destinationHolder: destination.holderName,
        destinationBank: "Coopcentral",
        destinationAccountType:
          destination.accountType === "ahorros" ? "Ahorros" : "Corriente",
        destinationAccountNumber: destination.accountNumber,
        amount: Number(amount),
        concept: concept || "",
      };
    },
  );

  useEffect(() => {
    setWelcomeBar({
      title: "Cuentas de mi Red Coopcentral",
      backHref: "/transferencias/externas/red-coopcentral",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    if (!confirmationData) {
      router.push("/transferencias/externas/red-coopcentral");
    }
  }, [confirmationData, router]);

  const handleConfirmPayment = () => {
    if (confirmationData) {
      sessionStorage.setItem(
        "redCoopTransferConfirmation",
        JSON.stringify(confirmationData),
      );
    }

    router.push("/transferencias/externas/red-coopcentral/sms");
  };

  const handleBack = () => {
    router.push("/transferencias/externas/red-coopcentral");
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
        <Breadcrumbs items={["Inicio", "Transferencias", "Red Coopcentral"]} />
      </div>

      {/* Stepper */}
      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={2} steps={RED_COOP_TRANSFER_STEPS} />
      </div>

      {/* Confirmation Card */}
      <RedCoopTransferConfirmationCard
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
