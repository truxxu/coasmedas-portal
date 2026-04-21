"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/src/molecules";
import {
  ProductCarousel,
  AhorrosInfoCard,
  TransactionHistoryCard,
  DownloadReportsCard,
} from "@/src/organisms";
import { useWelcomeBar, useUserContext } from "@/src/contexts";
import { SavingsProduct, Transaction } from "@/src/types";
import { mockAhorrosAvailableMonths } from "@/src/mocks";
import {
  maskNumber,
  mapSavingsProducts,
  mapMovements,
  getDateMonthsAgo,
  getTodayDate,
  formatApiDate,
  parseApiDate,
} from "@/src/utils";
import {
  getProductsSavings,
  getSavingsMovements,
} from "@/services/products.service";
import type {
  SavingsAccountResponse,
  SavingsMovementsResponse,
} from "@/types/api/products";
import { normalizeMoney } from "@/types/api/common";
import { isAuthError } from "@/lib/api/errors";

interface AhorroInfo {
  saldoDisponible: number;
  canjeTotal: number;
  remesas: number;
  numTransacciones: number;
  ultimoMovimiento: string;
}

const EMPTY_AHORRO_INFO: AhorroInfo = {
  saldoDisponible: 0,
  canjeTotal: 0,
  remesas: 0,
  numTransacciones: 0,
  ultimoMovimiento: "-",
};

function buildAhorroInfo(response: SavingsMovementsResponse): AhorroInfo {
  const parsedLast = parseApiDate(response.ultimoMovimiento);
  return {
    saldoDisponible: normalizeMoney(response.saldoDisponibleTemp),
    canjeTotal: normalizeMoney(response.saldoCanjeTemp),
    remesas: normalizeMoney(response.saldoRemesasTemp),
    numTransacciones: Number(response.nroMovimientos) || 0,
    ultimoMovimiento:
      !parsedLast || response.ultimoMovimiento === "19000101"
        ? "-"
        : parsedLast,
  };
}

export default function AhorrosPage() {
  const { user } = useUserContext();
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const [products, setProducts] = useState<SavingsProduct[]>([]);
  const [productMetaMap, setProductMetaMap] = useState<
    Record<string, { idCuenta: string }>
  >({});
  const [selectedProduct, setSelectedProduct] = useState<SavingsProduct | null>(
    null,
  );
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [ahorroInfo, setAhorroInfo] = useState<AhorroInfo>(EMPTY_AHORRO_INFO);
  const [loading, setLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(
    mockAhorrosAvailableMonths[0]?.value || "",
  );
  const fetchVersionRef = useRef(0);

  useEffect(() => {
    setWelcomeBar({ title: "Ahorros", backHref: "/home" });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const { documentType, documentNumber } = user ?? {};

  const fetchMovements = useCallback(
    async (idCuenta: string, startDate: string, endDate: string) => {
      if (!documentType || !documentNumber) return;

      const version = ++fetchVersionRef.current;
      try {
        setTransactionsLoading(true);
        const response = await getSavingsMovements({
          documentType,
          documentNumber,
          idCuenta,
          startDate: formatApiDate(startDate),
          endDate: formatApiDate(endDate),
          indPag: "1",
        });
        if (fetchVersionRef.current === version) {
          setTransactions(mapMovements(response.records));
          setAhorroInfo(buildAhorroInfo(response));
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

      const apiProducts = await getProductsSavings(params);
      const mapped = mapSavingsProducts(apiProducts);
      setProducts(mapped);

      const metaMap: Record<string, { idCuenta: string }> = {};
      apiProducts.forEach((p: SavingsAccountResponse) => {
        metaMap[p.idCuenta] = { idCuenta: p.idCuenta };
      });
      setProductMetaMap(metaMap);

      if (mapped.length > 0) {
        setSelectedProduct(mapped[0]);
        await fetchMovements(
          metaMap[mapped[0].id].idCuenta,
          getDateMonthsAgo(3),
          getTodayDate(),
        );
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

  const transactionTitle = useMemo(
    () =>
      selectedProduct
        ? `Consulta de Movimientos - Cuenta de Ahorros (${maskNumber(selectedProduct.productNumber)})`
        : "Consulta de Movimientos",
    [selectedProduct],
  );

  const handleProductSelect = useCallback(
    (product: SavingsProduct) => {
      setSelectedProduct(product);
      const meta = productMetaMap[product.id];
      if (meta) {
        fetchMovements(meta.idCuenta, getDateMonthsAgo(3), getTodayDate());
      }
    },
    [productMetaMap, fetchMovements],
  );

  const handleFilter = useCallback(
    async (startDate: string, endDate: string) => {
      if (!selectedProduct) return;
      const meta = productMetaMap[selectedProduct.id];
      if (!meta) return;
      await fetchMovements(meta.idCuenta, startDate, endDate);
    },
    [selectedProduct, productMetaMap, fetchMovements],
  );

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
  };

  const handleDownload = () => {
    console.log("Downloading:", {
      month: selectedMonth,
      productId: selectedProduct?.id,
    });
  };

  if (error) {
    return (
      <div className="space-y-6">
        <Breadcrumbs items={["Inicio", "Productos", "Ahorros"]} />
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
        <Breadcrumbs items={["Inicio", "Productos", "Ahorros"]} />
        <div className="bg-white rounded-2xl p-6 animate-pulse space-y-4">
          <div className="h-6 w-48 bg-gray-200 rounded" />
          <div className="h-32 w-full bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumbs items={["Inicio", "Productos", "Ahorros"]} />

      <ProductCarousel
        title="Resumen de Cuentas de Ahorro"
        products={products}
        selectedProductId={selectedProduct?.id || ""}
        onProductSelect={handleProductSelect}
      />

      {products.length > 0 && selectedProduct && (
        <>
          <AhorrosInfoCard
            saldoTotal={selectedProduct.balance}
            saldoDisponible={ahorroInfo.saldoDisponible}
            canjeLocal={0}
            canjeTotal={ahorroInfo.canjeTotal}
            remesas={ahorroInfo.remesas}
            numTransacciones={ahorroInfo.numTransacciones}
            ultimoMovimiento={ahorroInfo.ultimoMovimiento}
          />

          <TransactionHistoryCard
            title={transactionTitle}
            subtitle="Últimos movimientos registrados."
            transactions={transactions}
            onFilter={handleFilter}
            loading={transactionsLoading}
          />

          <DownloadReportsCard
            availableMonths={mockAhorrosAvailableMonths}
            selectedMonth={selectedMonth}
            onMonthChange={handleMonthChange}
            onDownload={handleDownload}
          />
        </>
      )}
    </div>
  );
}
