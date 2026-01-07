"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BackButton } from "@/src/atoms";
import { Breadcrumbs, Stepper, HideBalancesToggle } from "@/src/molecules";
import { UtilityPaymentDetailsForm } from "@/src/organisms";
import { useUIContext } from "@/src/contexts/UIContext";
import { useWelcomeBar } from "@/src/contexts";
import {
  mockUtilitySourceAccounts,
  mockRegisteredServices,
  UTILITY_PAYMENT_STEPS,
} from "@/src/mocks";
import type { UtilityPaymentDetails, UtilityPaymentMethod } from "@/src/types";

const initialFormData: UtilityPaymentDetails = {
  sourceAccountId: "",
  sourceAccountDisplay: "",
  serviceId: "",
  serviceDisplay: "",
  serviceType: "",
  amount: 0,
  paymentMethod: "account",
};

export default function PagarServiciosDetallePage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const [formData, setFormData] = useState<UtilityPaymentDetails>(initialFormData);
  const [errors, setErrors] = useState<{
    sourceAccount?: string;
    service?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Configure WelcomeBar on mount, clear on unmount
  useEffect(() => {
    setWelcomeBar({
      title: "Pago de Servicios Publicos",
      backHref: "/pagos/servicios-publicos",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const handleSourceAccountChange = (accountId: string, paymentMethod: UtilityPaymentMethod) => {
    const isPSE = paymentMethod === "pse";
    const account = mockUtilitySourceAccounts.find((a) => a.id === accountId);

    setFormData((prev) => ({
      ...prev,
      sourceAccountId: accountId,
      sourceAccountDisplay: isPSE ? "PSE (Pagos con otras entidades)" : (account?.displayName || ""),
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

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.sourceAccountId) {
      newErrors.sourceAccount = "Por favor selecciona una cuenta origen";
    }
    if (!formData.serviceId) {
      newErrors.service = "Por favor selecciona un servicio a pagar";
    }

    // Check if amount exceeds account balance (only for account payments, not PSE)
    if (formData.sourceAccountId && formData.amount > 0 && formData.paymentMethod === "account") {
      const selectedAccount = mockUtilitySourceAccounts.find(
        (a) => a.id === formData.sourceAccountId
      );
      if (selectedAccount && formData.amount > selectedAccount.balance) {
        newErrors.sourceAccount = "Saldo insuficiente en la cuenta seleccionada";
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
      <Stepper currentStep={1} steps={UTILITY_PAYMENT_STEPS} />

      {/* Form */}
      <UtilityPaymentDetailsForm
        sourceAccounts={mockUtilitySourceAccounts}
        registeredServices={mockRegisteredServices}
        formData={formData}
        errors={errors}
        onSourceAccountChange={handleSourceAccountChange}
        onServiceChange={handleServiceChange}
        onSubmit={handleSubmit}
        onBack={handleBack}
        isLoading={isLoading}
      />
    </div>
  );
}
