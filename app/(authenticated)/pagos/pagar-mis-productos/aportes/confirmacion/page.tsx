"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AportesConfirmationCard,
  ConfirmationPageShell,
} from "@/src/organisms";
import { useUIContext, useUserContext } from "@/src/contexts";
import {
  APORTES_PAYMENT_STEPS,
  PSE_PAYMENT_NAME,
} from "@/src/mocks/mockAportesPaymentData";
import {
  AportesConfirmationData,
  AportesPaymentBreakdown,
  AportesPaymentMethod,
} from "@/src/types/aportes-payment";
import { maskNumber } from "@/src/utils";
import {
  buildAccountReference,
  buildAportesTarget,
} from "@/lib/mappers/payments.mapper";
import { sendTransactionOtp } from "@/services/auth.service";
import type {
  SavingsAccountResponse,
  ContributionsResponse,
} from "@/types/api/products";

export default function ConfirmacionAportesPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { user } = useUserContext();

  const [confirmationData] = useState<AportesConfirmationData | null>(() => {
    if (typeof window === "undefined") return null;

    const accountId = sessionStorage.getItem("aportesPaymentAccountId");
    const valor = sessionStorage.getItem("aportesPaymentValor");
    const breakdownStr = sessionStorage.getItem("aportesPaymentBreakdown");
    const paymentMethod =
      (sessionStorage.getItem(
        "aportesPaymentMethod",
      ) as AportesPaymentMethod) || "account";

    if (!accountId || !valor || !breakdownStr) return null;

    const breakdown: AportesPaymentBreakdown = JSON.parse(breakdownStr);

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
        productoAPagar: breakdown.planName,
        numeroProducto: breakdown.productNumber,
        productoADebitar: PSE_PAYMENT_NAME,
        valorAPagar: parseInt(valor, 10),
        paymentMethod: "pse",
      };
    }

    const sourceAccountStr = sessionStorage.getItem("aportesSourceAccount");
    if (!sourceAccountStr) return null;

    const sourceAccount: SavingsAccountResponse = JSON.parse(sourceAccountStr);

    return {
      titular: userName,
      documento: maskedDoc,
      productoAPagar: breakdown.planName,
      numeroProducto: breakdown.productNumber,
      productoADebitar: sourceAccount.nombreProducto,
      valorAPagar: parseInt(valor, 10),
      paymentMethod: "account",
    };
  });

  const handleConfirm = async () => {
    if (!confirmationData) return;
    sessionStorage.setItem(
      "aportesPaymentConfirmation",
      JSON.stringify(confirmationData),
    );

    const sourceAccountStr = sessionStorage.getItem("aportesSourceAccount");
    const contributionsStr = sessionStorage.getItem("aportesContributions");
    const tipoProducto =
      sessionStorage.getItem("aportesTargetTipoProducto") || "";
    if (sourceAccountStr && contributionsStr) {
      const sourceAccount: SavingsAccountResponse =
        JSON.parse(sourceAccountStr);
      const contributions: ContributionsResponse = JSON.parse(contributionsStr);
      const txRequest = {
        origen: buildAccountReference(sourceAccount),
        cuentas: [
          buildAportesTarget(
            contributions,
            confirmationData.valorAPagar,
            tipoProducto,
          ),
        ],
        vlrPagoTotal: confirmationData.valorAPagar,
      };
      sessionStorage.setItem(
        "aportesTransactionRequest",
        JSON.stringify(txRequest),
      );
    }

    if (confirmationData.paymentMethod === "pse") {
      router.push("/pagos/pagar-mis-productos/aportes/pse-redirect");
    } else {
      if (!sourceAccountStr || !contributionsStr) {
        router.push("/pagos/pagar-mis-productos/aportes");
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
      router.push("/pagos/pagar-mis-productos/aportes/verificacion");
    }
  };

  return (
    <ConfirmationPageShell
      breadcrumbs={[
        "Inicio",
        "Pagos",
        "Pagar mis productos",
        "Pago de Aportes",
      ]}
      welcomeBarTitle="Pago de Aportes"
      welcomeBarBackHref="/pagos/pagar-mis-productos/aportes"
      fallbackPath="/pagos/pagar-mis-productos/aportes"
      steps={APORTES_PAYMENT_STEPS}
      hasData={!!confirmationData}
      confirmLabel="Guardar Cambios"
      volverStyle="ghost"
      breadcrumbsWrapped={false}
      noDataFallback={null}
      onBack={() => router.push("/pagos/pagar-mis-productos/aportes")}
      onConfirm={handleConfirm}
    >
      {confirmationData && (
        <AportesConfirmationCard
          confirmationData={confirmationData}
          hideBalances={hideBalances}
        />
      )}
    </ConfirmationPageShell>
  );
}
