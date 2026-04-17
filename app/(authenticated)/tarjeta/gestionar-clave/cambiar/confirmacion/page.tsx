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

const BREADCRUMBS = ["Inicio", "Gestionar Clave", "Cambiar Clave"];

export default function CambiarConfirmacionPage() {
  const router = useRouter();
  const { user } = useUserContext();
  const [isLoading, setIsLoading] = useState(false);

  const [confirmationData] = useState<TarjetaClaveConfirmationData | null>(
    () => {
      if (typeof window === "undefined") return null;

      const productStr = sessionStorage.getItem("tarjetaClaveCambiarProduct");
      const formStr = sessionStorage.getItem("tarjetaClaveCambiarForm");
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
      `/tarjeta/gestionar-clave/cambiar/detalle?cardId=${confirmationData.cardId}`,
    );
  };

  const handleConfirm = async () => {
    if (!confirmationData) return;
    setIsLoading(true);
    try {
      sessionStorage.setItem(
        "tarjetaClaveCambiarConfirmation",
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

      router.push("/tarjeta/gestionar-clave/cambiar/codigo-sms");
    } catch (err) {
      console.error("Error sending OTP:", err);
      setIsLoading(false);
    }
  };

  return (
    <ConfirmationPageShell
      breadcrumbs={BREADCRUMBS}
      welcomeBarTitle="Cambiar Clave"
      welcomeBarBackHref="/tarjeta/gestionar-clave/cambiar/detalle"
      fallbackPath="/tarjeta/gestionar-clave/cambiar"
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
      <TarjetaClaveConfirmationCard mode="cambiar" />
    </ConfirmationPageShell>
  );
}
