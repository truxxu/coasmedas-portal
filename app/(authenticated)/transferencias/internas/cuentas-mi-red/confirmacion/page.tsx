"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ConfirmationPageShell,
  NetworkTransferConfirmationCard,
} from "@/src/organisms";
import { useUIContext } from "@/src/contexts";
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
import { maskNumber } from "@/src/utils";

export default function ConfirmacionPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();

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
        sourceAccountMaskedNumber: sourceAccount
          ? maskNumber(sourceAccount.productNumber)
          : undefined,
        destinationHolder: recipient.name,
        destinationBank: "Coopcentral",
        destinationAccountType:
          destination.type === "ahorros" ? "Ahorros" : "Corriente",
        destinationAccountNumber: destination.maskedNumber,
        amount: Number(amount),
        transactionCost: 0,
        concept: concept || undefined,
      };
    },
  );

  const handleConfirm = () => {
    router.push("/transferencias/internas/cuentas-mi-red/verificacion");
  };

  return (
    <ConfirmationPageShell
      breadcrumbs={["Inicio", "Transferencias", "Red Coopcentral"]}
      welcomeBarTitle="Red Coopcentral"
      welcomeBarBackHref="/transferencias/internas/cuentas-mi-red/detalle"
      fallbackPath="/transferencias/internas/cuentas-mi-red"
      steps={NETWORK_TRANSFER_STEPS}
      hasData={!!confirmationData}
      onBack={() =>
        router.push("/transferencias/internas/cuentas-mi-red/detalle")
      }
      onConfirm={handleConfirm}
    >
      {confirmationData && (
        <NetworkTransferConfirmationCard
          confirmationData={confirmationData}
          hideBalances={hideBalances}
        />
      )}
    </ConfirmationPageShell>
  );
}
