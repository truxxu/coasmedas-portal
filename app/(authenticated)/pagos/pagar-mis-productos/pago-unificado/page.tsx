"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { PaymentDetailsCard } from "@/src/organisms";
import { Button } from "@/src/atoms";
import { useUIContext } from "@/src/contexts/UIContext";
import { useWelcomeBar } from "@/src/contexts";
import {
  mockPaymentAccounts,
  mockPendingPayments,
  PAYMENT_STEPS,
} from "@/src/mocks/mockPaymentData";

export default function PagoUnificadoPage() {
  const { clearWelcomeBar, setWelcomeBar } = useWelcomeBar();
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Clear welcome bar on mount
  useEffect(() => {
    setWelcomeBar({
      title: "Pago Unificado",
      backHref: "/pagos/pagar-mis-productos",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const handleContinue = () => {
    // Validation
    if (!selectedAccountId) {
      setError("Por favor selecciona una cuenta");
      return;
    }

    const selectedAccount = mockPaymentAccounts.find(
      (acc) => acc.id === selectedAccountId
    );

    if (
      selectedAccount &&
      selectedAccount.balance < mockPendingPayments.total
    ) {
      setError("Saldo insuficiente en la cuenta seleccionada");
      return;
    }

    // Store data in sessionStorage for next step
    sessionStorage.setItem("paymentAccountId", selectedAccountId);

    // Navigate to confirmation
    router.push("/pagos/pagar-mis-productos/pago-unificado/confirmacion");
  };

  const handleNeedMoreBalance = () => {
    // TODO: Open modal or navigate to transfer page
    console.log("Need more balance");
  };

  const handleBack = () => {
    router.push("/pagos/pagar-mis-productos");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Breadcrumbs
          items={["Inicio", "Pagos", "Pagar mis productos", "Pago Unificado"]}
        />
        <Stepper currentStep={1} steps={PAYMENT_STEPS} />
      </div>

      <PaymentDetailsCard
        accounts={mockPaymentAccounts}
        pendingPayments={mockPendingPayments}
        selectedAccountId={selectedAccountId}
        onAccountChange={setSelectedAccountId}
        onNeedMoreBalance={handleNeedMoreBalance}
        hideBalances={hideBalances}
      />

      {error && (
        <div className="text-sm text-[#FF0D00] text-center">{error}</div>
      )}

      <div className="flex justify-between">
        <Button variant="ghost" onClick={handleBack}>
          Volver
        </Button>
        <Button variant="primary" onClick={handleContinue}>
          Continuar
        </Button>
      </div>
    </div>
  );
}
