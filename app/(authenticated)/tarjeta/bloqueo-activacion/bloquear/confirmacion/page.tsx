"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { TarjetaBloqueoConfirmationCard } from "@/src/organisms";
import { useUserContext, useWelcomeBar } from "@/src/contexts";
import { TarjetaBloqueoConfirmationData } from "@/src/types/tarjeta-bloqueo";
import { TarjetaCreditoProduct } from "@/src/types/tarjetaCredito";
import { TARJETA_BLOQUEO_STEPS } from "@/src/mocks";
import { sendTransactionOtp } from "@/services/auth.service";

const BREADCRUMBS = ["Inicio", "Tarjeta de Crédito", "Bloqueo y Activación"];

export default function BloquearConfirmacionPage() {
  const router = useRouter();
  const { user } = useUserContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

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

  useEffect(() => {
    setWelcomeBar({
      title: "Bloqueo y Activación",
      backHref: "/tarjeta/bloqueo-activacion/bloquear",
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
      `/tarjeta/bloqueo-activacion/bloquear?cardId=${confirmationData.cardId}`,
    );
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      sessionStorage.setItem(
        "tarjetaBloqueoConfirmation",
        JSON.stringify(confirmationData),
      );

      const { documentType, documentNumber } = user ?? {};
      if (documentType && documentNumber) {
        // TODO: swap trnType to card-block-specific value when backend exposes it.
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
    <div className="space-y-6">
      <Breadcrumbs items={BREADCRUMBS} />

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={2} steps={TARJETA_BLOQUEO_STEPS} />
      </div>

      <TarjetaBloqueoConfirmationCard confirmationData={confirmationData} />

      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          disabled={isLoading}
          className="text-sm font-medium text-brand-navy hover:underline disabled:opacity-50"
        >
          Volver
        </button>
        <Button variant="primary" onClick={handleConfirm} disabled={isLoading}>
          {isLoading ? "Procesando..." : "Bloqueo Tarjeta"}
        </Button>
      </div>
    </div>
  );
}
