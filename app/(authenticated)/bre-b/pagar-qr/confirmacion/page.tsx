"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { BrebQrPaymentConfirmationCard } from "@/src/organisms";
import { useUIContext } from "@/src/contexts";
import { useBrebPageHeader } from "@/src/hooks";
import type {
  BrebQrDecodedPayload,
  BrebQrPaymentConfirmationData,
} from "@/src/types/brebQrPayment";
import { mockBrebSourceAccounts, BREB_QR_PAYMENT_STEPS } from "@/src/mocks";
import { BREB_SESSION_KEYS } from "@/src/constants/brebSessionKeys";

export default function BrebQrPaymentConfirmacionPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  useBrebPageHeader("Pagar con QR", "/bre-b/pagar-qr/detalle");

  const [confirmationData] = useState<BrebQrPaymentConfirmationData | null>(
    () => {
      if (typeof window === "undefined") return null;

      const decodedStr = sessionStorage.getItem(
        BREB_SESSION_KEYS.qrPayment.decoded,
      );
      const sourceId = sessionStorage.getItem(
        BREB_SESSION_KEYS.qrPayment.sourceId,
      );
      const amount = sessionStorage.getItem(BREB_SESSION_KEYS.qrPayment.amount);

      if (!decodedStr || !sourceId || !amount) return null;

      let decoded: BrebQrDecodedPayload;
      try {
        decoded = JSON.parse(decodedStr) as BrebQrDecodedPayload;
      } catch {
        return null;
      }

      const source = mockBrebSourceAccounts.find((acc) => acc.id === sourceId);
      if (!source) return null;

      return {
        sourceProduct: `${source.type} (${source.maskedNumber})`,
        destinationName: decoded.destinationName,
        destinationKey: decoded.destinationKey,
        amount: Number(amount),
      };
    },
  );

  useEffect(() => {
    if (!confirmationData) {
      router.push("/bre-b/pagar-qr");
    }
  }, [confirmationData, router]);

  const handleConfirmPayment = () => {
    if (!confirmationData) return;
    sessionStorage.setItem(
      BREB_SESSION_KEYS.qrPayment.confirmation,
      JSON.stringify(confirmationData),
    );
    router.push("/bre-b/pagar-qr/sms");
  };

  const handleBack = () => {
    router.push("/bre-b/pagar-qr/detalle");
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
        <Breadcrumbs items={["Inicio", "Bre-B", "Pagar con QR"]} />
      </div>

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={2} steps={BREB_QR_PAYMENT_STEPS} />
      </div>

      <BrebQrPaymentConfirmationCard
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
