"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { NetworkTransferConfirmationCard } from "@/src/organisms";
import { useUIContext, useWelcomeBar } from "@/src/contexts";
import {
  NetworkTransferConfirmationData,
  RegisteredNetworkAccount,
  NetworkProduct,
} from "@/src/types/networkTransfer";
import {
  NETWORK_TRANSFER_STEPS,
  mockNetworkSourceAccounts,
  mockNetworkTransferUserData,
} from "@/src/mocks/mockNetworkTransferData";

export default function ConfirmacionPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const [confirmationData] = useState<NetworkTransferConfirmationData | null>(
    () => {
      if (typeof window === "undefined") return null;

      const recipientData = sessionStorage.getItem("networkTransferRecipient");
      const destinationData = sessionStorage.getItem(
        "networkTransferDestination",
      );
      const sourceId = sessionStorage.getItem("networkTransferSourceId");
      const amount = sessionStorage.getItem("networkTransferAmount");
      const concept = sessionStorage.getItem("networkTransferConcept") || "";

      if (!recipientData || !destinationData || !sourceId || !amount) {
        return null;
      }

      const recipient: RegisteredNetworkAccount = JSON.parse(recipientData);
      const destination: NetworkProduct = JSON.parse(destinationData);
      const sourceAccount = mockNetworkSourceAccounts.find(
        (acc) => acc.id === sourceId,
      );

      return {
        holderName: mockNetworkTransferUserData.holderName,
        holderDocument: mockNetworkTransferUserData.holderDocument,
        sourceProduct: sourceAccount?.name || "Cuenta de Ahorros",
        destinationHolder: recipient.name,
        destinationBank: "Coopcentral",
        destinationAccountType:
          destination.type === "ahorros" ? "Ahorros" : "Corriente",
        destinationAccountNumber: `123-456789-${destination.maskedNumber.slice(-2)}`,
        amount: Number(amount),
        concept: concept || undefined,
      };
    },
  );

  useEffect(() => {
    setWelcomeBar({
      title: "Red Coopcentral",
      backHref: "/transferencias/internas/cuentas-mi-red/detalle",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    if (!confirmationData) {
      router.push("/transferencias/internas/cuentas-mi-red");
    }
  }, [confirmationData, router]);

  const handleConfirm = () => {
    router.push("/transferencias/internas/cuentas-mi-red/verificacion");
  };

  const handleBack = () => {
    router.push("/transferencias/internas/cuentas-mi-red/detalle");
  };

  if (!confirmationData) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="text-gray-500">Cargando...</span>
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
        <Stepper currentStep={2} steps={NETWORK_TRANSFER_STEPS} />
      </div>

      {/* Confirmation Card */}
      <NetworkTransferConfirmationCard
        confirmationData={confirmationData}
        hideBalances={hideBalances}
        onConfirm={handleConfirm}
        onBack={handleBack}
      />
    </div>
  );
}
