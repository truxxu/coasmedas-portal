"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { OtrosAsociadosConfirmationCard } from "@/src/organisms";
import { useUIContext } from "@/src/contexts/UIContext";
import { useWelcomeBar } from "@/src/contexts";
import {
  mockOtrosAsociadosUserData,
  mockOtrosAsociadosSourceAccounts,
  OTROS_ASOCIADOS_PAYMENT_STEPS,
  OTROS_ASOCIADOS_PAYMENT_STEPS_PSE,
} from "@/src/mocks";
import {
  RegisteredBeneficiary,
  PayableProduct,
  OtrosAsociadosConfirmationData,
  FundingSourceType,
} from "@/src/types";

export default function OtrosAsociadosConfirmacionPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const [sourceType] = useState<FundingSourceType>(() => {
    if (typeof window === 'undefined') return "cuenta";
    const stored = sessionStorage.getItem("otrosAsociadosSourceType") as FundingSourceType | null;
    return stored || "cuenta";
  });

  const [confirmationData] =
    useState<OtrosAsociadosConfirmationData | null>(() => {
      if (typeof window === 'undefined') return null;
      const beneficiaryStr = sessionStorage.getItem("otrosAsociadosBeneficiary");
      const accountId = sessionStorage.getItem("otrosAsociadosAccountId");
      const productsStr = sessionStorage.getItem("otrosAsociadosProducts");
      const totalAmount = sessionStorage.getItem("otrosAsociadosTotalAmount");

      if (!beneficiaryStr || !accountId || !productsStr || !totalAmount) {
        return null;
      }

      const beneficiary: RegisteredBeneficiary = JSON.parse(beneficiaryStr);
      const products: PayableProduct[] = JSON.parse(productsStr);
      const account = mockOtrosAsociadosSourceAccounts.find((a) => a.id === accountId);

      if (!account) {
        return null;
      }

      return {
        titular: mockOtrosAsociadosUserData.name,
        documento: mockOtrosAsociadosUserData.document,
        productoADebitar: account.type,
        beneficiaryName: beneficiary.fullName,
        products: products.map((p) => ({
          name: p.name,
          amount: p.amountToPay,
        })),
        totalAmount: parseInt(totalAmount, 10),
      };
    });

  // Determine which stepper to use based on funding source
  const paymentSteps = sourceType === "pse"
    ? OTROS_ASOCIADOS_PAYMENT_STEPS_PSE
    : OTROS_ASOCIADOS_PAYMENT_STEPS;

  // Configure WelcomeBar on mount, clear on unmount
  useEffect(() => {
    setWelcomeBar({
      title: "Pago a otros asociados",
      backHref: "/pagos/otros-asociados/pago",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  // Redirect if data is missing
  useEffect(() => {
    if (!confirmationData) {
      router.push("/pagos/otros-asociados/pago");
    }
  }, [confirmationData, router]);

  const handleConfirm = () => {
    if (confirmationData) {
      sessionStorage.setItem(
        "otrosAsociadosConfirmation",
        JSON.stringify(confirmationData)
      );
    }

    // Check funding source type to determine next step
    const storedSourceType = sessionStorage.getItem("otrosAsociadosSourceType");

    if (storedSourceType === "cuenta") {
      // Accounts require SMS verification
      router.push("/pagos/otros-asociados/pago/sms");
    } else {
      // PSE redirects to bank payment gateway
      router.push("/pagos/otros-asociados/pago/pse");
    }
  };

  const handleBack = () => {
    router.push("/pagos/otros-asociados/pago");
  };

  if (!confirmationData) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-brand-gray-high">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Breadcrumbs items={["Inicio", "Pagos", "Pago a otros asociados"]} />
      </div>

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={2} steps={paymentSteps} />
      </div>

      <OtrosAsociadosConfirmationCard
        confirmationData={confirmationData}
        hideBalances={hideBalances}
      />

      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          className="text-sm font-medium text-brand-teal-dark hover:underline"
        >
          Volver
        </button>
        <Button variant="primary" onClick={handleConfirm}>
          Confirmar Pago
        </Button>
      </div>
    </div>
  );
}
