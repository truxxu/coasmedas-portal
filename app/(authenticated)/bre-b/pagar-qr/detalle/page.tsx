"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { BrebQrPaymentDetailsCard } from "@/src/organisms";
import { useUIContext, useWelcomeBar } from "@/src/contexts";
import { mockBrebSourceAccounts, BREB_QR_PAYMENT_STEPS } from "@/src/mocks";
import type { BrebQrDecodedPayload } from "@/src/types/brebQrPayment";

export default function BrebQrPaymentDetailsPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const [decoded, setDecoded] = useState<BrebQrDecodedPayload | null>(null);
  const [selectedSourceId, setSelectedSourceId] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setWelcomeBar({
      title: "Pagar con QR",
      backHref: "/bre-b/pagar-qr",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    const data = sessionStorage.getItem("brebQrDecoded");
    if (!data) {
      router.push("/bre-b/pagar-qr");
      return;
    }
    try {
      const parsed = JSON.parse(data) as BrebQrDecodedPayload;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDecoded(parsed);
      setAmount(String(parsed.amount));
    } catch {
      router.push("/bre-b/pagar-qr");
    }
  }, [router]);

  const handleConfirm = () => {
    setError("");
    if (!decoded) return;

    if (!selectedSourceId) {
      setError("Por favor selecciona una cuenta origen");
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

    sessionStorage.setItem("brebQrSourceId", selectedSourceId);
    sessionStorage.setItem("brebQrAmount", amount);

    router.push("/bre-b/pagar-qr/confirmacion");
  };

  const handleBack = () => {
    router.push("/bre-b/pagar-qr");
  };

  if (!decoded) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="text-brand-gray-medium">Cargando...</span>
      </div>
    );
  }

  const isFormValid = selectedSourceId && amount && Number(amount) > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumbs items={["Inicio", "Bre-B", "Pagar con QR"]} />
      </div>

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={1} steps={BREB_QR_PAYMENT_STEPS} />
      </div>

      <BrebQrPaymentDetailsCard
        destinationName={decoded.destinationName}
        sourceAccounts={mockBrebSourceAccounts}
        selectedSourceId={selectedSourceId}
        amount={amount}
        onSourceChange={setSelectedSourceId}
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
