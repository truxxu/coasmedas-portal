"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ConfirmationPageShell,
  PSERechargeConfirmationCard,
} from "@/src/organisms";
import { useUIContext } from "@/src/contexts";
import type { PSERechargeConfirmationData } from "@/src/types/pseRecharge";
import {
  mockPSERechargeAccounts,
  mockPSERechargeUserData,
  TRANSFER_STEPS,
} from "@/src/mocks";

export default function ConfirmacionPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const [confirmationData] = useState<PSERechargeConfirmationData | null>(
    () => {
      if (typeof window === "undefined") return null;

      const destinationId = sessionStorage.getItem("pseRechargeDestinationId");
      const amount = sessionStorage.getItem("pseRechargeAmount");

      if (!destinationId || !amount) return null;

      const destination = mockPSERechargeAccounts.find(
        (acc) => acc.id === destinationId,
      );
      if (!destination) return null;

      return {
        holderName: mockPSERechargeUserData.holderName,
        documentNumber: mockPSERechargeUserData.documentNumber,
        productToRecharge: `${destination.name} (${destination.maskedNumber})`,
        amount: Number(amount),
        method: "PSE" as const,
        transactionCost: 0,
      };
    },
  );

  const handleConfirmPayment = () => {
    if (confirmationData) {
      sessionStorage.setItem(
        "pseRechargeConfirmation",
        JSON.stringify(confirmationData),
      );
    }
    router.push("/transferencias/internas/recargar-pse/pse");
  };

  return (
    <ConfirmationPageShell
      breadcrumbs={["Inicio", "Transferencias", "Recargar con PSE"]}
      welcomeBarTitle="Recargar con PSE"
      welcomeBarBackHref="/transferencias/internas/recargar-pse"
      fallbackPath="/transferencias/internas/recargar-pse"
      steps={TRANSFER_STEPS}
      hasData={!!confirmationData}
      onBack={() => router.push("/transferencias/internas/recargar-pse")}
      onConfirm={handleConfirmPayment}
    >
      {confirmationData && (
        <PSERechargeConfirmationCard
          confirmationData={confirmationData}
          hideBalances={hideBalances}
        />
      )}
    </ConfirmationPageShell>
  );
}
