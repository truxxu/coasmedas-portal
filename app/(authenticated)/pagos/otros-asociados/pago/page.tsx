"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper, HideBalancesToggle } from "@/src/molecules";
import { OtrosAsociadosDetailsCard } from "@/src/organisms";
import { useUIContext } from "@/src/contexts/UIContext";
import { useWelcomeBar } from "@/src/contexts";
import {
  mockSourceAccounts,
  mockPayableProducts,
  OTROS_ASOCIADOS_PAYMENT_STEPS,
  OTROS_ASOCIADOS_PAYMENT_STEPS_PSE,
} from "@/src/mocks";
import { RegisteredBeneficiary, PayableProduct } from "@/src/types";

export default function OtrosAsociadosPagoPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const [beneficiary, setBeneficiary] = useState<RegisteredBeneficiary | null>(
    null
  );
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [products, setProducts] = useState<PayableProduct[]>(
    mockPayableProducts.map((p) => ({ ...p }))
  );
  const [error, setError] = useState<string>("");

  // Configure WelcomeBar on mount, clear on unmount
  useEffect(() => {
    setWelcomeBar({
      title: "Pago a otros asociados",
      backHref: "/pagos/otros-asociados",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    // Get beneficiary from sessionStorage
    const beneficiaryStr = sessionStorage.getItem("otrosAsociadosBeneficiary");
    if (!beneficiaryStr) {
      router.push("/pagos/otros-asociados");
      return;
    }
    setBeneficiary(JSON.parse(beneficiaryStr));
  }, [router]);

  const totalAmount = products
    .filter((p) => p.isSelected)
    .reduce((sum, p) => sum + p.amountToPay, 0);

  // Determine which stepper to show based on selected funding source
  const selectedAccount = mockSourceAccounts.find((a) => a.id === selectedAccountId);
  const paymentSteps = selectedAccount?.sourceType === "pse"
    ? OTROS_ASOCIADOS_PAYMENT_STEPS_PSE
    : OTROS_ASOCIADOS_PAYMENT_STEPS;

  const handleProductSelectionChange = useCallback(
    (productId: string, selected: boolean) => {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, isSelected: selected } : p
        )
      );
      setError("");
    },
    []
  );

  const handleProductAmountChange = useCallback(
    (productId: string, amount: number) => {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, amountToPay: amount } : p
        )
      );
      setError("");
    },
    []
  );

  const handleContinue = () => {
    // Validation
    if (!selectedAccountId) {
      setError("Por favor selecciona un origen de fondos");
      return;
    }

    const selectedProducts = products.filter((p) => p.isSelected);
    if (selectedProducts.length === 0) {
      setError("Por favor selecciona al menos un producto");
      return;
    }

    const hasZeroAmount = selectedProducts.some((p) => p.amountToPay <= 0);
    if (hasZeroAmount) {
      setError(
        "El valor a pagar debe ser mayor a 0 para todos los productos seleccionados"
      );
      return;
    }

    const account = mockSourceAccounts.find((a) => a.id === selectedAccountId);
    // Skip balance validation for PSE (paid from external bank)
    if (account && account.sourceType !== "pse" && totalAmount > account.balance) {
      setError("Saldo insuficiente en el origen de fondos seleccionado");
      return;
    }

    // Store data in sessionStorage
    sessionStorage.setItem("otrosAsociadosAccountId", selectedAccountId);
    sessionStorage.setItem("otrosAsociadosSourceType", account?.sourceType || "cuenta");
    sessionStorage.setItem(
      "otrosAsociadosProducts",
      JSON.stringify(selectedProducts)
    );
    sessionStorage.setItem("otrosAsociadosTotalAmount", totalAmount.toString());

    router.push("/pagos/otros-asociados/pago/confirmacion");
  };

  const handleNeedMoreBalance = () => {
    console.log("Need more balance");
  };

  const handleBack = () => {
    router.push("/pagos/otros-asociados");
  };

  if (!beneficiary) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-[#58585B]">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Breadcrumbs items={["Inicio", "Pagos", "Pago a otros asociados"]} />
      </div>

      <Stepper currentStep={1} steps={paymentSteps} />

      <OtrosAsociadosDetailsCard
        beneficiaryName={beneficiary.fullName}
        accounts={mockSourceAccounts}
        selectedAccountId={selectedAccountId}
        products={products}
        totalAmount={totalAmount}
        onAccountChange={setSelectedAccountId}
        onProductSelectionChange={handleProductSelectionChange}
        onProductAmountChange={handleProductAmountChange}
        onNeedMoreBalance={handleNeedMoreBalance}
        hideBalances={hideBalances}
      />

      {error && (
        <div className="text-sm text-[#FF0D00] text-center">{error}</div>
      )}

      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          className="text-sm font-medium text-[#004266] hover:underline"
        >
          Volver
        </button>
        <Button variant="primary" onClick={handleContinue}>
          Continuar
        </Button>
      </div>
    </div>
  );
}
