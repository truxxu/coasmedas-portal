"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ConfirmationPageShell,
  TarjetaBloqueoConfirmationCard,
} from "@/src/organisms";
import { useUserContext } from "@/src/contexts";
import { TarjetaBloqueoConfirmationData } from "@/src/types/tarjeta-bloqueo";
import { TarjetaCreditoProduct } from "@/src/types/tarjetaCredito";
import { TARJETA_BLOQUEO_STEPS } from "@/src/mocks";
import { sendTransactionOtp } from "@/services/auth.service";

const BREADCRUMBS = ["Inicio", "Tarjeta de Crédito", "Bloqueo y Activación"];

export default function BloquearConfirmacionPage() {
  const router = useRouter();
  const { user } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);

  const [confirmationData] = useState<TarjetaBloqueoConfirmationData | null>(
    () => {
      if (typeof window === "undefined") return null;

      const productStr = sessionStorage.getItem("tarjetaBloqueoProduct");
      if (!productStr) return null;

      try {
        const product: TarjetaCreditoProduct = JSON.parse(productStr);
        return {
          cardId: product.id,
          cardDisplay: `${product.title} (**** ${product.last4})`,
        };
      } catch {
        return null;
      }
    },
  );

  const handleBack = () => {
    if (!confirmationData) return;
    router.push(
      `/tarjeta/bloqueo-activacion/bloquear?cardId=${confirmationData.cardId}`,
    );
  };

  const handleConfirm = async () => {
    if (!confirmationData) return;
    setIsLoading(true);
    try {
      sessionStorage.setItem(
        "tarjetaBloqueoConfirmation",
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

      router.push("/tarjeta/bloqueo-activacion/bloquear/codigo-sms");
    } catch (err) {
      console.error("Error sending OTP:", err);
      setIsLoading(false);
    }
  };

  return (
    <ConfirmationPageShell
      breadcrumbs={BREADCRUMBS}
      welcomeBarTitle="Bloqueo y Activación"
      welcomeBarBackHref="/tarjeta/bloqueo-activacion/bloquear"
      fallbackPath="/tarjeta/bloqueo-activacion"
      steps={TARJETA_BLOQUEO_STEPS}
      hasData={!!confirmationData}
      isSubmitting={isLoading}
      confirmLabel="Bloqueo Tarjeta"
      submittingLabel="Procesando..."
      volverColorClass="text-brand-navy"
      breadcrumbsWrapped={false}
      noDataFallback={null}
      onBack={handleBack}
      onConfirm={handleConfirm}
    >
      {confirmationData && (
        <TarjetaBloqueoConfirmationCard confirmationData={confirmationData} />
      )}
    </ConfirmationPageShell>
  );
}
