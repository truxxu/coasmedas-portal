"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { NetworkTransferForm } from "@/src/organisms";
import { useUIContext, useWelcomeBar } from "@/src/contexts";
import {
  mockNetworkSourceAccounts,
  NETWORK_TRANSFER_STEPS,
} from "@/src/mocks/mockNetworkTransferData";
import { RegisteredNetworkAccount } from "@/src/types/networkTransfer";

export default function DetallePage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const [selectedSourceId, setSelectedSourceId] = useState("");
  const [selectedDestinationProductId, setSelectedDestinationProductId] =
    useState("");
  const [amount, setAmount] = useState("");
  const [concept, setConcept] = useState("");
  const [error, setError] = useState("");
  const [recipient, setRecipient] =
    useState<RegisteredNetworkAccount | null>(null);

  useEffect(() => {
    // Read selected recipient from sessionStorage
    const recipientData = sessionStorage.getItem(
      "networkTransferSelectedRecipient",
    );
    if (!recipientData) {
      router.replace("/transferencias/internas/cuentas-mi-red");
      return;
    }
    setRecipient(JSON.parse(recipientData));
  }, [router]);

  useEffect(() => {
    setWelcomeBar({
      title: "A Cuentas de mi Red",
      backHref: "/transferencias/internas/cuentas-mi-red",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const handleConfirm = () => {
    setError("");

    if (!selectedSourceId) {
      setError("Por favor selecciona una cuenta origen");
      return;
    }
    if (!selectedDestinationProductId) {
      setError("Por favor selecciona un producto destino");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError("Por favor ingresa un valor a transferir");
      return;
    }

    const sourceAccount = mockNetworkSourceAccounts.find(
      (acc) => acc.id === selectedSourceId,
    );

    if (sourceAccount && Number(amount) > sourceAccount.balance) {
      setError("Saldo insuficiente en la cuenta seleccionada");
      return;
    }

    if (!recipient) {
      setError("Error al obtener datos del destinatario");
      return;
    }

    const product = recipient.products.find(
      (p) => p.id === selectedDestinationProductId,
    );

    if (!product) {
      setError("Error al obtener datos del producto destino");
      return;
    }

    // Store data for next step
    sessionStorage.setItem(
      "networkTransferRecipient",
      JSON.stringify(recipient),
    );
    sessionStorage.setItem(
      "networkTransferDestination",
      JSON.stringify(product),
    );
    sessionStorage.setItem("networkTransferSourceId", selectedSourceId);
    sessionStorage.setItem("networkTransferAmount", amount);
    sessionStorage.setItem("networkTransferConcept", concept);

    router.push("/transferencias/internas/cuentas-mi-red/confirmacion");
  };

  const handleBack = () => {
    router.push("/transferencias/internas/cuentas-mi-red");
  };

  if (!recipient) {
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
        <Breadcrumbs
          items={["Inicio", "Transferencias", "A Cuentas de mi Red"]}
        />
      </div>

      {/* Stepper */}
      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={1} steps={NETWORK_TRANSFER_STEPS} />
      </div>

      {/* Transfer Form */}
      <NetworkTransferForm
        sourceAccounts={mockNetworkSourceAccounts}
        recipientName={recipient.name}
        recipientProducts={recipient.products}
        selectedSourceId={selectedSourceId}
        selectedDestinationProductId={selectedDestinationProductId}
        amount={amount}
        concept={concept}
        onSourceChange={setSelectedSourceId}
        onDestinationProductChange={setSelectedDestinationProductId}
        onAmountChange={setAmount}
        onConceptChange={setConcept}
        hideBalances={hideBalances}
        error={error}
      />

      {/* Footer Actions */}
      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          className="text-sm font-medium text-brand-teal-dark hover:underline"
        >
          Volver
        </button>
        <Button
          variant="primary"
          onClick={handleConfirm}
          disabled={
            !selectedSourceId || !selectedDestinationProductId || !amount
          }
        >
          Confirmar
        </Button>
      </div>
    </div>
  );
}
