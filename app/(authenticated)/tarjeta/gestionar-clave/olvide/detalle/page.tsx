"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { TarjetaClaveOlvideDetailsCard } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import { TarjetaClaveOlvideFormData } from "@/src/schemas/tarjetaClaveOlvideSchema";
import { TARJETA_CLAVE_STEPS, mockTarjetaCreditoProducts } from "@/src/mocks";

const BREADCRUMBS = ["Inicio", "Gestionar Clave", "Olvidé mi Clave"];
const FORM_ID = "tarjeta-clave-olvide-detalle-form";

function OlvideDetalleContent() {
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
      title: "Olvidé mi Clave",
      backHref: "/tarjeta/gestionar-clave/olvide",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    if (!product || product.claveEstado !== "asignada") {
      router.push("/tarjeta/gestionar-clave/olvide");
    }
  }, [product, router]);

  if (!product || product.claveEstado !== "asignada") {
    return null;
  }

  const handleBack = () => {
    router.push("/tarjeta/gestionar-clave/olvide");
  };

  const handleSubmit = (data: TarjetaClaveOlvideFormData) => {
    sessionStorage.setItem("tarjetaClaveOlvideCardId", product.id);
    sessionStorage.setItem(
      "tarjetaClaveOlvideProduct",
      JSON.stringify(product),
    );
    sessionStorage.setItem("tarjetaClaveOlvideForm", JSON.stringify(data));
    router.push("/tarjeta/gestionar-clave/olvide/confirmacion");
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={BREADCRUMBS} />

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={1} steps={TARJETA_CLAVE_STEPS} />
      </div>

      <TarjetaClaveOlvideDetailsCard
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

export default function OlvideDetallePage() {
  return (
    <Suspense fallback={null}>
      <OlvideDetalleContent />
    </Suspense>
  );
}
