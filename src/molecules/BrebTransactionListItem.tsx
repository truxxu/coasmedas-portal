"use client";

import { memo } from "react";
import { ChevronIcon } from "@/src/atoms";
import { formatCurrency, maskCurrency } from "@/src/utils";
import { BREB_TRANSACTION_STATUS_LABELS } from "@/src/mocks/mockBrebTransactionHistoryData";
import type { BrebTransaction } from "@/src/types/brebTransactionHistory";

interface BrebTransactionListItemProps {
  transaction: BrebTransaction;
  hideBalances: boolean;
  onClick: (id: string) => void;
}

const STATUS_COLOR: Record<BrebTransaction["status"], string> = {
  exitosa: "text-brand-positive",
  fallida: "text-brand-error",
  revision_en_curso: "text-black",
};

function formatBrebDate(iso: string): string {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = String(d.getFullYear()).slice(-2);
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "p.m." : "a.m.";
  hours = hours % 12 || 12;
  return `${day}/${month}/${year}, ${hours}:${minutes} ${ampm}`;
}

function BrebTransactionListItemImpl({
  transaction,
  hideBalances,
  onClick,
}: BrebTransactionListItemProps) {
  const isCredit = transaction.sign === "credit";

  const amountStr = hideBalances
    ? maskCurrency()
    : `${isCredit ? "+ " : "- "}${formatCurrency(transaction.amount)}`;

  return (
    <button
      type="button"
      onClick={() => onClick(transaction.id)}
      className="w-full text-left flex items-center justify-between gap-4 py-5 hover:bg-brand-background/40 transition-colors"
    >
      <div className="flex-1 min-w-0">
        <p className="text-[18px] font-medium text-black truncate">
          {transaction.title}
        </p>
        <p className="text-[14px] font-normal text-black mt-1">
          {formatBrebDate(transaction.date)}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p
            className={`text-[15px] font-normal ${
              isCredit ? "text-brand-positive" : "text-brand-error"
            }`}
          >
            {amountStr}
          </p>
          <p
            className={`text-[14px] font-medium mt-1 ${
              STATUS_COLOR[transaction.status]
            }`}
          >
            {BREB_TRANSACTION_STATUS_LABELS[transaction.status]}
          </p>
        </div>
        <ChevronIcon direction="right" className="text-brand-gray-high" />
      </div>
    </button>
  );
}

export const BrebTransactionListItem = memo(BrebTransactionListItemImpl);
