"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ConfirmationPageShell,
  ObligacionConfirmationCard,
} from "@/src/organisms";
import { useUIContext, useUserContext } from "@/src/contexts";
import {
  OBLIGACION_PAYMENT_STEPS,
  OBLIGACION_PAYMENT_STEPS_ACCOUNT,
} from "@/src/mocks/mockObligacionPaymentData";
import {
  ObligacionConfirmationData,
  ObligacionPaymentProduct,
  ObligacionPaymentMethod,
} from "@/src/types/obligacion-payment";
import { maskNumber } from "@/src/utils";
import {
  buildAccountReference,
  buildCreditTarget,
} from "@/lib/mappers/payments.mapper";
import { sendTransactionOtp } from "@/services/auth.service";
import type {
  SavingsAccountResponse,
  CreditAccountResponse,
} from "@/types/api/products";

export default function ConfirmacionPage() {
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { user } = useUserContext();

  const [paymentMethod] = useState<ObligacionPaymentMethod>(() => {
    if (typeof window === "undefined") return "pse";
    const method = sessionStorage.getItem(
      "obligacionPaymentMethod",
    ) as ObligacionPaymentMethod;
    return method || "pse";
  });

  const [confirmationData] = useState<ObligacionConfirmationData | null>(() => {
    if (typeof window === "undefined") return null;

    const productStr = sessionStorage.getItem("obligacionPaymentProduct");
    const valor = sessionStorage.getItem("obligacionPaymentValor");
    const method = sessionStorage.getItem(
      "obligacionPaymentMethod",
    ) as ObligacionPaymentMethod;
    const sourceAccountDisplay = sessionStorage.getItem(
      "obligacionSourceAccountDisplay",
    );

    if (!productStr || !valor) return null;

    const product: ObligacionPaymentProduct = JSON.parse(productStr);

    const userName =
      user?.fullName ||
      `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
    const maskedDoc = user
      ? `${user.documentType} ${maskNumber(user.documentNumber)}`
      : "";

    const productoADebitar =
      method === "pse"
        ? "PSE (Pagos con otras entidades)"
        : sourceAccountDisplay?.split(" - ")[0] || "Cuenta de Ahorros";

    return {
      titular: userName,
      documento: maskedDoc,
      lineaCredito: product.name,
      fechaApertura: product.fechaApertura,
      saldoTotal: product.totalBalance,
      fechaLimitePago: product.paymentDeadline,
      valorEnMora: product.valorEnMora ?? 0,
      pagoMinimo: product.minimumPayment,
      pagoTotal: product.totalBalance,
      costoTransaccion: 0,
      productoADebitar,
      valorAPagar: parseInt(valor, 10),
    };
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (!confirmationData) return;
    setIsLoading(true);

    try {
      sessionStorage.setItem(
        "obligacionPaymentConfirmation",
        JSON.stringify(confirmationData),
      );

      const sourceAccountStr = sessionStorage.getItem(
        "obligacionSourceAccountApi",
      );
      const targetProductStr = sessionStorage.getItem(
        "obligacionTargetProductApi",
      );
      const tipoProducto =
        sessionStorage.getItem("obligacionTargetTipoProducto") || "";
      if (sourceAccountStr && targetProductStr) {
        const sourceAccount: SavingsAccountResponse =
          JSON.parse(sourceAccountStr);
        const targetProduct: CreditAccountResponse =
          JSON.parse(targetProductStr);
        const txRequest = {
          origen: buildAccountReference(sourceAccount),
          cuentas: [
            buildCreditTarget(
              targetProduct,
              confirmationData.valorAPagar,
              tipoProducto,
            ),
          ],
          vlrPagoTotal: confirmationData.valorAPagar,
        };
        sessionStorage.setItem(
          "obligacionTransactionRequest",
          JSON.stringify(txRequest),
        );
      }

      if (paymentMethod === "pse") {
        router.push("/pagos/pagar-mis-productos/obligaciones/pse");
      } else {
        if (!sourceAccountStr || !targetProductStr) {
          router.push("/pagos/pagar-mis-productos/obligaciones");
          setIsLoading(false);
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
        router.push("/pagos/pagar-mis-productos/obligaciones/codigo-sms");
      }
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  };

  const currentSteps =
    paymentMethod === "pse"
      ? OBLIGACION_PAYMENT_STEPS
      : OBLIGACION_PAYMENT_STEPS_ACCOUNT;

  return (
    <ConfirmationPageShell
      breadcrumbs={[
        "Inicio",
        "Pagos",
        "Pagar mis productos",
        "Pago de Obligaciones",
      ]}
      welcomeBarTitle="Pago de Obligaciones"
      welcomeBarBackHref="/pagos/pagar-mis-productos/obligaciones"
      fallbackPath="/pagos/pagar-mis-productos/obligaciones"
      steps={currentSteps}
      hasData={!!confirmationData}
      isSubmitting={isLoading}
      submittingLabel="Procesando..."
      volverColorClass="text-brand-navy"
      breadcrumbsWrapped={false}
      onBack={() => router.push("/pagos/pagar-mis-productos/obligaciones")}
      onConfirm={handleConfirm}
    >
      {confirmationData && (
        <ObligacionConfirmationCard
          confirmationData={confirmationData}
          hideBalances={hideBalances}
        />
      )}
    </ConfirmationPageShell>
  );
}
