"use client";

import { useEffect, useState } from "react";
import { Breadcrumbs } from "@/src/molecules";
import {
  TarjetaCreditoCarousel,
  TarjetaCreditoDetailsCard,
  TransactionHistoryCard,
  DownloadReportsCard,
} from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import { TarjetaCreditoProduct } from "@/src/types/tarjetaCredito";
import {
  mockTarjetaCreditoProducts,
  mockTarjetaCreditoTransactions,
  mockTarjetaCreditoAvailableMonths,
} from "@/src/mocks";

export default function TarjetaCreditoPage() {
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const [products] = useState<TarjetaCreditoProduct[]>(
    mockTarjetaCreditoProducts,
  );
  const [selectedProduct, setSelectedProduct] =
    useState<TarjetaCreditoProduct | null>(products[0] ?? null);
  const [transactions] = useState(mockTarjetaCreditoTransactions);
  const [selectedMonth, setSelectedMonth] = useState(
    mockTarjetaCreditoAvailableMonths[0]?.value || "",
  );

  useEffect(() => {
    setWelcomeBar({ title: "Tarjeta de Crédito", backHref: "/home" });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const transactionTitle = selectedProduct
    ? `Consulta de Movimientos - ${selectedProduct.title} (***${selectedProduct.last4})`
    : "Consulta de Movimientos";

  const handleDownload = () => {
    console.log("Downloading:", {
      month: selectedMonth,
      productId: selectedProduct?.id,
    });
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={["Inicio", "Tarjeta Crédito"]} />

      <TarjetaCreditoCarousel
        title="Resumen de Tarjetas de Crédito"
        products={products}
        selectedProductId={selectedProduct?.id || ""}
        onProductSelect={setSelectedProduct}
      />

      {selectedProduct && (
        <>
          <TarjetaCreditoDetailsCard product={selectedProduct} />

          <TransactionHistoryCard
            title={transactionTitle}
            subtitle="Últimos movimientos registrados."
            transactions={transactions}
            onFilter={() => {}}
          />

          <DownloadReportsCard
            availableMonths={mockTarjetaCreditoAvailableMonths}
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
            onDownload={handleDownload}
          />
        </>
      )}
    </div>
  );
}
