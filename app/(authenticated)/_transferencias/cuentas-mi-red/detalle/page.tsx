"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { NetworkTransferForm } from "@/src/organisms";
import { useUIContext, useWelcomeBar } from "@/src/contexts";
import {
  mockSourceAccounts,
  mockRegisteredAccounts,
  NETWORK_TRANSFER_STEPS,
} from "@/src/mocks/mockNetworkTransferData";
import {
  RegisteredNetworkAccount,
  NetworkProduct,
} from "@/src/types/networkTransfer";

export default function DetallePage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const [selectedSourceId, setSelectedSourceId] = useState("");
  const [selectedDestinationId, setSelectedDestinationId] = useState("");
  const [amount, setAmount] = useState("");
  const [concept, setConcept] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setWelcomeBar({
      title: "A Cuentas de mi Red",
      backHref: "/transferencias",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  // Parse the destination ID to get recipient and product
  const getDestinationData = (): {
    recipient: RegisteredNetworkAccount | null;
    product: NetworkProduct | null;
  } => {
    if (!selectedDestinationId) {
      return { recipient: null, product: null };
    }

    const [accountId, productId] = selectedDestinationId.split("-");
    const recipient = mockRegisteredAccounts.find((acc) => acc.id === accountId);
    const product = recipient?.products.find((p) => p.id === productId);

    return { recipient: recipient || null, product: product || null };
  };

  const handleConfirm = () => {
    setError("");

    // Validation
    if (!selectedSourceId) {
      setError("Por favor selecciona una cuenta origen");
      return;
    }
    if (!selectedDestinationId) {
      setError("Por favor selecciona una cuenta destino");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError("Por favor ingresa un valor a transferir");
      return;
    }

    const sourceAccount = mockSourceAccounts.find(
      (acc) => acc.id === selectedSourceId,
    );

    if (sourceAccount && Number(amount) > sourceAccount.balance) {
      setError("Saldo insuficiente en la cuenta seleccionada");
      return;
    }

    const { recipient, product } = getDestinationData();

    if (!recipient || !product) {
      setError("Error al obtener datos de la cuenta destino");
      return;
    }

    // Store data for next step
    sessionStorage.setItem("networkTransferRecipient", JSON.stringify(recipient));
    sessionStorage.setItem("networkTransferDestination", JSON.stringify(product));
    sessionStorage.setItem("networkTransferSourceId", selectedSourceId);
    sessionStorage.setItem("networkTransferAmount", amount);
    sessionStorage.setItem("networkTransferConcept", concept);

    // Navigate to confirmation
    router.push("/transferencias/cuentas-mi-red/confirmacion");
  };

  const handleBack = () => {
    router.push("/transferencias");
  };

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
        sourceAccounts={mockSourceAccounts}
        registeredAccounts={mockRegisteredAccounts}
        selectedSourceId={selectedSourceId}
        selectedDestinationId={selectedDestinationId}
        amount={amount}
        concept={concept}
        onSourceChange={setSelectedSourceId}
        onDestinationChange={setSelectedDestinationId}
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
          disabled={!selectedSourceId || !selectedDestinationId || !amount}
        >
          Confirmar
        </Button>
      </div>
    </div>
  );
}
