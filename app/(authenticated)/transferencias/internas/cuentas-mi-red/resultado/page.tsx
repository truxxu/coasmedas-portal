"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { NetworkTransferResultCard } from "@/src/organisms";
import { useUIContext, useWelcomeBar } from "@/src/contexts";
import {
  NetworkTransferResult,
  RegisteredNetworkAccount,
  NetworkProduct,
} from "@/src/types/networkTransfer";
import {
  NETWORK_TRANSFER_STEPS,
  mockNetworkSourceAccounts,
} from "@/src/mocks/mockNetworkTransferData";

export default function ResultadoPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
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

  useEffect(() => {
    setWelcomeBar({
      title: "A Cuentas de mi Red",
      backHref: "/transferencias",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    if (!result) {
      router.push("/transferencias/internas/cuentas-mi-red");
    }
  }, [result, router]);

  const clearNetworkTransferData = () => {
    sessionStorage.removeItem("networkTransferRecipient");
    sessionStorage.removeItem("networkTransferDestination");
    sessionStorage.removeItem("networkTransferSourceId");
    sessionStorage.removeItem("networkTransferAmount");
    sessionStorage.removeItem("networkTransferConcept");
  };

  const handlePrintSave = () => {
    window.print();
  };

  const handleNewTransaction = () => {
    clearNetworkTransferData();
    router.push("/transferencias/internas/cuentas-mi-red");
  };

  const handleFinish = () => {
    clearNetworkTransferData();
    router.push("/home");
  };

  if (!result) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="text-gray-500">Cargando resultado...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Breadcrumbs
          items={["Inicio", "Transferencias", "A Cuentas de mi Red"]}
        />
      </div>

      {/* Stepper - All completed */}
      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={4} steps={NETWORK_TRANSFER_STEPS} />
      </div>

      {/* Result Card */}
      <NetworkTransferResultCard result={result} hideBalances={hideBalances} />

      {/* Footer Actions */}
      <div className="flex flex-wrap justify-end gap-3">
        <Button variant="secondary" onClick={handlePrintSave}>
          Imprimir/Guardar
        </Button>
        <Button variant="secondary" onClick={handleNewTransaction}>
          Realizar otra transacción
        </Button>
        <Button variant="primary" onClick={handleFinish}>
          Finalizar
        </Button>
      </div>
    </div>
  );
}
