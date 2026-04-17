"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ConfirmationPageShell,
  UtilityConfirmationCard,
} from "@/src/organisms";
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

  const [formData] = useState<UtilityRegistrationForm | null>(() => {
    if (typeof window === "undefined") return null;
    const storedData = sessionStorage.getItem(FORM_STORAGE_KEY);
    if (!storedData) return null;
    try {
      return JSON.parse(storedData) as UtilityRegistrationForm;
    } catch {
      return null;
    }
  });

  const [confirmationData] = useState<UtilityConfirmationData | null>(() => {
    if (!formData) return null;
    return {
      category: formData.categoryName,
      convenio: formData.convenioName,
      billNumber: formData.billNumber,
      alias: formData.alias,
    };
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (!formData || !confirmationData) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const result: UtilityRegistrationResult = {
      ...mockRegistrationResultSuccess,
      alias: confirmationData.alias,
      convenio: confirmationData.convenio,
      category: confirmationData.category,
      billNumber: confirmationData.billNumber,
    };

    sessionStorage.setItem(RESULT_STORAGE_KEY, JSON.stringify(result));
    router.push("/pagos/servicios-publicos/inscribir/resultado");
  };

  return (
    <ConfirmationPageShell
      breadcrumbs={["Inicio", "Pagos", "Inscribir Servicios Públicos"]}
      welcomeBarTitle="Pago de servicios públicos"
      welcomeBarBackHref="/pagos/servicios-publicos/inscribir"
      fallbackPath="/pagos/servicios-publicos/inscribir"
      showStepper={false}
      hasData={!!confirmationData}
      isSubmitting={isLoading}
      confirmLabel="Confirmar Inscripción"
      submittingLabel="Confirmando..."
      breadcrumbsWrapped={false}
      noDataFallback={null}
      onBack={() => router.push("/pagos/servicios-publicos/inscribir")}
      onConfirm={handleConfirm}
    >
      {confirmationData && (
        <UtilityConfirmationCard confirmationData={confirmationData} />
      )}
    </ConfirmationPageShell>
  );
}
