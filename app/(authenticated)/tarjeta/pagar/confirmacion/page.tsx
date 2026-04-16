"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { TarjetaPaymentConfirmationCard } from "@/src/organisms";
import { useUIContext, useUserContext, useWelcomeBar } from "@/src/contexts";
import { TarjetaPaymentConfirmationData } from "@/src/types/tarjeta-payment";
import { TarjetaCreditoProduct } from "@/src/types/tarjetaCredito";
import { TARJETA_PAYMENT_STEPS } from "@/src/mocks";
import { sendTransactionOtp } from "@/services/auth.service";

const BREADCRUMBS = ["Inicio", "Tarjeta de Crédito", "Pagar Tarjeta"];

export default function PagarTarjetaConfirmacionPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { user } = useUserContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const confirmationData =
    useMemo<TarjetaPaymentConfirmationData | null>(() => {
      if (typeof window === "undefined") return null;

      const productStr = sessionStorage.getItem("tarjetaPaymentProduct");
      const valorStr = sessionStorage.getItem("tarjetaPaymentValor");
      const sourceDisplay = sessionStorage.getItem(
        "tarjetaSourceAccountDisplay",
      );

      if (!productStr || !valorStr || !sourceDisplay) return null;

      const product: TarjetaCreditoProduct = JSON.parse(productStr);
      const valor = parseInt(valorStr, 10) || 0;

      return {
        sourceAccount: sourceDisplay,
        tarjetaDisplay: `${product.title} (****${product.last4})`,
        newEstimatedBalance: Math.max(0, product.deudaTotal - valor),
        valorAPagar: valor,
      };
    }, []);

  useEffect(() => {
    setWelcomeBar({
      title: "Pagar Tarjeta",
      backHref: "/tarjeta/pagar",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    if (!confirmationData) {
      router.push("/tarjeta");
    }
  }, [confirmationData, router]);

  if (!confirmationData) {
    return null;
  }

  const handleBack = () => {
    const cardId = sessionStorage.getItem("tarjetaPaymentCardId") ?? "";
    router.push(`/tarjeta/pagar?cardId=${cardId}`);
  };

  const handleConfirm = async () => {
    if (!termsAccepted) return;
    setIsLoading(true);
    try {
      sessionStorage.setItem(
        "tarjetaPaymentConfirmation",
        JSON.stringify(confirmationData),
      );

      const { documentType, documentNumber } = user ?? {};
      if (documentType && documentNumber) {
        await sendTransactionOtp({
          documentType,
          documentNumber,
          trnType: "PaymentInternal",
        });
      }

      router.push("/tarjeta/pagar/codigo-sms");
    } catch (err) {
      console.error("Error sending OTP:", err);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={BREADCRUMBS} />

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={2} steps={TARJETA_PAYMENT_STEPS} />
      </div>

      <TarjetaPaymentConfirmationCard
        confirmationData={confirmationData}
        hideBalances={hideBalances}
        termsAccepted={termsAccepted}
        onTermsChange={setTermsAccepted}
      />

      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          disabled={isLoading}
          className="text-sm font-medium text-brand-navy hover:underline disabled:opacity-50"
        >
          Volver
        </button>
        <Button
          variant="primary"
          onClick={handleConfirm}
          disabled={!termsAccepted || isLoading}
        >
          {isLoading ? "Procesando..." : "Confirmar Pago"}
        </Button>
      </div>
    </div>
  );
}
