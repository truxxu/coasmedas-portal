"use client";

import React, { Suspense, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { TarjetaBloqueoDetailsCard } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import { TARJETA_BLOQUEO_STEPS, mockTarjetaCreditoProducts } from "@/src/mocks";

const BREADCRUMBS = ["Inicio", "Tarjeta de Crédito", "Bloqueo y Activación"];

function BloquearDetalleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const cardId = searchParams.get("cardId") ?? "";
  const product = useMemo(
    () => mockTarjetaCreditoProducts.find((p) => p.id === cardId) ?? null,
    [cardId],
  );

  useEffect(() => {
    setWelcomeBar({
      title: "Bloqueo y Activación",
      backHref: "/tarjeta/bloqueo-activacion",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    if (!product || product.status !== "activa") {
      router.push("/tarjeta/bloqueo-activacion");
    }
  }, [product, router]);

  if (!product || product.status !== "activa") {
    return null;
  }

  const handleBack = () => {
    router.push("/tarjeta/bloqueo-activacion");
  };

  const handleContinue = () => {
    sessionStorage.setItem("tarjetaBloqueoCardId", product.id);
    sessionStorage.setItem("tarjetaBloqueoProduct", JSON.stringify(product));
    router.push("/tarjeta/bloqueo-activacion/bloquear/confirmacion");
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={BREADCRUMBS} />

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={1} steps={TARJETA_BLOQUEO_STEPS} />
      </div>

      <TarjetaBloqueoDetailsCard product={product} />

      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          className="text-sm font-medium text-brand-navy hover:underline"
        >
          Volver
        </button>
        <Button variant="primary" onClick={handleContinue}>
          Continuar
        </Button>
      </div>
    </div>
  );
}

export default function BloquearDetallePage() {
  return (
    <Suspense fallback={null}>
      <BloquearDetalleContent />
    </Suspense>
  );
}
