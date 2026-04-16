"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/src/molecules";
import { CardBlockActivateList } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import { TarjetaCreditoProduct } from "@/src/types/tarjetaCredito";
import { mockTarjetaCreditoProducts } from "@/src/mocks";

const BREADCRUMBS = ["Inicio", "Tarjeta de Crédito", "Bloqueo y Activación"];

export default function BloqueoActivacionListPage() {
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  useEffect(() => {
    setWelcomeBar({ title: "Bloqueo y Activación", backHref: "/tarjeta" });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const handleBlock = (product: TarjetaCreditoProduct) => {
    router.push(`/tarjeta/bloqueo-activacion/bloquear?cardId=${product.id}`);
  };

  const handleActivate = () => {
    // TODO: wire activación flow when available.
  };

  const handleBack = () => {
    router.push("/tarjeta");
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={BREADCRUMBS} />

      <CardBlockActivateList
        products={mockTarjetaCreditoProducts}
        onBlock={handleBlock}
        onActivate={handleActivate}
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
