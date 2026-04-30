"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { BrebKeyTransferConfirmationCard } from "@/src/organisms";
import { useUIContext } from "@/src/contexts";
import { useBrebPageHeader } from "@/src/hooks";
import type { BrebKeyTransferConfirmationData } from "@/src/types/brebKeyTransfer";
import { mockBrebSourceAccounts, BREB_KEY_TRANSFER_STEPS } from "@/src/mocks";
import { BREB_SESSION_KEYS } from "@/src/constants/brebSessionKeys";

export default function BrebKeyTransferConfirmacionPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  useBrebPageHeader("Pagar con Llave", "/bre-b/pagar-transferir-llave");

  const [confirmationData] = useState<BrebKeyTransferConfirmationData | null>(
    () => {
      if (typeof window === "undefined") return null;

      const sourceId = sessionStorage.getItem(
        BREB_SESSION_KEYS.keyTransfer.sourceId,
      );
      const destinationKey = sessionStorage.getItem(
        BREB_SESSION_KEYS.keyTransfer.destinationKey,
      );
      const amount = sessionStorage.getItem(
        BREB_SESSION_KEYS.keyTransfer.amount,
      );

      if (!sourceId || !destinationKey || !amount) return null;

      const source = mockBrebSourceAccounts.find((acc) => acc.id === sourceId);
      if (!source) return null;

      return {
        sourceProduct: `${source.type} (${source.maskedNumber})`,
        destinationHolder: "Usuario Desconocido",
        destinationKey,
        amount: Number(amount),
      };
    },
  );

  useEffect(() => {
    if (!confirmationData) {
      router.push("/bre-b/pagar-transferir-llave");
    }
  }, [confirmationData, router]);

  const handleConfirmPayment = () => {
    if (!confirmationData) return;
    sessionStorage.setItem(
      BREB_SESSION_KEYS.keyTransfer.confirmation,
      JSON.stringify(confirmationData),
    );
    router.push("/bre-b/pagar-transferir-llave/sms");
  };

  const handleBack = () => {
    router.push("/bre-b/pagar-transferir-llave");
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
      <div className="flex items-center justify-between">
        <Breadcrumbs items={["Inicio", "Bre-B", "Pagar con Llave"]} />
      </div>

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={2} steps={BREB_KEY_TRANSFER_STEPS} />
      </div>

      <BrebKeyTransferConfirmationCard
        confirmationData={confirmationData}
        hideBalances={hideBalances}
      />

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
