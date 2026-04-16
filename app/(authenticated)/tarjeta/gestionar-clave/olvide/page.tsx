"use client";

import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/src/molecules";
import { TarjetaClaveCardList } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import { TarjetaCreditoProduct } from "@/src/types/tarjetaCredito";
import { mockTarjetaCreditoProducts } from "@/src/mocks";

const BREADCRUMBS = ["Inicio", "Gestionar Clave", "Olvidé mi Clave"];

export default function OlvideCardListPage() {
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  useEffect(() => {
    setWelcomeBar({
      title: "Olvidé mi Clave",
      backHref: "/tarjeta/gestionar-clave",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const availableCards = useMemo(
    () =>
      mockTarjetaCreditoProducts.filter(
        (product) => product.claveEstado === "asignada",
      ),
    [],
  );

  const handleSelect = (product: TarjetaCreditoProduct) => {
    router.push(`/tarjeta/gestionar-clave/olvide/detalle?cardId=${product.id}`);
  };

  const handleBack = () => {
    router.push("/tarjeta/gestionar-clave");
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={BREADCRUMBS} />

      <TarjetaClaveCardList
        title="Recuperación de Clave"
        description="Selecciona la tarjeta para la cual olvidaste la clave."
        products={availableCards}
        badgeLabel="Activa"
        badgeVariant="success"
        emptyMessage="No tienes tarjetas con clave asignada disponibles para recuperación."
        onSelect={handleSelect}
      />

      <div className="flex justify-start">
        <button
          onClick={handleBack}
          className="text-sm font-medium text-brand-navy hover:underline"
        >
          Volver
        </button>
      </div>
    </div>
  );
}
