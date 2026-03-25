"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { PSERechargeDetailsCard } from "@/src/organisms";
import { useUIContext, useWelcomeBar } from "@/src/contexts";
import { mockPSERechargeAccounts, TRANSFER_STEPS } from "@/src/mocks";

export default function RecargarPSEPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const [selectedDestinationId, setSelectedDestinationId] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setWelcomeBar({
      title: "Recargar con PSE",
      backHref: "/transferencias/internas",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const handleConfirm = () => {
    setError("");

    if (!selectedDestinationId) {
      setError("Por favor selecciona una cuenta destino");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError("Por favor ingresa un valor valido");
      return;
    }

    // Store data for next step
    sessionStorage.setItem("pseRechargeDestinationId", selectedDestinationId);
    sessionStorage.setItem("pseRechargeAmount", amount);

    router.push("/transferencias/internas/recargar-pse/confirmacion");
  };

  const handleBack = () => {
    router.push("/transferencias/internas");
  };

  const isFormValid = selectedDestinationId && amount && Number(amount) > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Breadcrumbs items={["Inicio", "Transferencias", "Recargar con PSE"]} />
      </div>

      {/* Stepper */}
      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={1} steps={TRANSFER_STEPS} />
      </div>

      {/* Form Card */}
      <PSERechargeDetailsCard
        destinations={mockPSERechargeAccounts}
        selectedDestinationId={selectedDestinationId}
        amount={amount}
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
          disabled={!isFormValid}
        >
          Confirmar
        </Button>
      </div>
    </div>
  );
}
