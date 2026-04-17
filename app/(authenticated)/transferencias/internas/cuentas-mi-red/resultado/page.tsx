"use client";

import { useState } from "react";
import { NetworkTransferResultCard, ResultPageShell } from "@/src/organisms";
import { useUIContext } from "@/src/contexts";
import {
  NetworkTransferResult,
  RegisteredNetworkAccount,
  NetworkProduct,
} from "@/src/types/networkTransfer";
import {
  NETWORK_TRANSFER_STEPS,
  mockNetworkSourceAccounts,
} from "@/src/mocks/mockNetworkTransferData";

const SESSION_KEYS = [
  "networkTransferRecipient",
  "networkTransferDestination",
  "networkTransferSourceId",
  "networkTransferAmount",
  "networkTransferConcept",
];

export default function ResultadoPage() {
  const { hideBalances } = useUIContext();
  const [result] = useState<NetworkTransferResult | null>(() => {
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
      status: "success" as const,
      sourceAccount: sourceAccount?.name || "Cuenta de Ahorros",
      destinationBank: "Coopcentral",
      destinationAccountNumber: `123-456789-${destination.maskedNumber.slice(-2)}`,
      recipientName: recipient.name,
      destinationAccount: `${destination.name} (${destination.type === "ahorros" ? "Ahorros" : "Corriente"} ${destination.maskedNumber})`,
      amountTransferred: Number(amount),
      concept: concept || undefined,
      transactionCost: 0,
      transactionDate: new Date().toLocaleDateString("es-CO", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      transactionTime: new Date().toLocaleTimeString("es-CO", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
      approvalNumber: Math.floor(100000 + Math.random() * 900000).toString(),
      description: "Transferencia Exitosa",
    };
  });

  return (
    <ResultPageShell
      breadcrumbs={["Inicio", "Transferencias", "A Cuentas de mi Red"]}
      welcomeBarTitle="A Cuentas de mi Red"
      welcomeBarBackHref="/transferencias"
      startFlowPath="/transferencias/internas/cuentas-mi-red"
      sessionKeysToClean={SESSION_KEYS}
      steps={NETWORK_TRANSFER_STEPS}
      stepperCurrentStep={4}
      hasResult={!!result}
      newTransactionLabel="Realizar otra transacción"
    >
      {result && (
        <NetworkTransferResultCard
          result={result}
          hideBalances={hideBalances}
        />
      )}
    </ResultPageShell>
  );
}
