"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { ObligacionDetailsCard } from "@/src/organisms";
import { useUIContext } from "@/src/contexts/UIContext";
import { useWelcomeBar } from "@/src/contexts";
import { PaymentType } from "@/src/types/obligacion-payment";
import {
  mockObligacionProducts,
  OBLIGACION_PAYMENT_STEPS,
} from "@/src/mocks/mockObligacionPaymentData";

export default function PagoObligacionesPage() {
  const { clearWelcomeBar, setWelcomeBar } = useWelcomeBar();
  const router = useRouter();
  const { hideBalances } = useUIContext();

  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [valorAPagar, setValorAPagar] = useState<number>(0);
  const [activePaymentType, setActivePaymentType] =
    useState<PaymentType | null>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setWelcomeBar({
      title: "Obligaciones",
      backHref: "/home",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const breadcrumbItems = ["Inicio", "Pagos", "Pago de Obligaciones"];

  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId);
    setError("");
    // Reset payment amount when product changes
    const product = mockObligacionProducts.find((p) => p.id === productId);
    if (product) {
      setValorAPagar(product.minimumPayment);
      setActivePaymentType("minimum");
    }
  };

  const handlePaymentTypeSelect = (type: PaymentType) => {
    const product = mockObligacionProducts.find(
      (p) => p.id === selectedProductId
    );
    if (!product) return;

    setActivePaymentType(type);
    if (type === "minimum") {
      setValorAPagar(product.minimumPayment);
    } else {
      setValorAPagar(product.totalBalance);
    }
  };

  const handleValorChange = (valor: number) => {
    setValorAPagar(valor);
    setActivePaymentType(null); // Clear active button when manually editing
    setError("");
  };

  const handleContinue = () => {
    // Validation
    if (!selectedProductId) {
      setError("Por favor selecciona un producto");
      return;
    }

    const selectedProduct = mockObligacionProducts.find(
      (p) => p.id === selectedProductId
    );

    if (!selectedProduct) {
      setError("Producto no encontrado");
      return;
    }

    if (valorAPagar <= 0) {
      setError("El valor a pagar debe ser mayor a 0");
      return;
    }

    if (valorAPagar < selectedProduct.minimumPayment) {
      setError(
        `El valor mínimo de pago es ${selectedProduct.minimumPayment.toLocaleString(
          "es-CO"
        )}`
      );
      return;
    }

    if (valorAPagar > selectedProduct.totalBalance) {
      setError("El valor no puede exceder el saldo total");
      return;
    }

    // Store data in sessionStorage
    sessionStorage.setItem("obligacionPaymentProductId", selectedProductId);
    sessionStorage.setItem("obligacionPaymentValor", valorAPagar.toString());
    sessionStorage.setItem(
      "obligacionPaymentProduct",
      JSON.stringify(selectedProduct)
    );

    router.push("/pagos/pago-obligaciones/confirmacion");
  };

  const handleNeedMoreBalance = () => {
    // TODO: Open modal or navigate to transfer page
    console.log("Need more balance");
  };

  const handleBack = () => {
    router.push("/pagos/pagar-mis-productos");
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbItems} />

      <Stepper currentStep={1} steps={OBLIGACION_PAYMENT_STEPS} />

      <ObligacionDetailsCard
        products={mockObligacionProducts}
        selectedProductId={selectedProductId}
        valorAPagar={valorAPagar}
        activePaymentType={activePaymentType}
        onProductSelect={handleProductSelect}
        onValorChange={handleValorChange}
        onPaymentTypeSelect={handlePaymentTypeSelect}
        onNeedMoreBalance={handleNeedMoreBalance}
        hideBalances={hideBalances}
      />

      {error && (
        <div className="text-sm text-[#FF0D00] text-center">{error}</div>
      )}

      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          className="text-sm font-medium text-[#1D4E8F] hover:underline"
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
