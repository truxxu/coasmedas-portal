"use client";

import { KeyboardEvent } from "react";
import { useUIContext } from "@/src/contexts";
import { formatCurrency, maskCurrency, maskNumber } from "@/src/utils";

interface SavingsAccountSelectorRowProps {
  title: string;
  productNumber: string;
  balance: number;
  onClick: () => void;
}

export function SavingsAccountSelectorRow({
  title,
  productNumber,
  balance,
  onClick,
}: SavingsAccountSelectorRowProps) {
  const { hideBalances } = useUIContext();

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className="flex items-center justify-between rounded-lg border border-brand-border bg-white px-6 py-4 cursor-pointer hover:bg-brand-light-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary transition-colors"
    >
      <div className="flex flex-col">
        <span className="text-[18px] font-medium text-brand-navy leading-tight">
          {title}
        </span>
        <span className="text-[14px] text-brand-gray-high mt-1">
          {maskNumber(productNumber)}
        </span>
      </div>
      <div className="flex flex-col items-end">
        <span className="text-[14px] text-brand-gray-high">Saldo</span>
        <span className="text-[18px] font-medium text-brand-navy mt-1">
          {hideBalances ? maskCurrency() : formatCurrency(balance)}
        </span>
      </div>
    </div>
  );
}
