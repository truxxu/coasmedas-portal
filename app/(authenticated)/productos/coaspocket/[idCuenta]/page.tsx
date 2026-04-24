"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Breadcrumbs } from "@/src/molecules";
import { InfoBox } from "@/src/atoms";
import {
  CoaspocketCarousel,
  TransactionHistoryCard,
  DownloadReportsCard,
  CreatePocketModal,
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
  mapSavingsProducts,
  getDateMonthsAgo,
  getTodayDate,
  formatApiDate,
} from "@/src/utils";
import {
  getProductsSavings,
  getProductsPockets,
  getPocketsMovements,
  createPocket,
} from "@/services/products.service";
import { isAuthError } from "@/lib/api/errors";

export default function CoaspocketAccountPage() {
  const { user } = useUserContext();
  const router = useRouter();
  const params = useParams<{ idCuenta: string }>();
  const searchParams = useSearchParams();
  const idCuenta = decodeURIComponent(params?.idCuenta ?? "");
  const queryAccountName = searchParams?.get("name") ?? undefined;
  const queryAccountNumber = searchParams?.get("number") ?? undefined;
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const [products, setProducts] = useState<CoaspocketProduct[]>([]);
  const [accountInfo, setAccountInfo] = useState<{
    name: string;
    number: string;
  } | null>(null);
  const [selectedProduct, setSelectedProduct] =
    useState<CoaspocketProduct | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(
    mockCoaspocketAvailableMonths[0]?.value || "",
  );
  const [createOpen, setCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const fetchVersionRef = useRef(0);

  useEffect(() => {
    setWelcomeBar({ title: "Coaspocket", backHref: "/productos/coaspocket" });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const { documentType, documentNumber } = user ?? {};

  const fetchMovements = useCallback(
    async (idBolsillo: string, startDate: string, endDate: string) => {
      if (!documentType || !documentNumber || !idCuenta) return;

      const version = ++fetchVersionRef.current;
      try {
        setTransactionsLoading(true);
        const response = await getPocketsMovements({
          documentType,
          documentNumber,
          idCuenta,
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
    [documentType, documentNumber, idCuenta, router],
  );

  const fetchData = useCallback(async () => {
    if (!documentType || !documentNumber || !idCuenta) return;

    try {
      setLoading(true);
      setError(null);

      const [savingsApi, response] = await Promise.all([
        getProductsSavings({ documentType, documentNumber }),
        getProductsPockets({
          documentType,
          documentNumber,
          idCuenta,
          indPag: "1",
        }),
      ]);

      const normalizedId = idCuenta.trim();
      const account = mapSavingsProducts(savingsApi).find(
        (p) => String(p.id).trim() === normalizedId,
      );
      setAccountInfo(
        account ? { name: account.title, number: account.productNumber } : null,
      );

      const mapped = mapPockets(response.records ?? []);
      setProducts(mapped);
      const first = mapped[0] ?? null;
      setSelectedProduct(first);

      if (first) {
        await fetchMovements(first.id, getDateMonthsAgo(3), getTodayDate());
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
  }, [documentType, documentNumber, idCuenta, router, fetchMovements]);

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
      fetchMovements(product.id, getDateMonthsAgo(3), getTodayDate());
    },
    [fetchMovements],
  );

  const handleCreatePocket = () => {
    if (!idCuenta) return;
    setCreateError(null);
    setCreateOpen(true);
  };

  const handleCloseCreate = () => {
    if (creating) return;
    setCreateOpen(false);
    setCreateError(null);
  };

  const handleCreateSubmit = async (nombreBolsillo: string) => {
    if (!documentType || !documentNumber || !idCuenta) return;
    setCreating(true);
    setCreateError(null);
    try {
      await createPocket({
        documentType,
        documentNumber,
        idCuenta,
        nombreBolsillo,
      });
      setCreateOpen(false);
      await fetchData();
    } catch (err) {
      if (isAuthError(err)) {
        router.push("/login");
        return;
      }
      setCreateError("No fue posible crear el bolsillo. Intente nuevamente.");
    } finally {
      setCreating(false);
    }
  };

  const handleFilter = useCallback(
    async (startDate: string, endDate: string) => {
      if (!selectedProduct) return;
      await fetchMovements(selectedProduct.id, startDate, endDate);
    },
    [selectedProduct, fetchMovements],
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
        <Breadcrumbs items={["Inicio", "Productos", "Coaspocket"]} />
        <div className="bg-white rounded-2xl p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={fetchData}
              className="text-sm font-medium text-white bg-brand-navy px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              Reintentar
            </button>
            <button
              onClick={() => router.push("/productos/coaspocket")}
              className="text-sm font-medium text-brand-navy border border-brand-navy px-6 py-2 rounded-lg hover:bg-brand-light-blue transition-colors"
            >
              Volver
            </button>
          </div>
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
        title={"Mis Bolsillos Coas"}
        products={products}
        selectedProductId={selectedProduct?.id}
        onProductSelect={handleProductSelect}
        onCreatePocket={handleCreatePocket}
        accountName={accountInfo?.name ?? queryAccountName}
        accountNumber={
          (accountInfo?.number ?? queryAccountNumber)
            ? maskNumber(accountInfo?.number ?? queryAccountNumber ?? "")
            : undefined
        }
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

      <CreatePocketModal
        isOpen={createOpen}
        onClose={handleCloseCreate}
        onSubmit={handleCreateSubmit}
        submitting={creating}
        error={createError}
      />
    </div>
  );
}
