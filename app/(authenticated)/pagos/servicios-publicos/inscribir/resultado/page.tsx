"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/src/molecules";
import { UtilityRegistrationResultCard } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import type { UtilityRegistrationResult } from "@/src/types";

const FORM_STORAGE_KEY = "utilityRegistrationData";
const RESULT_STORAGE_KEY = "utilityRegistrationResult";

export default function ResultadoPage() {
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const [result, setResult] = useState<UtilityRegistrationResult | null>(null);

  // Configure WelcomeBar on mount, clear on unmount
  useEffect(() => {
    setWelcomeBar({
      title: "Pago de servicios publicos",
      backHref: "/pagos/servicios-publicos",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  // Load result from sessionStorage
  useEffect(() => {
    const storedResult = sessionStorage.getItem(RESULT_STORAGE_KEY);

    if (!storedResult) {
      // Redirect to form if no result data
      router.replace("/pagos/servicios-publicos/inscribir");
      return;
    }

    try {
      const parsed: UtilityRegistrationResult = JSON.parse(storedResult);
      setResult(parsed);
    } catch {
      // Invalid data, redirect to form
      router.replace("/pagos/servicios-publicos/inscribir");
    }
  }, [router]);

  // Cleanup sessionStorage on unmount
  useEffect(() => {
    return () => {
      // Only cleanup when navigating away from result page
      // This is handled in the action handlers instead
    };
  }, []);

  // Clear storage helper
  const clearStorage = () => {
    sessionStorage.removeItem(FORM_STORAGE_KEY);
    sessionStorage.removeItem(RESULT_STORAGE_KEY);
  };

  // Handle register another service
  const handleRegisterAnother = () => {
    clearStorage();
    router.push("/pagos/servicios-publicos/inscribir");
  };

  // Handle go to payments
  const handleGoToPayments = () => {
    clearStorage();
    router.push("/pagos/servicios-publicos");
  };

  // Show nothing while loading data
  if (!result) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={["Inicio", "Pagos", "Inscribir Servicios Publicos"]}
      />

      {/* Result Card */}
      <UtilityRegistrationResultCard
        result={result}
        onRegisterAnother={handleRegisterAnother}
        onGoToPayments={handleGoToPayments}
      />
    </div>
  );
}
