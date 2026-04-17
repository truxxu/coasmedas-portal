"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ConfirmationPageShell,
  TarjetaAvanceConfirmationCard,
} from "@/src/organisms";
import { useUIContext, useUserContext } from "@/src/contexts";
import { TarjetaAvanceConfirmationData } from "@/src/types/tarjeta-avance";
import { TarjetaCreditoProduct } from "@/src/types/tarjetaCredito";
import { TARJETA_AVANCE_STEPS } from "@/src/mocks";
import { sendTransactionOtp } from "@/services/auth.service";

const BREADCRUMBS = ["Inicio", "Tarjeta de Crédito", "Realizar Avance"];
const COMISION_RATE = 0.05;

export default function AvanceConfirmacionPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { user } = useUserContext();

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [confirmationData] = useState<TarjetaAvanceConfirmationData | null>(
    () => {
      if (typeof window === "undefined") return null;

      const productStr = sessionStorage.getItem("tarjetaAvanceProduct");
      const valorStr = sessionStorage.getItem("tarjetaAvanceValor");
      const cuotasStr = sessionStorage.getItem("tarjetaAvanceCuotas");
      const destinationDisplay = sessionStorage.getItem(
        "tarjetaAvanceDestinationDisplay",
      );

      if (!productStr || !valorStr || !cuotasStr || !destinationDisplay)
        return null;

      const product: TarjetaCreditoProduct = JSON.parse(productStr);
      const valor = parseInt(valorStr, 10) || 0;
      const cuotas = parseInt(cuotasStr, 10) || 0;

      const comision = Math.round(valor * COMISION_RATE);
      const valorTotal = valor + comision;
      const valorPorCuota = cuotas > 0 ? Math.round(valorTotal / cuotas) : 0;
      const cupoRestante = Math.max(0, product.cupoDisponible - valor);

      return {
        destinationAccount: destinationDisplay,
        tarjetaDisplay: `${product.title} (****${product.last4})`,
        cuotas,
        comision,
        valorPorCuota,
        cupoRestante,
        valorTotal,
        valorAvance: valor,
      };
    },
  );

  const handleBack = () => {
    const cardId = sessionStorage.getItem("tarjetaAvanceCardId") ?? "";
    router.push(`/tarjeta/avance?cardId=${cardId}`);
  };

  const handleConfirm = async () => {
    if (!termsAccepted || !confirmationData) return;
    setIsLoading(true);
    try {
      sessionStorage.setItem(
        "tarjetaAvanceConfirmation",
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

      router.push("/tarjeta/avance/codigo-sms");
    } catch (err) {
      console.error("Error sending OTP:", err);
      setIsLoading(false);
    }
  };

  return (
    <ConfirmationPageShell
      breadcrumbs={BREADCRUMBS}
      welcomeBarTitle="Realizar Avance"
      welcomeBarBackHref="/tarjeta/avance"
      fallbackPath="/tarjeta"
      steps={TARJETA_AVANCE_STEPS}
      hasData={!!confirmationData}
      isSubmitting={isLoading}
      confirmDisabled={!termsAccepted}
      confirmLabel="Confirmar Avance"
      submittingLabel="Procesando..."
      volverColorClass="text-brand-navy"
      breadcrumbsWrapped={false}
      noDataFallback={null}
      onBack={handleBack}
      onConfirm={handleConfirm}
    >
      {confirmationData && (
        <TarjetaAvanceConfirmationCard
          confirmationData={confirmationData}
          hideBalances={hideBalances}
          termsAccepted={termsAccepted}
          onTermsChange={setTermsAccepted}
        />
      )}
    </ConfirmationPageShell>
  );
}
