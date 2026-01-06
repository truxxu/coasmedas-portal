"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/src/molecules";
import { UtilityRegistrationForm } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import { mockCities, mockConvenios } from "@/src/mocks";
import type {
  UtilityRegistrationForm as FormData,
  UtilityRegistrationErrors,
} from "@/src/types";

const STORAGE_KEY = "utilityRegistrationData";

const initialFormData: FormData = {
  cityId: "",
  cityName: "",
  convenioId: "",
  convenioName: "",
  billNumber: "",
  alias: "",
};

export default function InscribirServiciosPage() {
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<UtilityRegistrationErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // Configure WelcomeBar on mount, clear on unmount
  useEffect(() => {
    setWelcomeBar({
      title: "Pago de Servicios Publicos",
      backHref: "/pagos/servicios-publicos",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  // Filter convenios based on selected city
  const filteredConvenios = useMemo(() => {
    if (!formData.cityId) return [];
    return mockConvenios.filter((c) => c.cityId === formData.cityId);
  }, [formData.cityId]);

  // Handle city change - reset convenio when city changes
  const handleCityChange = useCallback((cityId: string, cityName: string) => {
    setFormData((prev) => ({
      ...prev,
      cityId,
      cityName,
      convenioId: "",
      convenioName: "",
    }));
    setErrors((prev) => ({ ...prev, cityId: undefined, convenioId: undefined }));
  }, []);

  // Handle convenio change
  const handleConvenioChange = useCallback(
    (convenioId: string, convenioName: string) => {
      setFormData((prev) => ({
        ...prev,
        convenioId,
        convenioName,
      }));
      setErrors((prev) => ({ ...prev, convenioId: undefined }));
    },
    []
  );

  // Handle bill number change
  const handleBillNumberChange = useCallback((value: string) => {
    setFormData((prev) => ({
      ...prev,
      billNumber: value,
    }));
    setErrors((prev) => ({ ...prev, billNumber: undefined }));
  }, []);

  // Handle alias change
  const handleAliasChange = useCallback((value: string) => {
    setFormData((prev) => ({
      ...prev,
      alias: value,
    }));
    setErrors((prev) => ({ ...prev, alias: undefined }));
  }, []);

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: UtilityRegistrationErrors = {};

    if (!formData.cityId) {
      newErrors.cityId = "Selecciona una ciudad";
    }

    if (!formData.convenioId) {
      newErrors.convenioId = "Selecciona un convenio";
    }

    if (!formData.billNumber.trim()) {
      newErrors.billNumber = "Ingresa el numero de factura";
    }

    if (!formData.alias.trim()) {
      newErrors.alias = "Ingresa un alias";
    } else if (formData.alias.length > 50) {
      newErrors.alias = "El alias no puede tener mas de 50 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!validateForm()) return;

    setIsLoading(true);

    // Store form data in sessionStorage
    const dataToStore = {
      ...formData,
      billNumber: formData.billNumber.trim(),
      alias: formData.alias.trim(),
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(dataToStore));

    // Navigate to confirmation page
    router.push("/pagos/servicios-publicos/inscribir/confirmacion");
  };

  // Handle back navigation
  const handleBack = () => {
    router.push("/pagos/servicios-publicos");
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <Breadcrumbs items={["Inicio", "Pagos", "Inscribir Servicios Publicos"]} />

      {/* Registration Form */}
      <UtilityRegistrationForm
        cities={mockCities}
        convenios={filteredConvenios}
        formData={formData}
        errors={errors}
        isLoading={isLoading}
        onCityChange={handleCityChange}
        onConvenioChange={handleConvenioChange}
        onBillNumberChange={handleBillNumberChange}
        onAliasChange={handleAliasChange}
        onSubmit={handleSubmit}
        onBack={handleBack}
      />
    </div>
  );
}
