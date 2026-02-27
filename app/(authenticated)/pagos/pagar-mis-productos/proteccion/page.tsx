"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { ProtectionPaymentDetailsCard } from "@/src/organisms";
import { useUIContext } from "@/src/contexts/UIContext";
import { useWelcomeBar, useUserContext } from "@/src/contexts";
import { PROTECTION_PAYMENT_STEPS } from "@/src/mocks";
import type {
  ProtectionPaymentProduct,
  ProtectionPaymentDetailsFormData,
  ProtectionPaymentMethod,
  ProtectionPaymentSourceAccount,
} from "@/src/types";
import { getPaymentSourcesSavings } from "@/services/payments.service";
import { getProductsProtection } from "@/services/products.service";
import { isAuthError } from "@/lib/api/errors";
import { mapSavingsToSourceAccount, mapProtectionToPaymentProduct } from "@/lib/mappers/payments.mapper";
import type { SavingsAccountResponse, ProtectionAccountResponse } from "@/types/api/products";
import type { ObligacionSourceAccount } from "@/src/types/obligacion-payment";

const initialFormData: ProtectionPaymentDetailsFormData = {
  sourceAccountId: "",
  sourceAccountDisplay: "",
  selectedProduct: null,
  paymentMethod: "account",
};

export default function ProteccionDetallePage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const { user } = useUserContext();

  const [sourceAccounts, setSourceAccounts] = useState<ProtectionPaymentSourceAccount[]>([]);
  const [products, setProducts] = useState<ProtectionPaymentProduct[]>([]);
  const [formData, setFormData] = useState<ProtectionPaymentDetailsFormData>(initialFormData);
  const [selectedProduct, setSelectedProduct] = useState<ProtectionPaymentProduct | null>(null);
  const [errors, setErrors] = useState<{ sourceAccount?: string; product?: string }>({});
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Store raw API data
  const [savingsApiData, setSavingsApiData] = useState<SavingsAccountResponse[]>([]);
  const [protectionApiData, setProtectionApiData] = useState<ProtectionAccountResponse[]>([]);

  useEffect(() => {
    setWelcomeBar({
      title: "Pago de Proteccion",
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
      const [savingsRes, protectionRes] = await Promise.all([
        getPaymentSourcesSavings(params),
        getProductsProtection(params),
      ]);

      setSavingsApiData(savingsRes);
      setProtectionApiData(protectionRes);

      // Map savings → ProtectionPaymentSourceAccount (same shape as ObligacionSourceAccount)
      const mappedAccounts: ProtectionPaymentSourceAccount[] = savingsRes.map((s) => {
        const mapped: ObligacionSourceAccount = mapSavingsToSourceAccount(s);
        return mapped;
      });
      setSourceAccounts(mappedAccounts);

      const mappedProducts = protectionRes.map(mapProtectionToPaymentProduct);
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

  const handleAccountChange = (
    accountId: string,
    paymentMethod: ProtectionPaymentMethod
  ) => {
    const isPSE = paymentMethod === "pse";
    const account = allSourceAccounts.find((a) => a.id === accountId);

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

  const handleProductSelect = (product: ProtectionPaymentProduct) => {
    setSelectedProduct(product);
    setFormData((prev) => ({
      ...prev,
      selectedProduct: product,
    }));
    setErrors((prev) => ({ ...prev, product: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.sourceAccountId) {
      newErrors.sourceAccount = "Por favor selecciona una cuenta origen";
    }
    if (!selectedProduct) {
      newErrors.product = "Por favor selecciona un producto de proteccion";
    }

    if (
      formData.sourceAccountId &&
      selectedProduct &&
      formData.paymentMethod === "account"
    ) {
      const selectedAccount = allSourceAccounts.find(
        (a) => a.id === formData.sourceAccountId
      );
      if (
        selectedAccount &&
        selectedProduct.nextPaymentAmount > selectedAccount.balance
      ) {
        newErrors.sourceAccount =
          "Saldo insuficiente en la cuenta seleccionada";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validateForm()) return;

    const dataToStore: ProtectionPaymentDetailsFormData = {
      ...formData,
      selectedProduct,
    };
    sessionStorage.setItem(
      "protectionPaymentDetails",
      JSON.stringify(dataToStore)
    );

    // Store raw API data for transaction building
    const selectedSavings = savingsApiData.find(
      (a) => a.idCuenta === formData.sourceAccountId
    );
    if (selectedSavings) {
      sessionStorage.setItem("protectionSourceAccountApi", JSON.stringify(selectedSavings));
    }
    if (selectedProduct) {
      const protectionApi = protectionApiData.find(
        (p) => p.idCuenta === selectedProduct.id
      );
      if (protectionApi) {
        sessionStorage.setItem("protectionTargetProductApi", JSON.stringify(protectionApi));
      }
    }

    router.push("/pagos/pagar-mis-productos/proteccion/confirmacion");
  };

  const handleBack = () => {
    router.push("/pagos/pagar-mis-productos");
  };

  if (loadError) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={["Inicio", "Pagos", "Pagos de Proteccion"]} />
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
        <Breadcrumbs items={["Inicio", "Pagos", "Pagos de Proteccion"]} />
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
      <div className="flex items-center justify-between">
        <Breadcrumbs items={["Inicio", "Pagos", "Pagos de Proteccion"]} />
      </div>

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={1} steps={PROTECTION_PAYMENT_STEPS} />
      </div>

      <ProtectionPaymentDetailsCard
        sourceAccounts={allSourceAccounts}
        products={products}
        selectedAccountId={formData.sourceAccountId}
        selectedProduct={selectedProduct}
        onAccountChange={handleAccountChange}
        onProductSelect={handleProductSelect}
        errors={errors}
        hideBalances={hideBalances}
      />

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
