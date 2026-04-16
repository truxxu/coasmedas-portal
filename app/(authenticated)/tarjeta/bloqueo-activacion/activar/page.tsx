"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { TarjetaActivacionDetailsCard } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import { TarjetaActivacionFormData } from "@/src/schemas/tarjetaActivacionSchema";
import {
  TARJETA_ACTIVACION_STEPS,
  mockTarjetaCreditoProducts,
} from "@/src/mocks";

const BREADCRUMBS = ["Inicio", "Tarjeta de Crédito", "Bloqueo y Activación"];
const FORM_ID = "tarjeta-activacion-detalle-form";

function ActivarDetalleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const cardId = searchParams.get("cardId") ?? "";
  const product = useMemo(
    () => mockTarjetaCreditoProducts.find((p) => p.id === cardId) ?? null,
    [cardId],
  );

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    setWelcomeBar({
      title: "Bloqueo y Activación",
      backHref: "/tarjeta/bloqueo-activacion",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    if (!product || product.status !== "pendiente_activacion") {
      router.push("/tarjeta/bloqueo-activacion");
    }
  }, [product, router]);

  if (!product || product.status !== "pendiente_activacion") {
    return null;
  }

  const handleBack = () => {
    router.push("/tarjeta/bloqueo-activacion");
  };

  const handleSubmit = (data: TarjetaActivacionFormData) => {
    sessionStorage.setItem("tarjetaActivacionCardId", product.id);
    sessionStorage.setItem("tarjetaActivacionProduct", JSON.stringify(product));
    sessionStorage.setItem("tarjetaActivacionForm", JSON.stringify(data));
    router.push("/tarjeta/bloqueo-activacion/activar/confirmacion");
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={BREADCRUMBS} />

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={1} steps={TARJETA_ACTIVACION_STEPS} />
      </div>

      <TarjetaActivacionDetailsCard
        product={product}
        formId={FORM_ID}
        onSubmit={handleSubmit}
        onValidityChange={setIsFormValid}
      />

      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          className="text-sm font-medium text-brand-navy hover:underline"
        >
          Volver
        </button>
        <Button
          variant="primary"
          type="submit"
          form={FORM_ID}
          disabled={!isFormValid}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
}

export default function ActivarDetallePage() {
  return (
    <Suspense fallback={null}>
      <ActivarDetalleContent />
    </Suspense>
  );
}
