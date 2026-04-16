"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { TarjetaClaveResultCard } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import { TarjetaClaveResult } from "@/src/types/tarjeta-clave";
import { TARJETA_CLAVE_STEPS } from "@/src/mocks";

const BREADCRUMBS = ["Inicio", "Gestionar Clave", "Cambiar Clave"];

const SESSION_KEYS = [
  "tarjetaClaveCambiarCardId",
  "tarjetaClaveCambiarProduct",
  "tarjetaClaveCambiarForm",
  "tarjetaClaveCambiarConfirmation",
  "tarjetaClaveCambiarResult",
];

export default function CambiarResultadoPage() {
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const [result] = useState<TarjetaClaveResult | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = sessionStorage.getItem("tarjetaClaveCambiarResult");
    if (!stored) return null;
    try {
      return JSON.parse(stored) as TarjetaClaveResult;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    setWelcomeBar({ title: "Cambiar Clave", backHref: "/tarjeta" });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    if (!result) {
      router.push("/tarjeta/gestionar-clave/cambiar");
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
        <Stepper currentStep={4} steps={TARJETA_CLAVE_STEPS} />
      </div>

      <TarjetaClaveResultCard mode="cambiar" result={result} />

      <div className="flex justify-end">
        <Button variant="primary" onClick={handleFinish}>
          Finalizar
        </Button>
      </div>
    </div>
  );
}
