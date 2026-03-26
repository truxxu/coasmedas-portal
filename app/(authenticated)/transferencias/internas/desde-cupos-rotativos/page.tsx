"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { CupoRotativoDetailsCard } from "@/src/organisms";
import { useUIContext, useWelcomeBar } from "@/src/contexts";
import {
  mockCuposRotativos,
  mockCupoRotativoDestinations,
  TRANSFER_STEPS,
} from "@/src/mocks";

export default function DesdeCuposRotativosPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const [selectedCupoId, setSelectedCupoId] = useState("");
  const [selectedDestinationId, setSelectedDestinationId] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setWelcomeBar({
      title: "Desde Cupos Rotativos",
      backHref: "/transferencias/internas",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const handleConfirm = () => {
    setError("");

    if (!selectedCupoId) {
      setError("Por favor selecciona un cupo rotativo.");
      return;
    }
    if (!selectedDestinationId) {
      setError("Por favor selecciona una cuenta destino.");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError("Por favor ingresa un valor valido.");
      return;
    }

    const selectedCupo = mockCuposRotativos.find(
      (cupo) => cupo.id === selectedCupoId,
    );

    if (selectedCupo && Number(amount) > selectedCupo.availableAmount) {
      setError("El valor supera el cupo disponible.");
      return;
    }

    // Store data for next step
    sessionStorage.setItem("cupoRotativoSelectedCupoId", selectedCupoId);
    sessionStorage.setItem("cupoRotativoDestinationId", selectedDestinationId);
    sessionStorage.setItem("cupoRotativoAmount", amount);

    router.push("/transferencias/internas/desde-cupos-rotativos/confirmacion");
  };

  const handleBack = () => {
    router.push("/transferencias/internas");
  };

  return (
    <div className="space-y-6">
      {/* Header with Breadcrumbs */}
      <div className="flex items-center justify-between">
        <Breadcrumbs
          items={["Inicio", "Transferencias", "Desde Cupos Rotativos"]}
        />
      </div>

      {/* Stepper */}
      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={1} steps={TRANSFER_STEPS} />
      </div>

      {/* Form Card */}
      <CupoRotativoDetailsCard
        cupos={mockCuposRotativos}
        destinations={mockCupoRotativoDestinations}
        selectedCupoId={selectedCupoId}
        selectedDestinationId={selectedDestinationId}
        amount={amount}
        onCupoChange={setSelectedCupoId}
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
          disabled={!selectedCupoId || !selectedDestinationId || !amount}
        >
          Confirmar
        </Button>
      </div>
    </div>
  );
}
