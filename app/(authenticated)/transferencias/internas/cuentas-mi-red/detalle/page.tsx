"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, HideBalancesToggle, Stepper } from "@/src/molecules";
import { NetworkTransferForm } from "@/src/organisms";
import { useUIContext, useWelcomeBar } from "@/src/contexts";
import {
  mockSourceAccounts,
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

  const [recipient, setRecipient] = useState<RegisteredNetworkAccount | null>(
    null
  );
  const [destinationProduct, setDestinationProduct] =
    useState<NetworkProduct | null>(null);
  const [selectedSourceId, setSelectedSourceId] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setWelcomeBar({
      title: "A Cuentas de mi Red",
      backHref: "/transferencias/internas/cuentas-mi-red",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    // Get data from previous step
    const recipientData = sessionStorage.getItem("networkTransferRecipient");
    const destinationData = sessionStorage.getItem(
      "networkTransferDestination"
    );

    if (!recipientData || !destinationData) {
      router.push("/transferencias/internas/cuentas-mi-red");
      return;
    }

    setRecipient(JSON.parse(recipientData));
    setDestinationProduct(JSON.parse(destinationData));
  }, [router]);

  const handleConfirm = () => {
    setError("");

    // Validation
    if (!selectedSourceId) {
      setError("Por favor selecciona una cuenta origen");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError("Por favor ingresa un valor a transferir");
      return;
    }

    const sourceAccount = mockSourceAccounts.find(
      (acc) => acc.id === selectedSourceId
    );

    if (sourceAccount && Number(amount) > sourceAccount.balance) {
      setError("Saldo insuficiente en la cuenta seleccionada");
      return;
    }

    // Store data for next step
    sessionStorage.setItem("networkTransferSourceId", selectedSourceId);
    sessionStorage.setItem("networkTransferAmount", amount);

    // Navigate to SMS verification
    router.push("/transferencias/internas/cuentas-mi-red/verificacion");
  };

  const handleBack = () => {
    router.push("/transferencias/internas/cuentas-mi-red");
  };

  if (!recipient || !destinationProduct) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="text-gray-500">Cargando...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Hide Balances Toggle */}
      <div className="flex items-center justify-between">
        <Breadcrumbs
          items={["Inicio", "Transferencias", "A Cuentas de mi Red"]}
        />
      </div>

      {/* Stepper */}
      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={2} steps={NETWORK_TRANSFER_STEPS} />
      </div>

      {/* Transfer Form */}
      <NetworkTransferForm
        recipientName={recipient.name}
        sourceAccounts={mockSourceAccounts}
        destinationProduct={destinationProduct}
        selectedSourceId={selectedSourceId}
        amount={amount}
        onSourceChange={setSelectedSourceId}
        onAmountChange={setAmount}
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
          disabled={!selectedSourceId || !amount}
        >
          Confirmar
        </Button>
      </div>
    </div>
  );
}
