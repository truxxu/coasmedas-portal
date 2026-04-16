"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { TarjetaPaymentDetailsCard } from "@/src/organisms";
import { useUIContext, useWelcomeBar } from "@/src/contexts";
import { TarjetaPaymentValueType } from "@/src/types/tarjeta-payment";
import {
  TARJETA_PAYMENT_STEPS,
  mockTarjetaCreditoProducts,
  mockTarjetaSourceAccounts,
} from "@/src/mocks";

const BREADCRUMBS = ["Inicio", "Tarjeta de Crédito", "Pagar Tarjeta"];

function PagarTarjetaDetalleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { hideBalances } = useUIContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const cardId = searchParams.get("cardId") ?? "";
  const product = useMemo(
    () => mockTarjetaCreditoProducts.find((p) => p.id === cardId) ?? null,
    [cardId],
  );

  const [selectedAccountId, setSelectedAccountId] = useState("");
  const [valorAPagar, setValorAPagar] = useState(product?.pagoMinimo ?? 0);
  const [activePaymentType, setActivePaymentType] =
    useState<TarjetaPaymentValueType>("minimum");
  const [accountError, setAccountError] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setWelcomeBar({ title: "Pagar Tarjeta", backHref: "/tarjeta" });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    if (!product) {
      router.push("/tarjeta");
    }
  }, [product, router]);

  if (!product) {
    return null;
  }

  const handleAccountChange = (accountId: string) => {
    setSelectedAccountId(accountId);
    setAccountError("");
  };

  const handlePaymentTypeSelect = (type: TarjetaPaymentValueType) => {
    setActivePaymentType(type);
    setError("");
    if (type === "total") {
      setValorAPagar(product.deudaTotal);
    } else if (type === "minimum") {
      setValorAPagar(product.pagoMinimo);
    } else {
      setValorAPagar(0);
    }
  };

  const handleValorChange = (valor: number) => {
    setValorAPagar(valor);
    setActivePaymentType("custom");
    setError("");
  };

  const handleNeedMoreBalance = () => {
    console.log("Need more balance");
  };

  const handleBack = () => {
    router.push("/tarjeta");
  };

  const handleContinue = () => {
    if (!selectedAccountId) {
      setAccountError("Por favor selecciona una cuenta origen");
      return;
    }

    if (valorAPagar <= 0) {
      setError("El valor a pagar debe ser mayor a 0");
      return;
    }

    if (valorAPagar > product.deudaTotal) {
      setError("El valor no puede exceder la deuda total");
      return;
    }

    const selectedAccount = mockTarjetaSourceAccounts.find(
      (a) => a.id === selectedAccountId,
    );

    if (!selectedAccount) {
      setAccountError("Cuenta origen no válida");
      return;
    }

    if (valorAPagar > selectedAccount.balance) {
      setAccountError("Saldo insuficiente en la cuenta seleccionada");
      return;
    }

    sessionStorage.setItem("tarjetaPaymentCardId", product.id);
    sessionStorage.setItem("tarjetaPaymentProduct", JSON.stringify(product));
    sessionStorage.setItem("tarjetaPaymentValor", String(valorAPagar));
    sessionStorage.setItem("tarjetaSourceAccountId", selectedAccount.id);
    sessionStorage.setItem(
      "tarjetaSourceAccountDisplay",
      selectedAccount.displayName,
    );

    router.push("/tarjeta/pagar/confirmacion");
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={BREADCRUMBS} />

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={1} steps={TARJETA_PAYMENT_STEPS} />
      </div>

      <TarjetaPaymentDetailsCard
        product={product}
        sourceAccounts={mockTarjetaSourceAccounts}
        selectedAccountId={selectedAccountId}
        valorAPagar={valorAPagar}
        activePaymentType={activePaymentType}
        hideBalances={hideBalances}
        accountError={accountError}
        error={error}
        onAccountChange={handleAccountChange}
        onPaymentTypeSelect={handlePaymentTypeSelect}
        onValorChange={handleValorChange}
        onNeedMoreBalance={handleNeedMoreBalance}
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

export default function PagarTarjetaDetallePage() {
  return (
    <Suspense fallback={null}>
      <PagarTarjetaDetalleContent />
    </Suspense>
  );
}
