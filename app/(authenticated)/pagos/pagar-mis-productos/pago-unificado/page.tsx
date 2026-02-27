"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { PaymentDetailsCard } from "@/src/organisms";
import { Button } from "@/src/atoms";
import { useUIContext } from "@/src/contexts/UIContext";
import { useWelcomeBar, useUserContext } from "@/src/contexts";
import { PAYMENT_STEPS } from "@/src/mocks/mockPaymentData";
import { PaymentAccount, PendingPayments } from "@/src/types/payment";
import { getPaymentSourcesSavings, getPaymentProducts } from "@/services/payments.service";
import { isAuthError } from "@/lib/api/errors";
import { mapSavingsToPaymentAccount, mapPaymentProductsToPendingPayments } from "@/lib/mappers/payments.mapper";
import type { SavingsAccountResponse } from "@/types/api/products";
import type { PaymentProduct } from "@/types/api/payments";

export default function PagoUnificadoPage() {
  const { clearWelcomeBar, setWelcomeBar } = useWelcomeBar();
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { user } = useUserContext();

  const [accounts, setAccounts] = useState<PaymentAccount[]>([]);
  const [pendingPayments, setPendingPayments] = useState<PendingPayments | null>(null);
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Store raw API data
  const [savingsApiData, setSavingsApiData] = useState<SavingsAccountResponse[]>([]);
  const [paymentProducts, setPaymentProducts] = useState<PaymentProduct[]>([]);

  useEffect(() => {
    setWelcomeBar({
      title: "Pago Unificado",
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
      const [savingsRes, productsRes] = await Promise.all([
        getPaymentSourcesSavings(params),
        getPaymentProducts(params),
      ]);

      setSavingsApiData(savingsRes);
      setPaymentProducts(productsRes);

      const mappedAccounts = savingsRes.map(mapSavingsToPaymentAccount);
      setAccounts(mappedAccounts);

      const pending = mapPaymentProductsToPendingPayments(productsRes);
      setPendingPayments(pending);
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
    if (!pendingPayments) return;

    if (!selectedAccountId) {
      setError("Por favor selecciona una cuenta");
      return;
    }

    const isPSE = selectedAccountId === "pse";

    if (!isPSE) {
      const selectedAccount = allAccounts.find(
        (acc) => acc.id === selectedAccountId
      );

      if (
        selectedAccount &&
        selectedAccount.balance < pendingPayments.total
      ) {
        setError("Saldo insuficiente en la cuenta seleccionada");
        return;
      }
    }

    sessionStorage.setItem("paymentAccountId", selectedAccountId);
    sessionStorage.setItem("paymentMethod", isPSE ? "pse" : "account");

    // Store raw API data for transaction building
    const selectedSavings = savingsApiData.find(
      (a) => a.idCuenta === selectedAccountId
    );
    if (selectedSavings) {
      sessionStorage.setItem("unifiedSourceAccountApi", JSON.stringify(selectedSavings));
    }
    sessionStorage.setItem("unifiedPaymentProducts", JSON.stringify(paymentProducts));
    sessionStorage.setItem("unifiedPendingPayments", JSON.stringify(pendingPayments));

    router.push("/pagos/pagar-mis-productos/pago-unificado/confirmacion");
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
          items={["Inicio", "Pagos", "Pagar mis productos", "Pago Unificado"]}
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

  if (loading || !pendingPayments) {
    return (
      <div className="space-y-6">
        <Breadcrumbs
          items={["Inicio", "Pagos", "Pagar mis productos", "Pago Unificado"]}
        />
        <div className="bg-white rounded-2xl p-6 animate-pulse space-y-4">
          <div className="h-6 w-48 bg-gray-200 rounded" />
          <div className="h-32 w-full bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={["Inicio", "Pagos", "Pagar mis productos", "Pago Unificado"]}
      />

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={1} steps={PAYMENT_STEPS} />
      </div>

      <PaymentDetailsCard
        accounts={allAccounts}
        pendingPayments={pendingPayments}
        selectedAccountId={selectedAccountId}
        onAccountChange={setSelectedAccountId}
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
