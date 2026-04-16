"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { TarjetaActivacionConfirmationCard } from "@/src/organisms";
import { useUserContext, useWelcomeBar } from "@/src/contexts";
import { TarjetaActivacionConfirmationData } from "@/src/types/tarjeta-activacion";
import { TarjetaCreditoProduct } from "@/src/types/tarjetaCredito";
import { TarjetaActivacionFormData } from "@/src/schemas/tarjetaActivacionSchema";
import { TARJETA_ACTIVACION_STEPS } from "@/src/mocks";
import { sendTransactionOtp } from "@/services/auth.service";

const BREADCRUMBS = ["Inicio", "Tarjeta de Crédito", "Bloqueo y Activación"];

export default function ActivarConfirmacionPage() {
  const router = useRouter();
  const { user } = useUserContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

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

  useEffect(() => {
    setWelcomeBar({
      title: "Bloqueo y Activación",
      backHref: "/tarjeta/bloqueo-activacion/activar",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    if (!confirmationData) {
      router.push("/tarjeta/bloqueo-activacion");
    }
  }, [confirmationData, router]);

  if (!confirmationData) {
    return null;
  }

  const handleBack = () => {
    router.push(
      `/tarjeta/bloqueo-activacion/activar?cardId=${confirmationData.cardId}`,
    );
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      sessionStorage.setItem(
        "tarjetaActivacionConfirmation",
        JSON.stringify(confirmationData),
      );

      const { documentType, documentNumber } = user ?? {};
      if (documentType && documentNumber) {
        // TODO: swap trnType to card-activation-specific value when backend exposes it.
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
    <div className="space-y-6">
      <Breadcrumbs items={BREADCRUMBS} />

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={2} steps={TARJETA_ACTIVACION_STEPS} />
      </div>

      <TarjetaActivacionConfirmationCard confirmationData={confirmationData} />

      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          disabled={isLoading}
          className="text-sm font-medium text-brand-navy hover:underline disabled:opacity-50"
        >
          Volver
        </button>
        <Button variant="primary" onClick={handleConfirm} disabled={isLoading}>
          {isLoading ? "Procesando..." : "Activar Tarjeta"}
        </Button>
      </div>
    </div>
  );
}
