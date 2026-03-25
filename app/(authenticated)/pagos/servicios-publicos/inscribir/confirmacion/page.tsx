"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs } from "@/src/molecules";
import { UtilityConfirmationCard } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import { mockRegistrationResultSuccess } from "@/src/mocks";
import type {
  UtilityRegistrationForm,
  UtilityConfirmationData,
  UtilityRegistrationResult,
} from "@/src/types";

const FORM_STORAGE_KEY = "utilityRegistrationData";
const RESULT_STORAGE_KEY = "utilityRegistrationResult";

export default function ConfirmacionPage() {
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const [formData] = useState<UtilityRegistrationForm | null>(() => {
    if (typeof window === 'undefined') return null;
    const storedData = sessionStorage.getItem(FORM_STORAGE_KEY);
    if (!storedData) return null;
    try {
      return JSON.parse(storedData) as UtilityRegistrationForm;
    } catch {
      return null;
    }
  });

  const [confirmationData] =
    useState<UtilityConfirmationData | null>(() => {
      if (!formData) return null;
      return {
        category: formData.categoryName,
        convenio: formData.convenioName,
        billNumber: formData.billNumber,
        alias: formData.alias,
      };
    });

  const [isLoading, setIsLoading] = useState(false);

  // Configure WelcomeBar on mount, clear on unmount
  useEffect(() => {
    setWelcomeBar({
      title: "Pago de servicios públicos",
      backHref: "/pagos/servicios-publicos/inscribir",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  // Redirect if data is missing
  useEffect(() => {
    if (!confirmationData) {
      router.replace("/pagos/servicios-publicos/inscribir");
    }
  }, [confirmationData, router]);

  // Handle confirmation
  const handleConfirm = async () => {
    if (!formData || !confirmationData) return;

    setIsLoading(true);

    // Simulate API call with 1.5s delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Create result using mock data with actual form values
    const result: UtilityRegistrationResult = {
      ...mockRegistrationResultSuccess,
      alias: confirmationData.alias,
      convenio: confirmationData.convenio,
      category: confirmationData.category,
      billNumber: confirmationData.billNumber,
    };

    // Store result in sessionStorage
    sessionStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(result));

    // Navigate to result page
    router.push("/pagos/servicios-publicos/inscribir/resultado");
  };

  // Handle back navigation
  const handleBack = () => {
    router.push("/pagos/servicios-publicos/inscribir");
  };

  // Show nothing while loading data
  if (!confirmationData) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={["Inicio", "Pagos", "Inscribir Servicios Públicos"]}
      />

      {/* Confirmation Card */}
      <UtilityConfirmationCard confirmationData={confirmationData} />

      {/* Footer Actions */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          disabled={isLoading}
          className="text-sm font-medium text-brand-teal-dark hover:underline disabled:opacity-50"
        >
          Volver
        </button>
        <Button variant="primary" onClick={handleConfirm} disabled={isLoading}>
          {isLoading ? "Confirmando..." : "Confirmar Inscripción"}
        </Button>
      </div>
    </div>
  );
}
