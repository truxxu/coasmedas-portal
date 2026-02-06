"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  AccountSummaryCard,
  QuickAccessGrid,
  RecentTransactions,
} from "@/src/organisms";
import type { ProductBalances } from "@/src/organisms/AccountSummaryCard";
import { useUserContext } from "@/src/contexts";
import { Account, Transaction } from "@/src/types";
import {
  parseBalanceSummary,
  mapMovements,
  getDateMonthsAgo,
  formatApiDate,
} from "@/src/utils";
import {
  getBalances,
  getProductsSavings,
  getMovements,
} from "@/services/products.service";
import { isAuthError } from "@/lib/api/errors";
import { normalizeMoney } from "@/types/api/common";

export default function HomePage() {
  const { user } = useUserContext();
  const { documentType, documentNumber } = user ?? {};
  const router = useRouter();
  const [account, setAccount] = useState<Account | null>(null);
  const [balances, setBalances] = useState<ProductBalances | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!documentType || !documentNumber) return;

    try {
      setLoading(true);
      setError(null);

      const params = { documentType, documentNumber };

      // Fetch balances and savings in parallel
      const [balancesRaw, savings] = await Promise.all([
        getBalances(params),
        getProductsSavings(params),
      ]);

      // Parse consolidated balance summary
      const summary = parseBalanceSummary(balancesRaw);
      setBalances(summary);

      // Build savings account from savings endpoint data
      if (savings.length > 0) {
        const s = savings[0];
        const available = normalizeMoney(s.saldoDisponible);
        const total = normalizeMoney(s.saldoTotal);

        setAccount({
          accountNumber: s.numeroCuenta,
          accountType: "AHORROS",
          productCode: s.codigoProductoCobis,
          availableBalance: available,
          totalBalance: total,
          maskedNumber: `****${s.numeroCuenta.slice(-4)}`,
        });

        // Fetch movements for the first savings account
        const movements = await getMovements({
          ...params,
          codigoProductoCobis: s.codigoProductoCobis,
          idCuenta: s.idCuenta,
          fechaConsulta: formatApiDate(getDateMonthsAgo(3)),
        });
        setTransactions(mapMovements(movements));
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
        account={account ?? undefined}
        balances={balances ?? undefined}
        loading={loading}
      />
      <QuickAccessGrid />
      <RecentTransactions transactions={transactions} loading={loading} />
    </>
  );
}
