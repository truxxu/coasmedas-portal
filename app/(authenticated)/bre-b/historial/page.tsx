"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Breadcrumbs } from "@/src/molecules";
import { BrebTransactionHistoryListCard } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import { mockBrebTransactions } from "@/src/mocks/mockBrebTransactionHistoryData";
import type { BrebTransactionFilter } from "@/src/types/brebTransactionHistory";

const DATE_RANGE_DAYS: Record<
  BrebTransactionFilter["dateRange"],
  number | null
> = {
  ultimos_30: 30,
  ultimos_60: 60,
  ultimos_90: 90,
  todos: null,
};

const REFERENCE_NOW = new Date("2025-10-15T00:00:00");

export default function HistorialBrebPage() {
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const [filter, setFilter] = useState<BrebTransactionFilter>({
    dateRange: "ultimos_30",
    type: "todos",
    status: "todos",
  });

  useEffect(() => {
    setWelcomeBar({ title: "Historial Bre-B", backHref: "/bre-b" });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const filteredTransactions = useMemo(() => {
    const days = DATE_RANGE_DAYS[filter.dateRange];
    return mockBrebTransactions.filter((tx) => {
      if (filter.type !== "todos" && tx.type !== filter.type) return false;
      if (filter.status !== "todos" && tx.status !== filter.status)
        return false;
      if (days !== null) {
        const txDate = new Date(tx.date);
        const diffDays =
          (REFERENCE_NOW.getTime() - txDate.getTime()) / (1000 * 60 * 60 * 24);
        if (diffDays > days) return false;
      }
      return true;
    });
  }, [filter]);

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

      <BrebTransactionHistoryListCard
        transactions={filteredTransactions}
        filter={filter}
        onFilter={setFilter}
        onSelectTransaction={handleSelectTransaction}
      />

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
