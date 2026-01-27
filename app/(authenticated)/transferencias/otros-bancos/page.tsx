"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { ExternalTransferDetailsCard } from "@/src/organisms";
import { useUIContext, useWelcomeBar } from "@/src/contexts";
import {
  mockExternalTransferSourceAccounts,
  mockExternalTransferDestinations,
  EXTERNAL_TRANSFER_STEPS,
} from "@/src/mocks";

export default function AOtrosBancosPage() {
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
      title: "A Otros Bancos",
      backHref: "/transferencias/internas",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const handleConfirm = () => {
    setError("");

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

    const sourceAccount = mockExternalTransferSourceAccounts.find(
      (acc) => acc.id === selectedSourceId,
    );

    if (sourceAccount && Number(amount) > sourceAccount.balance) {
      setError("El valor supera el saldo disponible");
      return;
    }

    if (concept.length > 100) {
      setError("El concepto no puede exceder 100 caracteres");
      return;
    }

    // Store data for next step
    sessionStorage.setItem("externalTransferSourceId", selectedSourceId);
    sessionStorage.setItem(
      "externalTransferDestinationId",
      selectedDestinationId,
    );
    sessionStorage.setItem("externalTransferAmount", amount);
    sessionStorage.setItem("externalTransferConcept", concept);

    router.push("/transferencias/otros-bancos/confirmacion");
  };

  const handleBack = () => {
    router.push("/transferencias/internas");
  };

  const isFormValid =
    selectedSourceId &&
    selectedDestinationId &&
    amount &&
    Number(amount) > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Breadcrumbs items={["Inicio", "Transferencias", "A Otros Bancos"]} />
      </div>

      {/* Stepper */}
      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={1} steps={EXTERNAL_TRANSFER_STEPS} />
      </div>

      {/* Form Card */}
      <ExternalTransferDetailsCard
        sourceAccounts={mockExternalTransferSourceAccounts}
        destinationAccounts={mockExternalTransferDestinations}
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

      {/* Actions */}
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
          disabled={!isFormValid}
        >
          Confirmar
        </Button>
      </div>
    </div>
  );
}
