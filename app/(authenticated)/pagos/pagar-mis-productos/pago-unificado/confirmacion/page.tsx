"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { PaymentConfirmationCard } from "@/src/organisms";
import { Button } from "@/src/atoms";
import { useUIContext } from "@/src/contexts/UIContext";
import { useWelcomeBar } from "@/src/contexts";
import { PaymentConfirmationData } from "@/src/types/payment";
import {
  mockPaymentAccounts,
  mockPendingPayments,
  mockUserData,
  PAYMENT_STEPS,
} from "@/src/mocks/mockPaymentData";

export default function ConfirmacionPage() {
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const [confirmationData, setConfirmationData] =
    useState<PaymentConfirmationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Configure WelcomeBar on mount
  useEffect(() => {
    setWelcomeBar({
      title: "Pago Unificado",
      backHref: "/pagos/pagar-mis-productos",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  // Load data from sessionStorage
  useEffect(() => {
    const accountId = sessionStorage.getItem("paymentAccountId");
    const paymentMethod = sessionStorage.getItem("paymentMethod");

    if (!accountId) {
      // No data from step 1, redirect back
      router.push("/pagos/pagar-mis-productos/pago-unificado");
      return;
    }

    // Handle PSE payment method
    if (paymentMethod === "pse") {
      const data: PaymentConfirmationData = {
        titular: mockUserData.name,
        documento: mockUserData.document,
        aportes: mockPendingPayments.aportes,
        obligaciones: mockPendingPayments.obligaciones,
        proteccion: mockPendingPayments.proteccion,
        debitAccount: "PSE (Pagos con otras entidades)",
        debitAccountNumber: "",
        totalAmount: mockPendingPayments.total,
      };
      setConfirmationData(data);
      setIsLoading(false);
      return;
    }

    // Find the selected account
    const selectedAccount = mockPaymentAccounts.find(
      (acc) => acc.id === accountId
    );

    if (!selectedAccount) {
      router.push("/pagos/pagar-mis-productos/pago-unificado");
      return;
    }

    // Build confirmation data
    const data: PaymentConfirmationData = {
      titular: mockUserData.name,
      documento: mockUserData.document,
      aportes: mockPendingPayments.aportes,
      obligaciones: mockPendingPayments.obligaciones,
      proteccion: mockPendingPayments.proteccion,
      debitAccount: selectedAccount.name,
      debitAccountNumber: selectedAccount.number,
      totalAmount: mockPendingPayments.total,
    };

    setConfirmationData(data);
    setIsLoading(false);
  }, [router]);

  const handleConfirm = () => {
    // Store confirmation data for next step
    if (confirmationData) {
      sessionStorage.setItem(
        "paymentConfirmationData",
        JSON.stringify(confirmationData)
      );
    }

    // Check payment method and navigate accordingly
    const paymentMethod = sessionStorage.getItem("paymentMethod");
    if (paymentMethod === "pse") {
      // Navigate to PSE loading page
      router.push("/pagos/pagar-mis-productos/pago-unificado/pse");
    } else {
      // Navigate to SMS verification
      router.push("/pagos/pagar-mis-productos/pago-unificado/verificacion");
    }
  };

  const handleBack = () => {
    router.push("/pagos/pagar-mis-productos/pago-unificado");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-brand-gray-high">Cargando...</div>
      </div>
    );
  }

  if (!confirmationData) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Breadcrumbs
          items={["Inicio", "Pagos", "Pagar mis productos", "Pago Unificado"]}
        />
        <Stepper currentStep={2} steps={PAYMENT_STEPS} />
      </div>

      <PaymentConfirmationCard
        confirmationData={confirmationData}
        hideBalances={hideBalances}
      />

      <div className="flex justify-between">
        <Button variant="ghost" onClick={handleBack}>
          Volver
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Confirmar Pago
        </Button>
      </div>
    </div>
  );
}
