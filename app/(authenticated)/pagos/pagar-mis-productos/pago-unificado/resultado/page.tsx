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

  const [result, setResult] = useState<TransactionResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Configure WelcomeBar on mount
  useEffect(() => {
    setWelcomeBar({
      title: "Pago Unificado",
      backHref: "/pagos/pagar-mis-productos",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  // Load result from sessionStorage
  useEffect(() => {
    const paymentStatus = sessionStorage.getItem("paymentStatus");

    if (!paymentStatus) {
      // No data, redirect to start
      router.push("/pagos/pagar-mis-productos/pago-unificado");
      return;
    }

    // Set result based on status
    if (paymentStatus === "success") {
      setResult(mockTransactionResult);
    } else {
      setResult(mockTransactionResultError);
    }

    setIsLoading(false);
  }, [router]);

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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-brand-gray-high">Cargando...</div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Breadcrumbs
          items={["Inicio", "Pagos", "Pagar mis productos", "Pago Unificado"]}
        />
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
