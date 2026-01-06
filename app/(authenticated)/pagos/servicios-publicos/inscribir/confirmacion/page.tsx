"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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

  const [confirmationData, setConfirmationData] =
    useState<UtilityConfirmationData | null>(null);
  const [formData, setFormData] = useState<UtilityRegistrationForm | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Configure WelcomeBar on mount, clear on unmount
  useEffect(() => {
    setWelcomeBar({
      title: "Pago de servicios publicos",
      backHref: "/pagos/servicios-publicos/inscribir",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  // Load form data from sessionStorage
  useEffect(() => {
    const storedData = sessionStorage.getItem(FORM_STORAGE_KEY);

    if (!storedData) {
      // Redirect to form if no data
      router.replace("/pagos/servicios-publicos/inscribir");
      return;
    }

    try {
      const parsed: UtilityRegistrationForm = JSON.parse(storedData);
      setFormData(parsed);

      // Transform to confirmation data
      setConfirmationData({
        city: parsed.cityName,
        convenio: parsed.convenioName,
        billNumber: parsed.billNumber,
        alias: parsed.alias,
      });
    } catch {
      // Invalid data, redirect to form
      router.replace("/pagos/servicios-publicos/inscribir");
    }
  }, [router]);

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
      city: confirmationData.city,
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
      <Breadcrumbs items={["Inicio", "Pagos", "Inscribir Servicios Publicos"]} />

      {/* Confirmation Card */}
      <UtilityConfirmationCard
        confirmationData={confirmationData}
        onConfirm={handleConfirm}
        onBack={handleBack}
        isLoading={isLoading}
      />
    </div>
  );
}
