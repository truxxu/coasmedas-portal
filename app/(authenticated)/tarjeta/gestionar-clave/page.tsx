"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/src/molecules";
import { TarjetaClaveActionsCard } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";

const BREADCRUMBS = ["Inicio", "Tarjeta de Crédito", "Gestionar Clave"];

export default function GestionarClavePage() {
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  useEffect(() => {
    setWelcomeBar({ title: "Gestionar Clave", backHref: "/tarjeta" });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const handleAsignar = () => {
    router.push("/tarjeta/gestionar-clave/asignar");
  };

  const handleCambiar = () => {
    router.push("/tarjeta/gestionar-clave/cambiar");
  };

  const handleOlvide = () => {
    router.push("/tarjeta/gestionar-clave/olvide");
  };

  const handleBack = () => {
    router.push("/tarjeta");
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={BREADCRUMBS} />

      <TarjetaClaveActionsCard
        onAsignar={handleAsignar}
        onCambiar={handleCambiar}
        onOlvide={handleOlvide}
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
