"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  AccountSummaryCard,
  QuickAccessGrid,
  RecentTransactions,
} from "@/src/organisms";
import { useUserContext } from "@/src/contexts";
import { parseBalanceSummary, mapMovements } from "@/src/utils";
import {
  getBalances,
  getConsolidatedMovements,
} from "@/services/products.service";
import { isAuthError } from "@/lib/api/errors";
import { Transaction } from "@/src/types";

export default function HomePage() {
  const { user } = useUserContext();
  const { documentType, documentNumber } = user ?? {};
  const router = useRouter();
  const [consolidatedSavings, setConsolidatedSavings] = useState<number | null>(
    null,
  );
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!documentType || !documentNumber) return;

    try {
      setLoading(true);
      setError(null);

      const params = { documentType, documentNumber };

      const [balancesRaw, movementsRaw] = await Promise.all([
        getBalances(params),
        getConsolidatedMovements({ ...params, indPag: "1" }),
      ]);

      const summary = parseBalanceSummary(balancesRaw);
      setConsolidatedSavings(summary.ahorro);
      setTransactions(mapMovements(movementsRaw).slice(0, 5));
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

  if (error) {
    return (
      <>
        <div className="bg-white rounded-[5px] p-6 mb-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="text-sm font-medium text-white bg-brand-navy px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Reintentar
          </button>
        </div>
        <QuickAccessGrid />
      </>
    );
  }

  return (
    <>
      <AccountSummaryCard
        consolidatedSavings={consolidatedSavings ?? undefined}
        loading={loading}
      />
      <QuickAccessGrid />
      <RecentTransactions transactions={transactions} loading={loading} />
    </>
  );
}
