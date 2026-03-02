"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { ObligacionDetailsCard } from "@/src/organisms";
import { useUIContext } from "@/src/contexts/UIContext";
import { useWelcomeBar, useUserContext } from "@/src/contexts";
import { PaymentType, ObligacionPaymentMethod, ObligacionSourceAccount, ObligacionPaymentProduct } from "@/src/types/obligacion-payment";
import {
  OBLIGACION_PAYMENT_STEPS,
  OBLIGACION_PAYMENT_STEPS_ACCOUNT,
} from "@/src/mocks/mockObligacionPaymentData";
import { getPaymentSourcesSavings } from "@/services/payments.service";
import { getProductsCredits } from "@/services/products.service";
import { isAuthError } from "@/lib/api/errors";
import { mapSavingsToSourceAccount, mapCreditToObligacionPaymentProduct } from "@/lib/mappers/payments.mapper";
import type { SavingsAccountResponse, CreditAccountResponse } from "@/types/api/products";

export default function PagoObligacionesPage() {
  const { clearWelcomeBar, setWelcomeBar } = useWelcomeBar();
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { user } = useUserContext();

  const [sourceAccounts, setSourceAccounts] = useState<ObligacionSourceAccount[]>([]);
  const [products, setProducts] = useState<ObligacionPaymentProduct[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<ObligacionPaymentMethod>("account");
  const [valorAPagar, setValorAPagar] = useState<number>(0);
  const [activePaymentType, setActivePaymentType] = useState<PaymentType | null>(null);
  const [error, setError] = useState<string>("");
  const [accountError, setAccountError] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Store raw API data for transaction request building
  const [savingsApiData, setSavingsApiData] = useState<SavingsAccountResponse[]>([]);
  const [creditsApiData, setCreditsApiData] = useState<CreditAccountResponse[]>([]);

  useEffect(() => {
    setWelcomeBar({
      title: "Pago de Obligaciones",
      backHref: "/pagos/pagar-mis-productos",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const { documentType, documentNumber } = user ?? {};

  const fetchData = useCallback(async () => {
    if (!documentType || !documentNumber) return;

    try {
      setLoading(true);
      setLoadError(null);

      const params = { documentType, documentNumber };
      const [savingsRes, creditsRes] = await Promise.all([
        getPaymentSourcesSavings(params),
        getProductsCredits(params),
      ]);

      setSavingsApiData(savingsRes);
      setCreditsApiData(creditsRes);

      const mappedAccounts = savingsRes.map(mapSavingsToSourceAccount);
      setSourceAccounts(mappedAccounts);

      const mappedProducts = creditsRes.map(mapCreditToObligacionPaymentProduct);
      setProducts(mappedProducts);
    } catch (err) {
      if (isAuthError(err)) {
        router.push("/login");
        return;
      }
      setLoadError("No fue posible cargar la informacion. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  }, [documentType, documentNumber, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const allSourceAccounts = sourceAccounts;

  const breadcrumbItems = [
    "Inicio",
    "Pagos",
    "Pagar mis productos",
    "Pago de Obligaciones",
  ];

  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId);
    setError("");
    const product = products.find((p) => p.id === productId);
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
    const product = products.find((p) => p.id === selectedProductId);
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
    setActivePaymentType(null);
    setError("");
  };

  const handleContinue = () => {
    if (!selectedAccountId) {
      setAccountError("Por favor selecciona una cuenta origen");
      return;
    }

    if (!selectedProductId) {
      setError("Por favor selecciona un producto");
      return;
    }

    const selectedProduct = products.find((p) => p.id === selectedProductId);

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
        `El valor minimo de pago es ${selectedProduct.minimumPayment.toLocaleString("es-CO")}`
      );
      return;
    }

    if (valorAPagar > selectedProduct.totalBalance) {
      setError("El valor no puede exceder el saldo total");
      return;
    }

    if (paymentMethod === "account") {
      const selectedAccount = allSourceAccounts.find((a) => a.id === selectedAccountId);
      if (selectedAccount && valorAPagar > selectedAccount.balance) {
        setAccountError("Saldo insuficiente en la cuenta seleccionada");
        return;
      }
    }

    const isPSE = paymentMethod === "pse";
    const selectedAccount = allSourceAccounts.find((a) => a.id === selectedAccountId);
    const sourceAccountDisplay = isPSE
      ? "PSE (Pagos con otras entidades)"
      : (selectedAccount?.displayName || "");

    // Store data in sessionStorage
    sessionStorage.setItem("obligacionPaymentProductId", selectedProductId);
    sessionStorage.setItem("obligacionPaymentValor", valorAPagar.toString());
    sessionStorage.setItem("obligacionPaymentProduct", JSON.stringify(selectedProduct));
    sessionStorage.setItem("obligacionPaymentMethod", paymentMethod);
    sessionStorage.setItem("obligacionSourceAccountId", selectedAccountId);
    sessionStorage.setItem("obligacionSourceAccountDisplay", sourceAccountDisplay);

    // Store raw API data for transaction request building
    const selectedSavings = savingsApiData.find((a) => String(a.idCuenta) === String(selectedAccountId));
    if (selectedSavings) {
      sessionStorage.setItem("obligacionSourceAccountApi", JSON.stringify(selectedSavings));
    }
    const selectedCredit = creditsApiData.find((c) => String(c.idCuenta) === String(selectedProductId));
    if (selectedCredit) {
      sessionStorage.setItem("obligacionTargetProductApi", JSON.stringify(selectedCredit));
    }

    router.push("/pagos/pagar-mis-productos/obligaciones/confirmacion");
  };

  const handleNeedMoreBalance = () => {
    console.log("Need more balance");
  };

  const handleBack = () => {
    router.push("/pagos/pagar-mis-productos");
  };

  const currentSteps = paymentMethod === "pse"
    ? OBLIGACION_PAYMENT_STEPS
    : OBLIGACION_PAYMENT_STEPS_ACCOUNT;

  if (loadError) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="bg-white rounded-2xl p-6 text-center">
          <p className="text-red-600 mb-4">{loadError}</p>
          <button
            onClick={fetchData}
            className="text-sm font-medium text-white bg-brand-navy px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="bg-white rounded-2xl p-6 animate-pulse space-y-4">
          <div className="h-6 w-48 bg-gray-200 rounded" />
          <div className="h-32 w-full bg-gray-200 rounded" />
          <div className="h-32 w-full bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={1} steps={currentSteps} />
      </div>

      <ObligacionDetailsCard
        products={products}
        sourceAccounts={allSourceAccounts}
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
