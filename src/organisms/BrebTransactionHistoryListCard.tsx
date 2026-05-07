"use client";

import {
  BrebTransactionFilterBar,
  BrebTransactionListItem,
} from "@/src/molecules";
import { useHideBalances } from "@/src/hooks";
import type {
  BrebTransaction,
  BrebTransactionFilter,
} from "@/src/types/brebTransactionHistory";

interface BrebTransactionHistoryListCardProps {
  transactions: BrebTransaction[];
  filter: BrebTransactionFilter;
  onFilter: (filter: BrebTransactionFilter) => void;
  onSelectTransaction: (id: string) => void;
}

export function BrebTransactionHistoryListCard({
  transactions,
  filter,
  onFilter,
  onSelectTransaction,
}: BrebTransactionHistoryListCardProps) {
  const { hideBalances } = useHideBalances();
  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm">
      <h2 className="text-[21px] font-bold text-brand-navy mb-6">
        Historia de Transacciones Bre-B
      </h2>

      <BrebTransactionFilterBar initialFilter={filter} onFilter={onFilter} />

      <div className="mt-2 divide-y divide-brand-border">
        {transactions.length === 0 ? (
          <p className="py-10 text-center text-brand-gray-high text-[15px]">
            No hay transacciones que coincidan con los filtros seleccionados.
          </p>
        ) : (
          transactions.map((tx) => (
            <BrebTransactionListItem
              key={tx.id}
              transaction={tx}
              hideBalances={hideBalances}
              onClick={onSelectTransaction}
            />
          ))
        )}
      </div>
    </div>
  );
}
