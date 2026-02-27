"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { ObligacionConfirmationCard } from "@/src/organisms";
import { useUIContext } from "@/src/contexts/UIContext";
import { useWelcomeBar, useUserContext } from "@/src/contexts";
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
import { buildAccountReference, buildCreditTarget } from "@/lib/mappers/payments.mapper";
import type { SavingsAccountResponse, CreditAccountResponse } from "@/types/api/products";

export default function ConfirmacionPage() {
  const { clearWelcomeBar, setWelcomeBar } = useWelcomeBar();
  const router = useRouter();
  const { hideBalances } = useUIContext();
  const { user } = useUserContext();

  const [paymentMethod] = useState<ObligacionPaymentMethod>(() => {
    if (typeof window === "undefined") return "pse";
    const method = sessionStorage.getItem("obligacionPaymentMethod") as ObligacionPaymentMethod;
    return method || "pse";
  });

  const [confirmationData] =
    useState<ObligacionConfirmationData | null>(() => {
      if (typeof window === "undefined") return null;

      const productStr = sessionStorage.getItem("obligacionPaymentProduct");
      const valor = sessionStorage.getItem("obligacionPaymentValor");
      const method = sessionStorage.getItem("obligacionPaymentMethod") as ObligacionPaymentMethod;
      const sourceAccountDisplay = sessionStorage.getItem("obligacionSourceAccountDisplay");

      if (!productStr || !valor) {
        return null;
      }

      const product: ObligacionPaymentProduct = JSON.parse(productStr);

      const userName = user?.fullName || `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();
      const maskedDoc = user
        ? `${user.documentType} ${maskNumber(user.documentNumber)}`
        : "";

      const productoADebitar = method === "pse"
        ? "PSE (Pagos con otras entidades)"
        : (sourceAccountDisplay?.split(" - ")[0] || "Cuenta de Ahorros");

      return {
        titular: userName,
        documento: maskedDoc,
        productoAPagar: product.name,
        numeroProducto: product.productNumber,
        productoADebitar,
        valorAPagar: parseInt(valor, 10),
      };
    });

  const [isLoading, setIsLoading] = useState(false);

  const breadcrumbItems = [
    "Inicio",
    "Pagos",
    "Pagar mis productos",
    "Pago de Obligaciones",
  ];

  useEffect(() => {
    setWelcomeBar({
      title: "Pago de Obligaciones",
      backHref: "/pagos/pagar-mis-productos/obligaciones",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    if (!confirmationData) {
      router.push("/pagos/pagar-mis-productos/obligaciones");
    }
  }, [confirmationData, router]);

  const handleConfirm = async () => {
    if (!confirmationData) return;

    setIsLoading(true);

    try {
      sessionStorage.setItem(
        "obligacionPaymentConfirmation",
        JSON.stringify(confirmationData)
      );

      // Pre-build transaction request
      const sourceAccountStr = sessionStorage.getItem("obligacionSourceAccountApi");
      const targetProductStr = sessionStorage.getItem("obligacionTargetProductApi");
      if (sourceAccountStr && targetProductStr) {
        const sourceAccount: SavingsAccountResponse = JSON.parse(sourceAccountStr);
        const targetProduct: CreditAccountResponse = JSON.parse(targetProductStr);
        const txRequest = {
          origen: buildAccountReference(sourceAccount),
          cuentas: [buildCreditTarget(targetProduct, confirmationData.valorAPagar)],
          vlrPagoTotal: confirmationData.valorAPagar,
        };
        sessionStorage.setItem("obligacionTransactionRequest", JSON.stringify(txRequest));
      }

      if (paymentMethod === "pse") {
        router.push("/pagos/pagar-mis-productos/obligaciones/pse");
      } else {
        router.push("/pagos/pagar-mis-productos/obligaciones/codigo-sms");
      }
    } catch (error) {
      console.error("Error:", error);
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/pagos/pagar-mis-productos/obligaciones");
  };

  if (!confirmationData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-[15px] text-gray-600">Cargando...</div>
      </div>
    );
  }

  const currentSteps = paymentMethod === "pse"
    ? OBLIGACION_PAYMENT_STEPS
    : OBLIGACION_PAYMENT_STEPS_ACCOUNT;

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={2} steps={currentSteps} />
      </div>

      <ObligacionConfirmationCard
        confirmationData={confirmationData}
        hideBalances={hideBalances}
      />

      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          disabled={isLoading}
          className="text-sm font-medium text-brand-navy hover:underline disabled:opacity-50"
        >
          Volver
        </button>
        <Button variant="primary" onClick={handleConfirm} disabled={isLoading}>
          {isLoading ? "Procesando..." : "Confirmar Pago"}
        </Button>
      </div>
    </div>
  );
}
