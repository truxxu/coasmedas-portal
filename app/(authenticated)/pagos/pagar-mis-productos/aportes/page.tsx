"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { AportesDetailsCard } from "@/src/organisms";
import { Button } from "@/src/atoms";
import { useUIContext } from "@/src/contexts/UIContext";
import { useWelcomeBar, useUserContext } from "@/src/contexts";
import { PaymentAccount } from "@/src/types/payment";
import { AportesPaymentBreakdown } from "@/src/types/aportes-payment";
import {
  APORTES_PAYMENT_STEPS,
  isPSEPayment,
  getPaymentMethod,
} from "@/src/mocks/mockAportesPaymentData";
import { getPaymentSourcesSavings, getPaymentProducts } from "@/services/payments.service";
import { getProductsContributions } from "@/services/products.service";
import { isAuthError } from "@/lib/api/errors";
import {
  mapSavingsToPaymentAccount,
  mapContributionsToBreakdown,
} from "@/lib/mappers/payments.mapper";
import type {
  SavingsAccountResponse,
  ContributionsResponse,
} from "@/types/api/products";
import type { PaymentProduct } from "@/types/api/payments";

export default function PagoAportesPage() {
  const { clearWelcomeBar, setWelcomeBar } = useWelcomeBar();
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { user } = useUserContext();

  const [accounts, setAccounts] = useState<PaymentAccount[]>([]);
  const [paymentBreakdown, setPaymentBreakdown] =
    useState<AportesPaymentBreakdown | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [valorAPagar, setValorAPagar] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Store raw API responses for building transaction request later
  const [savingsApiData, setSavingsApiData] = useState<
    SavingsAccountResponse[]
  >([]);
  const [contributionsApiData, setContributionsApiData] =
    useState<ContributionsResponse | null>(null);
  const [paymentProductsData, setPaymentProductsData] = useState<PaymentProduct[]>([]);

  // Set welcome bar on mount
  useEffect(() => {
    setWelcomeBar({
      title: "Pago de Aportes",
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
      const [savingsRes, contributionsRes, paymentProductsRes] = await Promise.all([
        getPaymentSourcesSavings(params),
        getProductsContributions(params),
        getPaymentProducts(params),
      ]);

      // Store raw API data
      setSavingsApiData(savingsRes);
      setContributionsApiData(contributionsRes);
      setPaymentProductsData(paymentProductsRes);

      // Map to UI types
      const mappedAccounts = savingsRes.map(mapSavingsToPaymentAccount);
      setAccounts(mappedAccounts);

      const breakdown = mapContributionsToBreakdown(contributionsRes);
      setPaymentBreakdown(breakdown);

      // Set default payment amount
      setValorAPagar(
        breakdown.aportesVigentes + breakdown.fondoSolidaridadVigente,
      );
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

  const allAccounts = accounts;

  const handleContinue = () => {
    if (!paymentBreakdown) return;

    // Validation
    if (!selectedAccountId) {
      setError("Por favor selecciona una cuenta o metodo de pago");
      return;
    }

    if (valorAPagar <= 0) {
      setError("El valor a pagar debe ser mayor a 0");
      return;
    }

    // Only check balance if paying from an internal account (not PSE)
    if (!isPSEPayment(selectedAccountId)) {
      const selectedAccount = allAccounts.find(
        (acc) => acc.id === selectedAccountId,
      );

      if (selectedAccount && selectedAccount.balance < valorAPagar) {
        setError("Saldo insuficiente en la cuenta seleccionada");
        return;
      }
    }

    // Store data in sessionStorage
    sessionStorage.setItem("aportesPaymentAccountId", selectedAccountId);
    sessionStorage.setItem("aportesPaymentValor", valorAPagar.toString());
    sessionStorage.setItem(
      "aportesPaymentBreakdown",
      JSON.stringify(paymentBreakdown),
    );
    sessionStorage.setItem(
      "aportesPaymentMethod",
      getPaymentMethod(selectedAccountId),
    );

    // Store raw API data for transaction request building
    const selectedSavingsAccount = savingsApiData.find(
      (a) => String(a.idCuenta) === String(selectedAccountId),
    );
    if (selectedSavingsAccount) {
      sessionStorage.setItem(
        "aportesSourceAccount",
        JSON.stringify(selectedSavingsAccount),
      );
    }
    if (contributionsApiData) {
      sessionStorage.setItem(
        "aportesContributions",
        JSON.stringify(contributionsApiData),
      );
    }

    // Cross-reference payment products to find tipoProducto for aportes target
    const aportesIdCuenta = contributionsApiData?.aportes?.idCuentaAportes;
    if (aportesIdCuenta) {
      const matchingProduct = paymentProductsData.find(
        (p) => String(p.idCuenta) === String(aportesIdCuenta)
      );
      if (matchingProduct) {
        sessionStorage.setItem("aportesTargetTipoProducto", matchingProduct.tipoProducto);
      }
    }

    router.push("/pagos/pagar-mis-productos/aportes/confirmacion");
  };

  const handleNeedMoreBalance = () => {
    console.log("Need more balance");
  };

  const handleBack = () => {
    router.push("/pagos/pagar-mis-productos");
  };

  if (loadError) {
    return (
      <div className="space-y-6">
        <Breadcrumbs
          items={["Inicio", "Pagos", "Pagar mis productos", "Pago de Aportes"]}
        />
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
        <Breadcrumbs
          items={["Inicio", "Pagos", "Pagar mis productos", "Pago de Aportes"]}
        />
        <div className="bg-white rounded-2xl p-6 animate-pulse space-y-4">
          <div className="h-6 w-48 bg-gray-200 rounded" />
          <div className="h-32 w-full bg-gray-200 rounded" />
          <div className="h-32 w-full bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!paymentBreakdown) {
    return (
      <div className="space-y-6">
        <Breadcrumbs
          items={["Inicio", "Pagos", "Pagar mis productos", "Pago de Aportes"]}
        />
        <div className="bg-white rounded-2xl p-8 text-center space-y-4">
          <p className="text-gray-500 text-base">
            No tienes aportes pendientes por pagar en este momento.
          </p>
          <button
            onClick={handleBack}
            className="text-sm font-medium text-brand-navy hover:underline"
          >
            Volver a Pagos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={["Inicio", "Pagos", "Pagar mis productos", "Pago de Aportes"]}
      />

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={1} steps={APORTES_PAYMENT_STEPS} />
      </div>

      <AportesDetailsCard
        accounts={allAccounts}
        paymentBreakdown={paymentBreakdown}
        selectedAccountId={selectedAccountId}
        valorAPagar={valorAPagar}
        onAccountChange={(id) => {
          setSelectedAccountId(id);
          setError("");
        }}
        onValorChange={(valor) => {
          setValorAPagar(valor);
          setError("");
        }}
        onNeedMoreBalance={handleNeedMoreBalance}
        hideBalances={hideBalances}
      />

      {error && (
        <div className="text-sm text-brand-error text-center">{error}</div>
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
