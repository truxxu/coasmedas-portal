"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/src/molecules";
import { InfoBox } from "@/src/atoms";
import {
  CoaspocketCarousel,
  TransactionHistoryCard,
  DownloadReportsCard,
} from "@/src/organisms";
import { useWelcomeBar, useUserContext } from "@/src/contexts";
import { CoaspocketProduct } from "@/src/types";
import {
  mockCoaspocketTransactions,
  mockCoaspocketAvailableMonths,
  mockCoaspocketInfoText,
} from "@/src/mocks";
import { maskNumber, mapPockets } from "@/src/utils";
import {
  getProductsSavings,
  getProductsPockets,
} from "@/services/products.service";
import { isAuthError } from "@/lib/api/errors";

export default function CoaspocketPage() {
  const { user } = useUserContext();
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const [products, setProducts] = useState<CoaspocketProduct[]>([]);
  const [selectedProduct, setSelectedProduct] =
    useState<CoaspocketProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(
    mockCoaspocketAvailableMonths[0]?.value || "",
  );

  useEffect(() => {
    setWelcomeBar({ title: "Coaspocket", backHref: "/home" });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const { documentType, documentNumber } = user ?? {};

  const fetchData = useCallback(async () => {
    if (!documentType || !documentNumber) return;

    try {
      setLoading(true);
      setError(null);

      const params = { documentType, documentNumber };
      const savings = await getProductsSavings(params);

      if (savings.length === 0) {
        setProducts([]);
        setSelectedProduct(null);
        return;
      }

      const idCuenta = savings[0].idCuenta;
      const response = await getProductsPockets({
        ...params,
        idCuenta,
        indPag: "1",
      });

      const mapped = mapPockets(response.records ?? []);
      setProducts(mapped);
      setSelectedProduct(mapped[0] ?? null);
    } catch (err) {
      if (isAuthError(err)) {
        router.push("/login");
        return;
      }
      setError("No fue posible cargar la información. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  }, [documentType, documentNumber, router]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const transactionTitle = useMemo(() => {
    if (!selectedProduct) return "Consulta de Movimientos";
    return `Consulta de Movimientos - Bolsillo ${selectedProduct.title} (No.${maskNumber(selectedProduct.pocketNumber)})`;
  }, [selectedProduct]);

  const handleProductSelect = (product: CoaspocketProduct) => {
    setSelectedProduct(product);
    // TODO: Fetch transactions for selected product when endpoint available
  };

  const handleCreatePocket = () => {
    // TODO: Navigate to create pocket flow or open modal
  };

  const handleFilter = (startDate: string, endDate: string) => {
    // TODO: Call API to filter transactions when endpoint available
    console.log("Filtering:", {
      startDate,
      endDate,
      productId: selectedProduct?.id,
    });
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
  };

  const handleDownload = () => {
    // TODO: Trigger PDF download when endpoint available
    console.log("Downloading:", {
      month: selectedMonth,
      productId: selectedProduct?.id,
    });
  };

  if (error) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={["Inicio", "Productos", "Coaspocket"]} />
        <div className="bg-white rounded-2xl p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="text-sm font-medium text-white bg-brand-navy px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={["Inicio", "Productos", "Coaspocket"]} />
        <div className="bg-white rounded-2xl p-6 animate-pulse space-y-4">
          <div className="h-6 w-48 bg-gray-200 rounded" />
          <div className="h-32 w-full bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={["Inicio", "Productos", "Coaspocket"]} />

      <CoaspocketCarousel
        title="Resumen de Bolsillos"
        products={products}
        selectedProductId={selectedProduct?.id}
        onProductSelect={handleProductSelect}
        onCreatePocket={handleCreatePocket}
      />

      {products.length > 0 && selectedProduct && (
        <>
          <TransactionHistoryCard
            title={transactionTitle}
            subtitle="Últimos movimientos registrados."
            transactions={mockCoaspocketTransactions}
            onFilter={handleFilter}
            infoBox={<InfoBox>{mockCoaspocketInfoText}</InfoBox>}
          />

          <DownloadReportsCard
            availableMonths={mockCoaspocketAvailableMonths}
            selectedMonth={selectedMonth}
            onMonthChange={handleMonthChange}
            onDownload={handleDownload}
          />
        </>
      )}
    </div>
  );
}
