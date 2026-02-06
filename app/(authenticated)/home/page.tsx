"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  AccountSummaryCard,
  QuickAccessGrid,
  RecentTransactions,
} from "@/src/organisms";
import { useUserContext } from "@/src/contexts";
import { Account, Transaction } from "@/src/types";
import {
  mapBalances,
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

export default function HomePage() {
  const { user } = useUserContext();
  const router = useRouter();
  const [account, setAccount] = useState<Account | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      const params = {
        documentType: user.documentType,
        documentNumber: user.documentNumber,
      };

      // Fetch balances and savings in parallel
      const [balances, savings] = await Promise.all([
        getBalances(params),
        getProductsSavings(params),
      ]);

      console.log(balances, savings);

      // Map balances to accounts and pick the first one
      const accounts = mapBalances(balances);
      if (accounts.length > 0) {
        const firstAccount = accounts[0];
        // Enrich with savings data if available
        if (savings.length > 0) {
          const s = savings[0];
          firstAccount.accountNumber = s.numeroCuenta;
          firstAccount.maskedNumber = `****${s.numeroCuenta.slice(-4)}`;
          firstAccount.availableBalance =
            typeof s.saldoDisponible === "number"
              ? s.saldoDisponible
              : parseFloat(String(s.saldoDisponible)) || 0;
          firstAccount.totalBalance =
            typeof s.saldoTotal === "number"
              ? s.saldoTotal
              : parseFloat(String(s.saldoTotal)) || 0;
        }
        setAccount(firstAccount);
      }

      // Fetch movements for the first savings account
      if (savings.length > 0) {
        const s = savings[0];
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
  }, [user, router]);

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
      <AccountSummaryCard account={account ?? undefined} loading={loading} />
      <QuickAccessGrid />
      <RecentTransactions transactions={transactions} loading={loading} />
    </>
  );
}
