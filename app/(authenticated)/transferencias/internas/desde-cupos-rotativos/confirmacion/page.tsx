"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { CupoRotativoConfirmationCard } from "@/src/organisms";
import { useUIContext, useWelcomeBar } from "@/src/contexts";
import type { CupoRotativoConfirmationData } from "@/src/types";
import {
  mockCuposRotativos,
  mockCupoRotativoDestinations,
  mockCupoRotativoUserData,
  TRANSFER_STEPS,
} from "@/src/mocks";

export default function ConfirmacionPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const [confirmationData] =
    useState<CupoRotativoConfirmationData | null>(() => {
      if (typeof window === 'undefined') return null;

      const cupoId = sessionStorage.getItem("cupoRotativoSelectedCupoId");
      const destinationId = sessionStorage.getItem("cupoRotativoDestinationId");
      const amount = sessionStorage.getItem("cupoRotativoAmount");

      if (!cupoId || !destinationId || !amount) {
        return null;
      }

      const selectedCupo = mockCuposRotativos.find((c) => c.id === cupoId);
      const selectedDestination = mockCupoRotativoDestinations.find(
        (d) => d.id === destinationId
      );

      if (!selectedCupo || !selectedDestination) {
        return null;
      }

      return {
        holderName: mockCupoRotativoUserData.holderName,
        documentNumber: mockCupoRotativoUserData.documentNumber,
        cupoOrigen: selectedCupo.name,
        cuentaDestino: `${selectedDestination.name} (${selectedDestination.maskedNumber})`,
        amount: Number(amount),
        transactionCost: 0,
      };
    });

  useEffect(() => {
    setWelcomeBar({
      title: "Desde Cupos Rotativos",
      backHref: "/transferencias/internas/desde-cupos-rotativos",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    if (!confirmationData) {
      router.push("/transferencias/internas/desde-cupos-rotativos");
    }
  }, [confirmationData, router]);

  const handleConfirmPayment = () => {
    if (confirmationData) {
      sessionStorage.setItem(
        "cupoRotativoConfirmation",
        JSON.stringify(confirmationData)
      );
    }

    router.push("/transferencias/internas/desde-cupos-rotativos/sms");
  };

  const handleBack = () => {
    router.push("/transferencias/internas/desde-cupos-rotativos");
  };

  if (!confirmationData) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="text-brand-gray-medium">Cargando...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Breadcrumbs
          items={["Inicio", "Transferencias", "Desde Cupos Rotativos"]}
        />
      </div>

      {/* Stepper */}
      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={2} steps={TRANSFER_STEPS} />
      </div>

      {/* Confirmation Card */}
      <CupoRotativoConfirmationCard
        confirmationData={confirmationData}
        hideBalances={hideBalances}
      />

      {/* Actions */}
      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          className="text-sm font-medium text-brand-teal-dark hover:underline"
        >
          Volver
        </button>
        <Button variant="primary" onClick={handleConfirmPayment}>
          Confirmar Pago
        </Button>
      </div>
    </div>
  );
}
