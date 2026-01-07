"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { ObligacionDetailsCard } from "@/src/organisms";
import { useUIContext } from "@/src/contexts/UIContext";
import { useWelcomeBar } from "@/src/contexts";
import { PaymentType, ObligacionPaymentMethod } from "@/src/types/obligacion-payment";
import {
  mockObligacionProducts,
  mockObligacionSourceAccounts,
  OBLIGACION_PAYMENT_STEPS,
  OBLIGACION_PAYMENT_STEPS_ACCOUNT,
} from "@/src/mocks/mockObligacionPaymentData";

export default function PagoObligacionesPage() {
  const { clearWelcomeBar, setWelcomeBar } = useWelcomeBar();
  const router = useRouter();
  const { hideBalances } = useUIContext();

  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<ObligacionPaymentMethod>("account");
  const [valorAPagar, setValorAPagar] = useState<number>(0);
  const [activePaymentType, setActivePaymentType] =
    useState<PaymentType | null>(null);
  const [error, setError] = useState<string>("");
  const [accountError, setAccountError] = useState<string>("");

  useEffect(() => {
    setWelcomeBar({
      title: "Pago de Obligaciones",
      backHref: "/pagos/pagar-mis-productos",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const breadcrumbItems = [
    "Inicio",
    "Pagos",
    "Pagar mis productos",
    "Pago de Obligaciones",
  ];

  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId);
    setError("");
    // Reset payment amount when product changes
    const product = mockObligacionProducts.find((p) => p.id === productId);
    if (product) {
      setValorAPagar(product.minimumPayment);
      setActivePaymentType("minimum");
    }
  };

  const handleAccountChange = (accountId: string, method: ObligacionPaymentMethod) => {
    setSelectedAccountId(accountId);
    setPaymentMethod(method);
    setAccountError("");
  };

  const handlePaymentTypeSelect = (type: PaymentType) => {
    const product = mockObligacionProducts.find(
      (p) => p.id === selectedProductId
    );
    if (!product) return;

    setActivePaymentType(type);
    if (type === "minimum") {
      setValorAPagar(product.minimumPayment);
    } else {
      setValorAPagar(product.totalBalance);
    }
  };

  const handleValorChange = (valor: number) => {
    setValorAPagar(valor);
    setActivePaymentType(null); // Clear active button when manually editing
    setError("");
  };

  const handleContinue = () => {
    // Validation
    if (!selectedAccountId) {
      setAccountError("Por favor selecciona una cuenta origen");
      return;
    }

    if (!selectedProductId) {
      setError("Por favor selecciona un producto");
      return;
    }

    const selectedProduct = mockObligacionProducts.find(
      (p) => p.id === selectedProductId
    );

    if (!selectedProduct) {
      setError("Producto no encontrado");
      return;
    }

    if (valorAPagar <= 0) {
      setError("El valor a pagar debe ser mayor a 0");
      return;
    }

    if (valorAPagar < selectedProduct.minimumPayment) {
      setError(
        `El valor mínimo de pago es ${selectedProduct.minimumPayment.toLocaleString(
          "es-CO"
        )}`
      );
      return;
    }

    if (valorAPagar > selectedProduct.totalBalance) {
      setError("El valor no puede exceder el saldo total");
      return;
    }

    // Check if balance is sufficient (only for account payments, not PSE)
    if (paymentMethod === 'account') {
      const selectedAccount = mockObligacionSourceAccounts.find(
        (a) => a.id === selectedAccountId
      );
      if (selectedAccount && valorAPagar > selectedAccount.balance) {
        setAccountError('Saldo insuficiente en la cuenta seleccionada');
        return;
      }
    }

    // Determine source account display
    const isPSE = paymentMethod === 'pse';
    const selectedAccount = mockObligacionSourceAccounts.find(
      (a) => a.id === selectedAccountId
    );
    const sourceAccountDisplay = isPSE
      ? 'PSE (Pagos con otras entidades)'
      : (selectedAccount?.displayName || '');

    // Store data in sessionStorage
    sessionStorage.setItem("obligacionPaymentProductId", selectedProductId);
    sessionStorage.setItem("obligacionPaymentValor", valorAPagar.toString());
    sessionStorage.setItem(
      "obligacionPaymentProduct",
      JSON.stringify(selectedProduct)
    );
    sessionStorage.setItem("obligacionPaymentMethod", paymentMethod);
    sessionStorage.setItem("obligacionSourceAccountId", selectedAccountId);
    sessionStorage.setItem("obligacionSourceAccountDisplay", sourceAccountDisplay);

    router.push("/pagos/pagar-mis-productos/obligaciones/confirmacion");
  };

  const handleNeedMoreBalance = () => {
    // TODO: Open modal or navigate to transfer page
    console.log("Need more balance");
  };

  const handleBack = () => {
    router.push("/pagos/pagar-mis-productos");
  };

  // Determine which steps to show based on payment method
  const currentSteps = paymentMethod === 'pse'
    ? OBLIGACION_PAYMENT_STEPS
    : OBLIGACION_PAYMENT_STEPS_ACCOUNT;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbItems} />

      <Stepper currentStep={1} steps={currentSteps} />

      <ObligacionDetailsCard
        products={mockObligacionProducts}
        sourceAccounts={mockObligacionSourceAccounts}
        selectedProductId={selectedProductId}
        selectedAccountId={selectedAccountId}
        valorAPagar={valorAPagar}
        activePaymentType={activePaymentType}
        onProductSelect={handleProductSelect}
        onAccountChange={handleAccountChange}
        onValorChange={handleValorChange}
        onPaymentTypeSelect={handlePaymentTypeSelect}
        onNeedMoreBalance={handleNeedMoreBalance}
        hideBalances={hideBalances}
        accountError={accountError}
      />

      {error && (
        <div className="text-sm text-brand-error text-center">{error}</div>
      )}

      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          className="text-sm font-medium text-brand-navy hover:underline"
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
