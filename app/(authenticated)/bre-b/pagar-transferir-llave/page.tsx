"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { BrebKeyTransferDetailsCard } from "@/src/organisms";
import { useUIContext, useWelcomeBar } from "@/src/contexts";
import { mockBrebSourceAccounts, BREB_KEY_TRANSFER_STEPS } from "@/src/mocks";

export default function BrebKeyTransferPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const [selectedSourceId, setSelectedSourceId] = useState("");
  const [destinationKey, setDestinationKey] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setWelcomeBar({
      title: "Pagar con Llave",
      backHref: "/bre-b",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const handleConfirm = () => {
    setError("");

    if (!selectedSourceId) {
      setError("Por favor selecciona una cuenta origen");
      return;
    }
    if (!destinationKey.trim()) {
      setError("Por favor ingresa la llave del destinatario");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      setError("Por favor ingresa un valor a enviar");
      return;
    }

    const sourceAccount = mockBrebSourceAccounts.find(
      (acc) => acc.id === selectedSourceId,
    );
    if (sourceAccount && Number(amount) > sourceAccount.balance) {
      setError("El valor supera el saldo disponible");
      return;
    }

    sessionStorage.setItem("brebKeyTransferSourceId", selectedSourceId);
    sessionStorage.setItem("brebKeyTransferDestinationKey", destinationKey);
    sessionStorage.setItem("brebKeyTransferAmount", amount);

    router.push("/bre-b/pagar-transferir-llave/confirmacion");
  };

  const handleBack = () => {
    router.push("/bre-b");
  };

  const isFormValid =
    selectedSourceId && destinationKey.trim() && amount && Number(amount) > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumbs items={["Inicio", "Bre-B", "Pagar con Llave"]} />
      </div>

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={1} steps={BREB_KEY_TRANSFER_STEPS} />
      </div>

      <BrebKeyTransferDetailsCard
        sourceAccounts={mockBrebSourceAccounts}
        selectedSourceId={selectedSourceId}
        destinationKey={destinationKey}
        amount={amount}
        onSourceChange={setSelectedSourceId}
        onDestinationKeyChange={setDestinationKey}
        onAmountChange={setAmount}
        hideBalances={hideBalances}
        error={error}
      />

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
          Continuar
        </Button>
      </div>
    </div>
  );
}
