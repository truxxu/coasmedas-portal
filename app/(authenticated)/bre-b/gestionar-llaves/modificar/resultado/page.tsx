"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { BrebKeyModificationResultCard } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import { BREB_KEY_MODIFICATION_STEPS } from "@/src/mocks";
import type { BrebKeyModificationResult } from "@/src/types/brebKeyModification";

export default function ModificarLlaveResultadoPage() {
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const [result] = useState<BrebKeyModificationResult | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = sessionStorage.getItem("brebKeyModificationResult");
    if (!raw) return null;
    try {
      return JSON.parse(raw) as BrebKeyModificationResult;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    setWelcomeBar({ title: "Modificar Llave" });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    if (!result) {
      router.push("/bre-b/gestionar-llaves");
    }
  }, [result, router]);

  const clearSessionStorage = () => {
    sessionStorage.removeItem("brebKeyModificationForm");
    sessionStorage.removeItem("brebKeyModificationConfirmation");
    sessionStorage.removeItem("brebKeyModificationResult");
  };

  const handleFinish = () => {
    clearSessionStorage();
    router.push("/bre-b/gestionar-llaves");
  };

  if (!result) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="text-brand-gray-medium">Cargando resultado...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumbs items={["Inicio", "Bre-B", "Modificar Llave"]} />
      </div>

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={5} steps={BREB_KEY_MODIFICATION_STEPS} />
      </div>

      <BrebKeyModificationResultCard result={result} />

      <div className="flex justify-end">
        <Button variant="primary" onClick={handleFinish}>
          Finalizar
        </Button>
      </div>
    </div>
  );
}
