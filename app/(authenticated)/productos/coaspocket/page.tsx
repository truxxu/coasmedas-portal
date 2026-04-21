"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/src/molecules";
import { InfoBox } from "@/src/atoms";
import {
  CoaspocketCarousel,
  TransactionHistoryCard,
  DownloadReportsCard,
} from "@/src/organisms";
import { useWelcomeBar, useUserContext } from "@/src/contexts";
import { CoaspocketProduct, Transaction } from "@/src/types";
import {
  mockCoaspocketAvailableMonths,
  mockCoaspocketInfoText,
} from "@/src/mocks";
import {
  maskNumber,
  mapPockets,
  mapMovements,
  getDateMonthsAgo,
  getTodayDate,
  formatApiDate,
} from "@/src/utils";
import {
  getProductsSavings,
  getProductsPockets,
  getPocketsMovements,
} from "@/services/products.service";
import { isAuthError } from "@/lib/api/errors";

export default function CoaspocketPage() {
  const { user } = useUserContext();
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const [products, setProducts] = useState<CoaspocketProduct[]>([]);
  const [idCuenta, setIdCuenta] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] =
    useState<CoaspocketProduct | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(
    mockCoaspocketAvailableMonths[0]?.value || "",
  );
  const fetchVersionRef = useRef(0);

  useEffect(() => {
    setWelcomeBar({ title: "Coaspocket", backHref: "/home" });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const { documentType, documentNumber } = user ?? {};

  const fetchMovements = useCallback(
    async (
      accountId: string,
      idBolsillo: string,
      startDate: string,
      endDate: string,
    ) => {
      if (!documentType || !documentNumber) return;

      const version = ++fetchVersionRef.current;
      try {
        setTransactionsLoading(true);
        const response = await getPocketsMovements({
          documentType,
          documentNumber,
          idCuenta: accountId,
          idBolsillo,
          startDate: formatApiDate(startDate),
          endDate: formatApiDate(endDate),
          indPag: "1",
        });
        if (fetchVersionRef.current === version) {
          setTransactions(mapMovements(response.records ?? []));
        }
      } catch (err) {
        if (isAuthError(err)) {
          router.push("/login");
          return;
        }
      } finally {
        if (fetchVersionRef.current === version) {
          setTransactionsLoading(false);
        }
      }
    },
    [documentType, documentNumber, router],
  );

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
        setIdCuenta(null);
        return;
      }

      const accountId = savings[0].idCuenta;
      setIdCuenta(accountId);

      const response = await getProductsPockets({
        ...params,
        idCuenta: accountId,
        indPag: "1",
      });

      const mapped = mapPockets(response.records ?? []);
      setProducts(mapped);
      const first = mapped[0] ?? null;
      setSelectedProduct(first);

      if (first) {
        await fetchMovements(
          accountId,
          first.id,
          getDateMonthsAgo(3),
          getTodayDate(),
        );
      } else {
        setTransactions([]);
      }
    } catch (err) {
      if (isAuthError(err)) {
        router.push("/login");
        return;
      }
      setError("No fue posible cargar la información. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  }, [documentType, documentNumber, router, fetchMovements]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const transactionTitle = useMemo(() => {
    if (!selectedProduct) return "Consulta de Movimientos";
    return `Consulta de Movimientos - Bolsillo ${selectedProduct.title} (No.${maskNumber(selectedProduct.pocketNumber)})`;
  }, [selectedProduct]);

  const handleProductSelect = useCallback(
    (product: CoaspocketProduct) => {
      setSelectedProduct(product);
      if (idCuenta) {
        fetchMovements(
          idCuenta,
          product.id,
          getDateMonthsAgo(3),
          getTodayDate(),
        );
      }
    },
    [idCuenta, fetchMovements],
  );

  const handleCreatePocket = () => {
    // TODO: Navigate to create pocket flow or open modal
  };

  const handleFilter = useCallback(
    async (startDate: string, endDate: string) => {
      if (!selectedProduct || !idCuenta) return;
      await fetchMovements(idCuenta, selectedProduct.id, startDate, endDate);
    },
    [selectedProduct, idCuenta, fetchMovements],
  );

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
            transactions={transactions}
            onFilter={handleFilter}
            loading={transactionsLoading}
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
