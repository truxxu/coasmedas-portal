"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { TarjetaClaveAsignarConfirmationCard } from "@/src/organisms";
import { useUserContext, useWelcomeBar } from "@/src/contexts";
import { TarjetaClaveAsignarConfirmationData } from "@/src/types/tarjeta-clave";
import { TarjetaCreditoProduct } from "@/src/types/tarjetaCredito";
import { TARJETA_CLAVE_STEPS } from "@/src/mocks";
import { sendTransactionOtp } from "@/services/auth.service";

const BREADCRUMBS = ["Inicio", "Gestionar Clave", "Asignar Clave"];

export default function AsignarConfirmacionPage() {
  const router = useRouter();
  const { user } = useUserContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const [isLoading, setIsLoading] = useState(false);

  const [confirmationData] =
    useState<TarjetaClaveAsignarConfirmationData | null>(() => {
      if (typeof window === "undefined") return null;

      const productStr = sessionStorage.getItem("tarjetaClaveAsignarProduct");
      const formStr = sessionStorage.getItem("tarjetaClaveAsignarForm");
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
    });

  useEffect(() => {
    setWelcomeBar({
      title: "Asignar Clave",
      backHref: "/tarjeta/gestionar-clave/asignar/detalle",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    if (!confirmationData) {
      router.push("/tarjeta/gestionar-clave/asignar");
    }
  }, [confirmationData, router]);

  if (!confirmationData) {
    return null;
  }

  const handleBack = () => {
    router.push(
      `/tarjeta/gestionar-clave/asignar/detalle?cardId=${confirmationData.cardId}`,
    );
  };

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      sessionStorage.setItem(
        "tarjetaClaveAsignarConfirmation",
        JSON.stringify(confirmationData),
      );

      const { documentType, documentNumber } = user ?? {};
      if (documentType && documentNumber) {
        // TODO: swap trnType to card-clave-specific value when backend exposes it.
        await sendTransactionOtp({
          documentType,
          documentNumber,
          trnType: "PaymentInternal",
        });
      }

      router.push("/tarjeta/gestionar-clave/asignar/codigo-sms");
    } catch (err) {
      console.error("Error sending OTP:", err);
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={BREADCRUMBS} />

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={2} steps={TARJETA_CLAVE_STEPS} />
      </div>

      <TarjetaClaveAsignarConfirmationCard />

      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          disabled={isLoading}
          className="text-sm font-medium text-brand-navy hover:underline disabled:opacity-50"
        >
          Volver
        </button>
        <Button variant="primary" onClick={handleConfirm} disabled={isLoading}>
          {isLoading ? "Procesando..." : "Asignar Clave"}
        </Button>
      </div>
    </div>
  );
}
