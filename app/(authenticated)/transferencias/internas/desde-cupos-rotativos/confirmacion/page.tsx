"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ConfirmationPageShell,
  CupoRotativoConfirmationCard,
} from "@/src/organisms";
import { useUIContext } from "@/src/contexts";
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
  const [confirmationData] = useState<CupoRotativoConfirmationData | null>(
    () => {
      if (typeof window === "undefined") return null;

      const cupoId = sessionStorage.getItem("cupoRotativoSelectedCupoId");
      const destinationId = sessionStorage.getItem("cupoRotativoDestinationId");
      const amount = sessionStorage.getItem("cupoRotativoAmount");

      if (!cupoId || !destinationId || !amount) {
        return null;
      }

      const selectedCupo = mockCuposRotativos.find((c) => c.id === cupoId);
      const selectedDestination = mockCupoRotativoDestinations.find(
        (d) => d.id === destinationId,
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
    },
  );

  const handleConfirmPayment = () => {
    if (confirmationData) {
      sessionStorage.setItem(
        "cupoRotativoConfirmation",
        JSON.stringify(confirmationData),
      );
    }
    router.push("/transferencias/internas/desde-cupos-rotativos/sms");
  };

  return (
    <ConfirmationPageShell
      breadcrumbs={["Inicio", "Transferencias", "Desde Cupos Rotativos"]}
      welcomeBarTitle="Desde Cupos Rotativos"
      welcomeBarBackHref="/transferencias/internas/desde-cupos-rotativos"
      fallbackPath="/transferencias/internas/desde-cupos-rotativos"
      steps={TRANSFER_STEPS}
      hasData={!!confirmationData}
      onBack={() =>
        router.push("/transferencias/internas/desde-cupos-rotativos")
      }
      onConfirm={handleConfirmPayment}
    >
      {confirmationData && (
        <CupoRotativoConfirmationCard
          confirmationData={confirmationData}
          hideBalances={hideBalances}
        />
      )}
    </ConfirmationPageShell>
  );
}
