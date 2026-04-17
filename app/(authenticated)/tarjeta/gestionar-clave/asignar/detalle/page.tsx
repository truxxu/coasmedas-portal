"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { TarjetaClaveDetailsCard } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import { TarjetaClaveAsignarFormData } from "@/src/schemas/tarjetaClaveAsignarSchema";
import { TARJETA_CLAVE_STEPS, mockTarjetaCreditoProducts } from "@/src/mocks";

const BREADCRUMBS = ["Inicio", "Gestionar Clave", "Asignar Clave"];
const FORM_ID = "tarjeta-clave-asignar-detalle-form";

function AsignarDetalleContent() {
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
      title: "Asignar Clave",
      backHref: "/tarjeta/gestionar-clave/asignar",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    if (!product || product.claveEstado !== "no_asignada") {
      router.push("/tarjeta/gestionar-clave/asignar");
    }
  }, [product, router]);

  if (!product || product.claveEstado !== "no_asignada") {
    return null;
  }

  const handleBack = () => {
    router.push("/tarjeta/gestionar-clave/asignar");
  };

  const handleSubmit = (data: TarjetaClaveAsignarFormData) => {
    sessionStorage.setItem("tarjetaClaveAsignarCardId", product.id);
    sessionStorage.setItem(
      "tarjetaClaveAsignarProduct",
      JSON.stringify(product),
    );
    sessionStorage.setItem("tarjetaClaveAsignarForm", JSON.stringify(data));
    router.push("/tarjeta/gestionar-clave/asignar/confirmacion");
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={BREADCRUMBS} />

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={1} steps={TARJETA_CLAVE_STEPS} />
      </div>

      <TarjetaClaveDetailsCard
        mode="asignar"
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

export default function AsignarDetallePage() {
  return (
    <Suspense fallback={null}>
      <AsignarDetalleContent />
    </Suspense>
  );
}
