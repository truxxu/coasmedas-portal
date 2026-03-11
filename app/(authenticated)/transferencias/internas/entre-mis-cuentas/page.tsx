"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { TransferDetailsCard } from "@/src/organisms";
import { useUIContext, useWelcomeBar } from "@/src/contexts";
import {
  mockTransferAccounts,
  mockDestinationProducts,
  TRANSFER_STEPS,
} from "@/src/mocks";

export default function EntreMisCuentasPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const [selectedSourceId, setSelectedSourceId] = useState("");
  const [selectedDestinationId, setSelectedDestinationId] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setWelcomeBar({
      title: "Entre mis Cuentas",
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
      setError("Por favor selecciona un producto destino");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError("Por favor ingresa un valor a transferir");
      return;
    }

    const sourceAccount = mockTransferAccounts.find(
      (acc) => acc.id === selectedSourceId
    );

    if (sourceAccount && Number(amount) > sourceAccount.balance) {
      setError("Saldo insuficiente en la cuenta seleccionada");
      return;
    }

    // Store data for next step
    sessionStorage.setItem("transferSourceId", selectedSourceId);
    sessionStorage.setItem("transferDestinationId", selectedDestinationId);
    sessionStorage.setItem("transferAmount", amount);

    router.push("/transferencias/internas/entre-mis-cuentas/confirmacion");
  };

  const handleBack = () => {
    router.push("/transferencias/internas");
  };

  return (
    <div className="space-y-6">
      {/* Header with Hide Balances Toggle */}
      <div className="flex items-center justify-between">
        <Breadcrumbs
          items={["Inicio", "Transferencias", "Entre mis Cuentas"]}
        />
      </div>

      {/* Stepper */}
      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={1} steps={TRANSFER_STEPS} />
      </div>

      {/* Form Card */}
      <TransferDetailsCard
        accounts={mockTransferAccounts}
        destinations={mockDestinationProducts}
        selectedSourceId={selectedSourceId}
        selectedDestinationId={selectedDestinationId}
        amount={amount}
        onSourceChange={setSelectedSourceId}
        onDestinationChange={setSelectedDestinationId}
        onAmountChange={setAmount}
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
          disabled={!selectedSourceId || !selectedDestinationId || !amount}
        >
          Confirmar
        </Button>
      </div>
    </div>
  );
}
