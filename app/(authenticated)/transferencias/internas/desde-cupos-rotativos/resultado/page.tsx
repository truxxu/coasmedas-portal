"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { CupoRotativoResultCard } from "@/src/organisms";
import { useUIContext, useWelcomeBar } from "@/src/contexts";
import type { CupoRotativoTransferResult } from "@/src/types";
import { TRANSFER_STEPS } from "@/src/mocks";

export default function ResultadoPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const [result, setResult] = useState<CupoRotativoTransferResult | null>(null);

  useEffect(() => {
    setWelcomeBar({
      title: "Desde Cupos Rotativos",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    // Get result from session storage
    const resultData = sessionStorage.getItem("cupoRotativoTransferResult");

    if (!resultData) {
      router.push("/transferencias/internas/desde-cupos-rotativos");
      return;
    }

    try {
      const parsedResult = JSON.parse(resultData) as CupoRotativoTransferResult;
      setResult(parsedResult);
    } catch {
      router.push("/transferencias/internas/desde-cupos-rotativos");
    }
  }, [router]);

  const handlePrintSave = () => {
    window.print();
  };

  const handleNewTransaction = () => {
    // Clear session storage
    sessionStorage.removeItem("cupoRotativoSelectedCupoId");
    sessionStorage.removeItem("cupoRotativoDestinationId");
    sessionStorage.removeItem("cupoRotativoAmount");
    sessionStorage.removeItem("cupoRotativoConfirmation");
    sessionStorage.removeItem("cupoRotativoTransferResult");

    // Navigate to start of flow
    router.push("/transferencias/internas/desde-cupos-rotativos");
  };

  const handleFinish = () => {
    // Clear session storage
    sessionStorage.removeItem("cupoRotativoSelectedCupoId");
    sessionStorage.removeItem("cupoRotativoDestinationId");
    sessionStorage.removeItem("cupoRotativoAmount");
    sessionStorage.removeItem("cupoRotativoConfirmation");
    sessionStorage.removeItem("cupoRotativoTransferResult");

    // Navigate to home
    router.push("/transferencias/internas");
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
          items={["Inicio", "Transferencias", "Desde Cupos Rotativos"]}
        />
      </div>

      {/* Stepper - All completed */}
      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={5} steps={TRANSFER_STEPS} />
      </div>

      {/* Result Card */}
      <CupoRotativoResultCard result={result} hideBalances={hideBalances} />

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
