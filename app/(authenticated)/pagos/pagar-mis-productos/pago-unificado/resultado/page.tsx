"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { TransactionResultCard } from "@/src/organisms";
import { Button } from "@/src/atoms";
import { useWelcomeBar } from "@/src/contexts";
import { TransactionResult } from "@/src/types/payment";
import {
  PAYMENT_STEPS,
  mockTransactionResult,
  mockTransactionResultError,
} from "@/src/mocks/mockPaymentData";

export default function ResultadoPage() {
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const router = useRouter();

  const [result] = useState<TransactionResult | null>(() => {
    if (typeof window === 'undefined') return null;
    const paymentStatus = sessionStorage.getItem("paymentStatus");
    if (!paymentStatus) return null;
    return paymentStatus === "success" ? mockTransactionResult : mockTransactionResultError;
  });

  // Configure WelcomeBar on mount
  useEffect(() => {
    setWelcomeBar({
      title: "Pago Unificado",
      backHref: "/pagos/pagar-mis-productos",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  // Redirect if no payment status data
  useEffect(() => {
    if (!result) {
      router.push("/pagos/pagar-mis-productos/pago-unificado");
    }
  }, [result, router]);

  const handlePrint = () => {
    window.print();
  };

  const handleFinish = () => {
    // Clear all payment flow data
    sessionStorage.removeItem("paymentAccountId");
    sessionStorage.removeItem("paymentConfirmationData");
    sessionStorage.removeItem("paymentStatus");

    // Navigate back to payments menu
    router.push("/pagos/pagar-mis-productos");
  };

  if (!result) {
    return null;
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={["Inicio", "Pagos", "Pagar mis productos", "Pago Unificado"]}
      />

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={4} steps={PAYMENT_STEPS} />
      </div>

      <TransactionResultCard result={result} />

      <div className="flex justify-end gap-4">
        <Button variant="secondary" onClick={handlePrint}>
          Imprimir/Guardar
        </Button>
        <Button variant="primary" onClick={handleFinish}>
          Finalizar
        </Button>
      </div>
    </div>
  );
}
