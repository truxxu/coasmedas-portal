"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ConfirmationPageShell,
  PaymentConfirmationCard,
} from "@/src/organisms";
import { useUIContext, useUserContext } from "@/src/contexts";
import { PaymentConfirmationData, PendingPayments } from "@/src/types/payment";
import { PAYMENT_STEPS } from "@/src/mocks/mockPaymentData";
import { maskNumber } from "@/src/utils";
import {
  buildAccountReference,
  buildUnifiedTargets,
} from "@/lib/mappers/payments.mapper";
import { sendTransactionOtp } from "@/services/auth.service";
import type { SavingsAccountResponse } from "@/types/api/products";
import type { PaymentProduct } from "@/types/api/payments";

export default function ConfirmacionPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { user } = useUserContext();

  const [confirmationData] = useState<PaymentConfirmationData | null>(() => {
    if (typeof window === "undefined") return null;

    const accountId = sessionStorage.getItem("paymentAccountId");
    const paymentMethod = sessionStorage.getItem("paymentMethod");
    const pendingStr = sessionStorage.getItem("unifiedPendingPayments");

    if (!accountId || !pendingStr) return null;

    const pending: PendingPayments = JSON.parse(pendingStr);

    const userName =
      user?.fullName ||
      `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
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

  const handleConfirm = async () => {
    if (!confirmationData) return;

    sessionStorage.setItem(
      "paymentConfirmationData",
      JSON.stringify(confirmationData),
    );

    const sourceAccountStr = sessionStorage.getItem("unifiedSourceAccountApi");
    const productsStr = sessionStorage.getItem("unifiedPaymentProducts");
    if (sourceAccountStr && productsStr) {
      const sourceAccount: SavingsAccountResponse =
        JSON.parse(sourceAccountStr);
      const products: PaymentProduct[] = JSON.parse(productsStr);
      const txRequest = {
        origen: buildAccountReference(sourceAccount),
        cuentas: buildUnifiedTargets(products),
        vlrPagoTotal: confirmationData.totalAmount,
      };
      sessionStorage.setItem(
        "unifiedTransactionRequest",
        JSON.stringify(txRequest),
      );
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
        await sendTransactionOtp({
          documentType,
          documentNumber,
          trnType: "PaymentInternal",
        });
      }
      router.push("/pagos/pagar-mis-productos/pago-unificado/verificacion");
    }
  };

  return (
    <ConfirmationPageShell
      breadcrumbs={["Inicio", "Pagos", "Pagar mis productos", "Pago Unificado"]}
      welcomeBarTitle="Pago Unificado"
      welcomeBarBackHref="/pagos/pagar-mis-productos"
      fallbackPath="/pagos/pagar-mis-productos/pago-unificado"
      steps={PAYMENT_STEPS}
      hasData={!!confirmationData}
      volverStyle="ghost"
      breadcrumbsWrapped={false}
      noDataFallback={null}
      onBack={() => router.push("/pagos/pagar-mis-productos/pago-unificado")}
      onConfirm={handleConfirm}
    >
      {confirmationData && (
        <PaymentConfirmationCard
          confirmationData={confirmationData}
          hideBalances={hideBalances}
        />
      )}
    </ConfirmationPageShell>
  );
}
