"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/src/molecules";
import { BrebTransactionHistoryListCard } from "@/src/organisms";
import { useBrebPageHeader } from "@/src/hooks";
import { useUserContext } from "@/src/contexts";
import { listBrebTxs } from "@/services";
import {
  buildBrebDeviceContext,
  buildDateRangeParams,
  mapBrebTxMovementToUi,
} from "@/src/utils";
import { ApiError } from "@/lib/api/errors";
import type {
  BrebTransaction,
  BrebTransactionDateRange,
  BrebTransactionFilter,
} from "@/src/types/brebTransactionHistory";
import { BREB_HISTORIAL_CACHE_KEY } from "@/src/constants/brebSessionKeys";

export default function HistorialBrebPage() {
  const router = useRouter();
  useBrebPageHeader("Historial Bre-B", "/bre-b");
  const { user } = useUserContext();

  const [allTxs, setAllTxs] = useState<BrebTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<BrebTransactionFilter>({
    dateRange: "ultimos_30",
    type: "todos",
    status: "todos",
  });

  const fetchTxs = useCallback(
    async (range: BrebTransactionDateRange) => {
      if (!user) return;
      const ctx = buildBrebDeviceContext(user);
      const dateParams = buildDateRangeParams(range);
      const res = await listBrebTxs({
        documentType: ctx.documentType,
        documentNumber: ctx.documentNumber,
        ...dateParams,
      });
      const mapped = res.movements
        .map((m) => mapBrebTxMovementToUi(m, ctx.documentNumber))
        .filter((x): x is BrebTransaction => x !== null);
      setAllTxs(mapped);
      try {
        sessionStorage.setItem(
          BREB_HISTORIAL_CACHE_KEY,
          JSON.stringify(mapped),
        );
      } catch {
        // sessionStorage may be unavailable (private mode, quota); detail
        // page will fall back to refetching.
      }
    },
    [user],
  );

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      setLoading(true);
      setError(null);
      fetchTxs(filter.dateRange)
        .catch((e) => {
          if (cancelled) return;
          setError(
            e instanceof ApiError
              ? e.message
              : "No se pudo cargar el historial. Intente nuevamente.",
          );
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    });
    return () => {
      cancelled = true;
    };
  }, [user, filter.dateRange, fetchTxs]);

  const filteredTransactions = useMemo(
    () =>
      allTxs.filter((tx) => {
        if (filter.type !== "todos" && tx.type !== filter.type) return false;
        if (filter.status !== "todos" && tx.status !== filter.status)
          return false;
        return true;
      }),
    [allTxs, filter.type, filter.status],
  );

  const handleSelectTransaction = useCallback(
    (id: string) => {
      router.push(`/bre-b/historial/${encodeURIComponent(id)}`);
    },
    [router],
  );

  const handleBack = () => {
    router.push("/bre-b");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumbs items={["Inicio", "Bre-B", "Historial Bre-B"]} />
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-md border border-brand-error bg-brand-danger-bg px-4 py-3 text-sm text-brand-error"
        >
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center rounded-2xl bg-white p-12 text-sm text-brand-gray-high">
          Cargando historial...
        </div>
      ) : (
        <BrebTransactionHistoryListCard
          transactions={filteredTransactions}
          filter={filter}
          onFilter={setFilter}
          onSelectTransaction={handleSelectTransaction}
        />
      )}

      <div className="flex justify-start">
        <button
          onClick={handleBack}
          className="text-sm font-medium text-brand-teal-dark hover:underline"
        >
          Volver
        </button>
      </div>
    </div>
  );
}
