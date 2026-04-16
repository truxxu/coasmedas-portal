"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { TarjetaAvanceResultCard } from "@/src/organisms";
import { useUIContext, useWelcomeBar } from "@/src/contexts";
import { TarjetaAvanceResult } from "@/src/types/tarjeta-avance";
import { TARJETA_AVANCE_STEPS } from "@/src/mocks";

const BREADCRUMBS = ["Inicio", "Tarjeta de Crédito", "Realizar Avance"];

const SESSION_KEYS = [
  "tarjetaAvanceCardId",
  "tarjetaAvanceProduct",
  "tarjetaAvanceValor",
  "tarjetaAvanceCuotas",
  "tarjetaAvanceDestinationId",
  "tarjetaAvanceDestinationDisplay",
  "tarjetaAvanceConfirmation",
  "tarjetaAvanceResult",
];

export default function AvanceResultadoPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const [result] = useState<TarjetaAvanceResult | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = sessionStorage.getItem("tarjetaAvanceResult");
    if (!stored) return null;
    try {
      return JSON.parse(stored) as TarjetaAvanceResult;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    setWelcomeBar({ title: "Realizar Avance", backHref: "/tarjeta" });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    if (!result) {
      router.push("/tarjeta/avance");
    }
  }, [result, router]);

  if (!result) {
    return null;
  }

  const handleFinish = () => {
    SESSION_KEYS.forEach((key) => sessionStorage.removeItem(key));
    router.push("/tarjeta");
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={BREADCRUMBS} />

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={4} steps={TARJETA_AVANCE_STEPS} />
      </div>

      <TarjetaAvanceResultCard result={result} hideBalances={hideBalances} />

      <div className="flex justify-end">
        <Button variant="primary" onClick={handleFinish}>
          Finalizar
        </Button>
      </div>
    </div>
  );
}
