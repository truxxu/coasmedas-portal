"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { TarjetaActivacionResultCard } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import { TarjetaActivacionResult } from "@/src/types/tarjeta-activacion";
import { TARJETA_ACTIVACION_STEPS } from "@/src/mocks";

const BREADCRUMBS = ["Inicio", "Tarjeta de Crédito", "Bloqueo y Activación"];

const SESSION_KEYS = [
  "tarjetaActivacionCardId",
  "tarjetaActivacionProduct",
  "tarjetaActivacionForm",
  "tarjetaActivacionConfirmation",
  "tarjetaActivacionResult",
];

export default function ActivarResultadoPage() {
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const [result] = useState<TarjetaActivacionResult | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = sessionStorage.getItem("tarjetaActivacionResult");
    if (!stored) return null;
    try {
      return JSON.parse(stored) as TarjetaActivacionResult;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    setWelcomeBar({ title: "Bloqueo y Activación", backHref: "/tarjeta" });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    if (!result) {
      router.push("/tarjeta/bloqueo-activacion");
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
        <Stepper currentStep={4} steps={TARJETA_ACTIVACION_STEPS} />
      </div>

      <TarjetaActivacionResultCard result={result} />

      <div className="flex justify-end">
        <Button variant="primary" onClick={handleFinish}>
          Finalizar
        </Button>
      </div>
    </div>
  );
}
