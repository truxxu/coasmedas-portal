"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ConfirmationPageShell,
  TarjetaClaveConfirmationCard,
} from "@/src/organisms";
import { useUserContext } from "@/src/contexts";
import { TarjetaClaveConfirmationData } from "@/src/types/tarjeta-clave";
import { TarjetaCreditoProduct } from "@/src/types/tarjetaCredito";
import { TARJETA_CLAVE_STEPS } from "@/src/mocks";
import { sendTransactionOtp } from "@/services/auth.service";

const BREADCRUMBS = ["Inicio", "Gestionar Clave", "Olvidé mi Clave"];

export default function OlvideConfirmacionPage() {
  const router = useRouter();
  const { user } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);

  const [confirmationData] = useState<TarjetaClaveConfirmationData | null>(
    () => {
      if (typeof window === "undefined") return null;

      const productStr = sessionStorage.getItem("tarjetaClaveOlvideProduct");
      const formStr = sessionStorage.getItem("tarjetaClaveOlvideForm");
      if (!productStr || !formStr) return null;

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
      `/tarjeta/gestionar-clave/olvide/detalle?cardId=${confirmationData.cardId}`,
    );
  };

  const handleConfirm = async () => {
    if (!confirmationData) return;
    setIsLoading(true);
    try {
      sessionStorage.setItem(
        "tarjetaClaveOlvideConfirmation",
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

      router.push("/tarjeta/gestionar-clave/olvide/codigo-sms");
    } catch (err) {
      console.error("Error sending OTP:", err);
      setIsLoading(false);
    }
  };

  return (
    <ConfirmationPageShell
      breadcrumbs={BREADCRUMBS}
      welcomeBarTitle="Olvidé mi Clave"
      welcomeBarBackHref="/tarjeta/gestionar-clave/olvide/detalle"
      fallbackPath="/tarjeta/gestionar-clave/olvide"
      steps={TARJETA_CLAVE_STEPS}
      hasData={!!confirmationData}
      isSubmitting={isLoading}
      confirmLabel="Confirmar Clave"
      submittingLabel="Procesando..."
      volverColorClass="text-brand-navy"
      breadcrumbsWrapped={false}
      noDataFallback={null}
      onBack={handleBack}
      onConfirm={handleConfirm}
    >
      <TarjetaClaveConfirmationCard mode="olvide" />
    </ConfirmationPageShell>
  );
}
