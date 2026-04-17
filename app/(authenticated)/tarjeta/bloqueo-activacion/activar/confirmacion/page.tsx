"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ConfirmationPageShell,
  TarjetaActivacionConfirmationCard,
} from "@/src/organisms";
import { useUserContext } from "@/src/contexts";
import { TarjetaActivacionConfirmationData } from "@/src/types/tarjeta-activacion";
import { TarjetaCreditoProduct } from "@/src/types/tarjetaCredito";
import { TarjetaActivacionFormData } from "@/src/schemas/tarjetaActivacionSchema";
import { TARJETA_ACTIVACION_STEPS } from "@/src/mocks";
import { sendTransactionOtp } from "@/services/auth.service";

const BREADCRUMBS = ["Inicio", "Tarjeta de Crédito", "Bloqueo y Activación"];

export default function ActivarConfirmacionPage() {
  const router = useRouter();
  const { user } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);

  const [confirmationData] = useState<TarjetaActivacionConfirmationData | null>(
    () => {
      if (typeof window === "undefined") return null;

      const productStr = sessionStorage.getItem("tarjetaActivacionProduct");
      const formStr = sessionStorage.getItem("tarjetaActivacionForm");
      if (!productStr || !formStr) return null;

      try {
        const product: TarjetaCreditoProduct = JSON.parse(productStr);
        const form: TarjetaActivacionFormData = JSON.parse(formStr);
        return {
          cardId: product.id,
          cardDisplay: `${product.title} (**** ${product.last4})`,
          fechaEmision: form.fechaVencimiento,
        };
      } catch {
        return null;
      }
    },
  );

  const handleBack = () => {
    if (!confirmationData) return;
    router.push(
      `/tarjeta/bloqueo-activacion/activar?cardId=${confirmationData.cardId}`,
    );
  };

  const handleConfirm = async () => {
    if (!confirmationData) return;
    setIsLoading(true);
    try {
      sessionStorage.setItem(
        "tarjetaActivacionConfirmation",
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

      router.push("/tarjeta/bloqueo-activacion/activar/codigo-sms");
    } catch (err) {
      console.error("Error sending OTP:", err);
      setIsLoading(false);
    }
  };

  return (
    <ConfirmationPageShell
      breadcrumbs={BREADCRUMBS}
      welcomeBarTitle="Bloqueo y Activación"
      welcomeBarBackHref="/tarjeta/bloqueo-activacion/activar"
      fallbackPath="/tarjeta/bloqueo-activacion"
      steps={TARJETA_ACTIVACION_STEPS}
      hasData={!!confirmationData}
      isSubmitting={isLoading}
      confirmLabel="Activar Tarjeta"
      submittingLabel="Procesando..."
      volverColorClass="text-brand-navy"
      breadcrumbsWrapped={false}
      noDataFallback={null}
      onBack={handleBack}
      onConfirm={handleConfirm}
    >
      {confirmationData && (
        <TarjetaActivacionConfirmationCard
          confirmationData={confirmationData}
        />
      )}
    </ConfirmationPageShell>
  );
}
