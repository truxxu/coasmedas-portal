"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { PaymentConfirmationCard } from "@/src/organisms";
import { Button } from "@/src/atoms";
import { useUIContext } from "@/src/contexts/UIContext";
import { useWelcomeBar, useUserContext } from "@/src/contexts";
import { PaymentConfirmationData, PendingPayments } from "@/src/types/payment";
import { PAYMENT_STEPS } from "@/src/mocks/mockPaymentData";
import { maskNumber } from "@/src/utils";
import { buildAccountReference, buildUnifiedTargets } from "@/lib/mappers/payments.mapper";
import { sendTransactionOtp } from "@/services/auth.service";
import type { SavingsAccountResponse } from "@/types/api/products";
import type { PaymentProduct } from "@/types/api/payments";

export default function ConfirmacionPage() {
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { user } = useUserContext();

  const [confirmationData] =
    useState<PaymentConfirmationData | null>(() => {
      if (typeof window === "undefined") return null;

      const accountId = sessionStorage.getItem("paymentAccountId");
      const paymentMethod = sessionStorage.getItem("paymentMethod");
      const pendingStr = sessionStorage.getItem("unifiedPendingPayments");

      if (!accountId || !pendingStr) return null;

      const pending: PendingPayments = JSON.parse(pendingStr);

      const userName = user?.fullName || `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
      const maskedDoc = user
        ? `${user.documentType} ${maskNumber(user.documentNumber)}`
        : "";

      if (paymentMethod === "pse") {
        return {
          titular: userName,
          documento: maskedDoc,
          aportes: pending.aportes,
          obligaciones: pending.obligaciones,
          proteccion: pending.proteccion,
          debitAccount: "PSE (Pagos con otras entidades)",
          debitAccountNumber: "",
          totalAmount: pending.total,
        };
      }

      const sourceAccountStr = sessionStorage.getItem("unifiedSourceAccountApi");
      if (!sourceAccountStr) return null;

      const sourceAccount: SavingsAccountResponse = JSON.parse(sourceAccountStr);

      return {
        titular: userName,
        documento: maskedDoc,
        aportes: pending.aportes,
        obligaciones: pending.obligaciones,
        proteccion: pending.proteccion,
        debitAccount: sourceAccount.nombreProducto,
        debitAccountNumber: maskNumber(sourceAccount.numeroCuenta),
        totalAmount: pending.total,
      };
    });

  useEffect(() => {
    setWelcomeBar({
      title: "Pago Unificado",
      backHref: "/pagos/pagar-mis-productos",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    if (!confirmationData) {
      router.push("/pagos/pagar-mis-productos/pago-unificado");
    }
  }, [confirmationData, router]);

  const handleConfirm = async () => {
    if (!confirmationData) return;

    sessionStorage.setItem(
      "paymentConfirmationData",
      JSON.stringify(confirmationData)
    );

    // Pre-build transaction request
    const sourceAccountStr = sessionStorage.getItem("unifiedSourceAccountApi");
    const productsStr = sessionStorage.getItem("unifiedPaymentProducts");
    if (sourceAccountStr && productsStr) {
      const sourceAccount: SavingsAccountResponse = JSON.parse(sourceAccountStr);
      const products: PaymentProduct[] = JSON.parse(productsStr);
      const txRequest = {
        origen: buildAccountReference(sourceAccount),
        cuentas: buildUnifiedTargets(products),
        vlrPagoTotal: confirmationData.totalAmount,
      };
      sessionStorage.setItem("unifiedTransactionRequest", JSON.stringify(txRequest));
    }

    const paymentMethod = sessionStorage.getItem("paymentMethod");
    if (paymentMethod === "pse") {
      router.push("/pagos/pagar-mis-productos/pago-unificado/pse");
    } else {
      if (!sourceAccountStr || !productsStr) {
        router.push("/pagos/pagar-mis-productos/pago-unificado");
        return;
      }
      const { documentType, documentNumber } = user ?? {};
      if (documentType && documentNumber) {
        await sendTransactionOtp({ documentType, documentNumber, trnType: "PaymentInternal" });
      }
      router.push("/pagos/pagar-mis-productos/pago-unificado/verificacion");
    }
  };

  const handleBack = () => {
    router.push("/pagos/pagar-mis-productos/pago-unificado");
  };

  if (!confirmationData) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={["Inicio", "Pagos", "Pagar mis productos", "Pago Unificado"]}
      />

      <div className="-mx-8 bg-white shadow-sm">
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
