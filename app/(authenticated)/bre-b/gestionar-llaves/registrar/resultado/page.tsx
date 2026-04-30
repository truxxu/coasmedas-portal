"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { BrebKeyRegistrationResultCard } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import { BREB_KEY_REGISTRATION_STEPS } from "@/src/mocks";
import type { BrebKeyRegistrationResult } from "@/src/types/brebKeyRegistration";

export default function RegistrarLlaveResultadoPage() {
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const [result] = useState<BrebKeyRegistrationResult | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = sessionStorage.getItem("brebKeyRegistrationResult");
    if (!raw) return null;
    try {
      return JSON.parse(raw) as BrebKeyRegistrationResult;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    setWelcomeBar({ title: "Registrar Llave" });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    if (!result) {
      router.push("/bre-b/gestionar-llaves");
    }
  }, [result, router]);

  const clearSessionStorage = () => {
    sessionStorage.removeItem("brebKeyRegistrationForm");
    sessionStorage.removeItem("brebKeyRegistrationConfirmation");
    sessionStorage.removeItem("brebKeyRegistrationResult");
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
        <Breadcrumbs items={["Inicio", "Gestión Llaves", "Registrar Llave"]} />
      </div>

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={5} steps={BREB_KEY_REGISTRATION_STEPS} />
      </div>

      <BrebKeyRegistrationResultCard result={result} />

      <div className="flex justify-end">
        <Button variant="primary" onClick={handleFinish}>
          Finalizar
        </Button>
      </div>
    </div>
  );
}
