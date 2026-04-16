"use client";

import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/src/molecules";
import { TarjetaClaveCardList } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import { TarjetaCreditoProduct } from "@/src/types/tarjetaCredito";
import { mockTarjetaCreditoProducts } from "@/src/mocks";

const BREADCRUMBS = ["Inicio", "Gestionar Clave", "Asignar Clave"];

export default function AsignarCardListPage() {
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  useEffect(() => {
    setWelcomeBar({
      title: "Asignar Clave",
      backHref: "/tarjeta/gestionar-clave",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const availableCards = useMemo(
    () =>
      mockTarjetaCreditoProducts.filter(
        (product) => product.claveEstado === "no_asignada",
      ),
    [],
  );

  const handleSelect = (product: TarjetaCreditoProduct) => {
    router.push(
      `/tarjeta/gestionar-clave/asignar/detalle?cardId=${product.id}`,
    );
  };

  const handleBack = () => {
    router.push("/tarjeta/gestionar-clave");
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={BREADCRUMBS} />

      <TarjetaClaveCardList
        title="Asignación de Clave"
        description="Selecciona la tarjeta a la cual deseas asignarle una clave por primera vez."
        products={availableCards}
        badgeLabel="Clave no asignada"
        badgeVariant="warning"
        emptyMessage="Todas tus tarjetas ya tienen clave asignada."
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
