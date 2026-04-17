"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ConfirmationPageShell,
  TarjetaPaymentConfirmationCard,
} from "@/src/organisms";
import { useUIContext, useUserContext } from "@/src/contexts";
import { TarjetaPaymentConfirmationData } from "@/src/types/tarjeta-payment";
import { TarjetaCreditoProduct } from "@/src/types/tarjetaCredito";
import { TARJETA_PAYMENT_STEPS } from "@/src/mocks";
import { sendTransactionOtp } from "@/services/auth.service";

const BREADCRUMBS = ["Inicio", "Tarjeta de Crédito", "Pagar Tarjeta"];

export default function PagarTarjetaConfirmacionPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { user } = useUserContext();

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [confirmationData] = useState<TarjetaPaymentConfirmationData | null>(
    () => {
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
    },
  );

  const handleBack = () => {
    const cardId = sessionStorage.getItem("tarjetaPaymentCardId") ?? "";
    router.push(`/tarjeta/pagar?cardId=${cardId}`);
  };

  const handleConfirm = async () => {
    if (!termsAccepted || !confirmationData) return;
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
    <ConfirmationPageShell
      breadcrumbs={BREADCRUMBS}
      welcomeBarTitle="Pagar Tarjeta"
      welcomeBarBackHref="/tarjeta/pagar"
      fallbackPath="/tarjeta"
      steps={TARJETA_PAYMENT_STEPS}
      hasData={!!confirmationData}
      isSubmitting={isLoading}
      confirmDisabled={!termsAccepted}
      submittingLabel="Procesando..."
      volverColorClass="text-brand-navy"
      breadcrumbsWrapped={false}
      noDataFallback={null}
      onBack={handleBack}
      onConfirm={handleConfirm}
    >
      {confirmationData && (
        <TarjetaPaymentConfirmationCard
          confirmationData={confirmationData}
          hideBalances={hideBalances}
          termsAccepted={termsAccepted}
          onTermsChange={setTermsAccepted}
        />
      )}
    </ConfirmationPageShell>
  );
}
