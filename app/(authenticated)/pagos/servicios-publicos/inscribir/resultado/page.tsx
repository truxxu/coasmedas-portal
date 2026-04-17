"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ResultPageShell,
  UtilityRegistrationResultCard,
} from "@/src/organisms";
import type { UtilityRegistrationResult } from "@/src/types";

const FORM_STORAGE_KEY = "utilityRegistrationData";
const RESULT_STORAGE_KEY = "utilityRegistrationResult";
const SESSION_KEYS = [FORM_STORAGE_KEY, RESULT_STORAGE_KEY];

export default function ResultadoPage() {
  const router = useRouter();

  const [result] = useState<UtilityRegistrationResult | null>(() => {
    if (typeof window === "undefined") return null;
    const storedResult = sessionStorage.getItem(RESULT_STORAGE_KEY);
    if (!storedResult) return null;
    try {
      return JSON.parse(storedResult) as UtilityRegistrationResult;
    } catch {
      return null;
    }
  });

  const clearStorage = () => {
    sessionStorage.removeItem(FORM_STORAGE_KEY);
    sessionStorage.removeItem(RESULT_STORAGE_KEY);
  };

  const handleRegisterAnother = () => {
    clearStorage();
    router.push("/pagos/servicios-publicos/inscribir");
  };

  const handleGoToPayments = () => {
    clearStorage();
    router.push("/pagos/servicios-publicos");
  };

  return (
    <ResultPageShell
      breadcrumbs={["Inicio", "Pagos", "Inscribir Servicios Públicos"]}
      welcomeBarTitle="Pago de servicios públicos"
      welcomeBarBackHref="/pagos/servicios-publicos"
      startFlowPath="/pagos/servicios-publicos/inscribir"
      sessionKeysToClean={SESSION_KEYS}
      showStepper={false}
      hasResult={!!result}
      hideActions
    >
      {result && (
        <UtilityRegistrationResultCard
          result={result}
          onRegisterAnother={handleRegisterAnother}
          onGoToPayments={handleGoToPayments}
        />
      )}
    </ResultPageShell>
  );
}
