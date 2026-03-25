"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { UtilityPaymentDetailsForm } from "@/src/organisms";

import { useWelcomeBar } from "@/src/contexts";
import {
  mockUtilitySourceAccounts,
  mockRegisteredServices,
  UTILITY_PAYMENT_STEPS,
} from "@/src/mocks";
import { mockCategories, mockConvenios } from "@/src/mocks";
import type {
  UtilityPaymentDetails,
  UtilityPaymentMethod,
  UtilityPaymentType,
} from "@/src/types";

const initialFormData: UtilityPaymentDetails = {
  sourceAccountId: "",
  sourceAccountDisplay: "",
  paymentType: "inscrito",
  serviceId: "",
  serviceDisplay: "",
  serviceType: "",
  amount: 0,
  paymentMethod: "account",
  categoryId: "",
  categoryName: "",
  convenioId: "",
  convenioName: "",
  reference: "",
};

type FormErrors = {
  sourceAccount?: string;
  service?: string;
  categoryId?: string;
  convenioId?: string;
  reference?: string;
  amount?: string;
};

export default function PagarServiciosDetallePage() {
  const router = useRouter();

  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const [formData, setFormData] =
    useState<UtilityPaymentDetails>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // Configure WelcomeBar on mount, clear on unmount
  useEffect(() => {
    setWelcomeBar({
      title: "Pago de Servicios Públicos",
      backHref: "/pagos/servicios-publicos",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  // Filter convenios by selected category
  const filteredConvenios = useMemo(
    () => mockConvenios.filter((c) => c.categoryId === formData.categoryId),
    [formData.categoryId],
  );

  const handleSourceAccountChange = (
    accountId: string,
    paymentMethod: UtilityPaymentMethod,
  ) => {
    const isPSE = paymentMethod === "pse";
    const account = mockUtilitySourceAccounts.find((a) => a.id === accountId);

    setFormData((prev) => ({
      ...prev,
      sourceAccountId: accountId,
      sourceAccountDisplay: isPSE
        ? "PSE (Pagos con otras entidades)"
        : account?.displayName || "",
      paymentMethod,
    }));
    setErrors((prev) => ({ ...prev, sourceAccount: undefined }));
  };

  const handleServiceChange = (serviceId: string) => {
    const service = mockRegisteredServices.find((s) => s.id === serviceId);
    setFormData((prev) => ({
      ...prev,
      serviceId,
      serviceDisplay: service?.displayName || "",
      serviceType: service?.serviceType || "",
      amount: service?.amount || 0,
    }));
    setErrors((prev) => ({ ...prev, service: undefined }));
  };

  const handlePaymentTypeChange = (paymentType: UtilityPaymentType) => {
    setFormData((prev) => ({
      ...prev,
      paymentType,
      // Reset fields when switching
      serviceId: "",
      serviceDisplay: "",
      serviceType: "",
      categoryId: "",
      categoryName: "",
      convenioId: "",
      convenioName: "",
      reference: "",
      amount: 0,
    }));
    setErrors({});
  };

  const handleCategoryChange = (categoryId: string, categoryName: string) => {
    setFormData((prev) => ({
      ...prev,
      categoryId,
      categoryName,
      convenioId: "",
      convenioName: "",
    }));
    setErrors((prev) => ({ ...prev, categoryId: undefined }));
  };

  const handleConvenioChange = (convenioId: string, convenioName: string) => {
    setFormData((prev) => ({
      ...prev,
      convenioId,
      convenioName,
    }));
    setErrors((prev) => ({ ...prev, convenioId: undefined }));
  };

  const handleReferenceChange = (value: string) => {
    setFormData((prev) => ({ ...prev, reference: value }));
    setErrors((prev) => ({ ...prev, reference: undefined }));
  };

  const handleAmountChange = (value: number) => {
    setFormData((prev) => ({ ...prev, amount: value }));
    setErrors((prev) => ({ ...prev, amount: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.sourceAccountId) {
      newErrors.sourceAccount = "Por favor selecciona una cuenta origen";
    }

    if (formData.paymentType === "inscrito") {
      if (!formData.serviceId) {
        newErrors.service = "Por favor selecciona un servicio a pagar";
      }
    } else {
      if (!formData.categoryId) {
        newErrors.categoryId = "Por favor selecciona una categoría";
      }
      if (!formData.convenioId) {
        newErrors.convenioId = "Por favor selecciona un convenio";
      }
      if (!formData.reference?.trim()) {
        newErrors.reference = "Por favor ingresa la referencia";
      }
      if (formData.amount <= 0) {
        newErrors.amount = "Por favor ingresa un valor a pagar";
      }
    }

    // Check if amount exceeds account balance (only for account payments, not PSE)
    if (
      formData.sourceAccountId &&
      formData.amount > 0 &&
      formData.paymentMethod === "account"
    ) {
      const selectedAccount = mockUtilitySourceAccounts.find(
        (a) => a.id === formData.sourceAccountId,
      );
      if (selectedAccount && formData.amount > selectedAccount.balance) {
        newErrors.sourceAccount =
          "Saldo insuficiente en la cuenta seleccionada";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    setIsLoading(true);

    // Store form data in sessionStorage
    sessionStorage.setItem("utilityPaymentDetails", JSON.stringify(formData));

    router.push("/pagos/servicios-publicos/pagar/confirmacion");
  };

  const handleBack = () => {
    router.push("/pagos/servicios-publicos");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Breadcrumbs items={["Inicio", "Pagos", "Pago Servicio Publico"]} />
      </div>

      {/* Stepper */}
      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={1} steps={UTILITY_PAYMENT_STEPS} />
      </div>

      {/* Form */}
      <UtilityPaymentDetailsForm
        sourceAccounts={mockUtilitySourceAccounts}
        registeredServices={mockRegisteredServices}
        formData={formData}
        errors={errors}
        onSourceAccountChange={handleSourceAccountChange}
        onServiceChange={handleServiceChange}
        categories={mockCategories}
        convenios={filteredConvenios}
        onPaymentTypeChange={handlePaymentTypeChange}
        onCategoryChange={handleCategoryChange}
        onConvenioChange={handleConvenioChange}
        onReferenceChange={handleReferenceChange}
        onAmountChange={handleAmountChange}
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
          {isLoading ? "Procesando..." : "Continuar"}
        </Button>
      </div>
    </div>
  );
}
