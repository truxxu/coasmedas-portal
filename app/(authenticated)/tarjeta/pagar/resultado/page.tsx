"use client";

import React, { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { TarjetaPaymentResultCard } from "@/src/organisms";
import { useUIContext, useWelcomeBar } from "@/src/contexts";
import { TarjetaPaymentResult } from "@/src/types/tarjeta-payment";
import { TARJETA_PAYMENT_STEPS } from "@/src/mocks";

const BREADCRUMBS = ["Inicio", "Tarjeta de Crédito", "Pagar Tarjeta"];

const SESSION_KEYS = [
  "tarjetaPaymentCardId",
  "tarjetaPaymentProduct",
  "tarjetaPaymentValor",
  "tarjetaSourceAccountId",
  "tarjetaSourceAccountDisplay",
  "tarjetaPaymentConfirmation",
  "tarjetaPaymentResult",
];

export default function PagarTarjetaResultadoPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const result = useMemo<TarjetaPaymentResult | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = sessionStorage.getItem("tarjetaPaymentResult");
    if (!stored) return null;
    try {
      return JSON.parse(stored) as TarjetaPaymentResult;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    setWelcomeBar({ title: "Pagar Tarjeta", backHref: "/tarjeta" });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    if (!result) {
      router.push("/tarjeta/pagar");
    }
  }, [result, router]);

  if (!result) {
    return null;
  }

  const handlePrintSave = () => {
    window.print();
  };

  const handleFinish = () => {
    SESSION_KEYS.forEach((key) => sessionStorage.removeItem(key));
    router.push("/tarjeta");
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={BREADCRUMBS} />

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={4} steps={TARJETA_PAYMENT_STEPS} />
      </div>

      <TarjetaPaymentResultCard result={result} hideBalances={hideBalances} />

      <div className="flex justify-end gap-4">
        <Button variant="secondary" onClick={handlePrintSave}>
          Imprimir/Guardar
        </Button>
        <Button variant="primary" onClick={handleFinish}>
          Finalizar
        </Button>
      </div>
    </div>
  );
}
