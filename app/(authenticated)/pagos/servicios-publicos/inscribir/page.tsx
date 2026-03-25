"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs } from "@/src/molecules";
import { UtilityRegistrationForm } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import { mockCategories, mockConvenios } from "@/src/mocks";
import type {
  UtilityRegistrationForm as FormData,
  UtilityRegistrationErrors,
} from "@/src/types";

const STORAGE_KEY = "utilityRegistrationData";

const initialFormData: FormData = {
  categoryId: "",
  categoryName: "",
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
      title: "Pago de Servicios Públicos",
      backHref: "/pagos/servicios-publicos",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  // Filter convenios based on selected category
  const filteredConvenios = useMemo(() => {
    if (!formData.categoryId) return [];
    return mockConvenios.filter((c) => c.categoryId === formData.categoryId);
  }, [formData.categoryId]);

  // Handle category change - reset convenio when category changes
  const handleCategoryChange = useCallback((categoryId: string, categoryName: string) => {
    setFormData((prev) => ({
      ...prev,
      categoryId,
      categoryName,
      convenioId: "",
      convenioName: "",
    }));
    setErrors((prev) => ({
      ...prev,
      categoryId: undefined,
      convenioId: undefined,
    }));
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

    if (!formData.categoryId) {
      newErrors.categoryId = "Selecciona una categoría";
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
      <Breadcrumbs
        items={["Inicio", "Pagos", "Inscribir Servicios Públicos"]}
      />

      {/* Registration Form */}
      <UtilityRegistrationForm
        categories={mockCategories}
        convenios={filteredConvenios}
        formData={formData}
        errors={errors}
        onCategoryChange={handleCategoryChange}
        onConvenioChange={handleConvenioChange}
        onBillNumberChange={handleBillNumberChange}
        onAliasChange={handleAliasChange}
      />

      {/* Footer Actions */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={handleBack}
          className="text-sm font-medium text-brand-teal-dark hover:underline"
        >
          Volver
        </button>
        <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Inscribiendo..." : "Inscribir"}
        </Button>
      </div>
    </div>
  );
}
