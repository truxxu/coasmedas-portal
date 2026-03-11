"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { TransferResultCard } from "@/src/organisms";
import { useUIContext, useWelcomeBar } from "@/src/contexts";
import type { TransferResult } from "@/src/types/transfer";
import { TRANSFER_STEPS, mockTransferResult } from "@/src/mocks";

export default function ResultadoPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const [result] = useState<TransferResult | null>(() => {
    if (typeof window === 'undefined') return null;

    const confirmationData = sessionStorage.getItem("transferConfirmation");
    if (!confirmationData) return null;

    // Use mock result - in production this would come from API
    return mockTransferResult;
  });

  useEffect(() => {
    setWelcomeBar({
      title: "Entre mis Cuentas",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    if (!result) {
      router.push("/transferencias/internas/entre-mis-cuentas");
    }
  }, [result, router]);

  const handlePrintSave = () => {
    window.print();
  };

  const handleNewTransaction = () => {
    // Clear session storage
    sessionStorage.removeItem("transferSourceId");
    sessionStorage.removeItem("transferDestinationId");
    sessionStorage.removeItem("transferAmount");
    sessionStorage.removeItem("transferConfirmation");

    // Navigate to start of flow
    router.push("/transferencias/internas/entre-mis-cuentas");
  };

  const handleFinish = () => {
    // Clear session storage
    sessionStorage.removeItem("transferSourceId");
    sessionStorage.removeItem("transferDestinationId");
    sessionStorage.removeItem("transferAmount");
    sessionStorage.removeItem("transferConfirmation");

    // Navigate to home
    router.push("/home");
  };

  if (!result) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="text-brand-gray-medium">Cargando resultado...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Breadcrumbs
          items={["Inicio", "Transferencias", "Entre mis Cuentas"]}
        />
      </div>

      {/* Stepper - All completed */}
      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={5} steps={TRANSFER_STEPS} />
      </div>

      {/* Result Card */}
      <TransferResultCard result={result} hideBalances={hideBalances} />

      {/* Actions */}
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
