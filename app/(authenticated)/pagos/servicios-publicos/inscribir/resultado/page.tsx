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

  // Configure WelcomeBar on mount, clear on unmount
  useEffect(() => {
    setWelcomeBar({
      title: "Pago de servicios públicos",
      backHref: "/pagos/servicios-publicos",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  // Redirect if result data is missing
  useEffect(() => {
    if (!result) {
      router.replace("/pagos/servicios-publicos/inscribir");
    }
  }, [result, router]);

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
        items={["Inicio", "Pagos", "Inscribir Servicios Públicos"]}
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
