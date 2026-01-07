'use client';

import { formatCurrency, maskCurrency } from '@/src/utils';
import { useHideBalances } from '@/src/hooks';
import { Transaction } from '@/src/types';

interface TransactionItemProps {
  transaction: Transaction;
  showDivider?: boolean;
}

export function TransactionItem({ transaction, showDivider = true }: TransactionItemProps) {
  const { hideBalances } = useHideBalances();
  const isPositive = transaction.amount > 0;

  const displayAmount = hideBalances
    ? maskCurrency()
    : `${isPositive ? '+' : '-'} ${formatCurrency(Math.abs(transaction.amount))}`;

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <div>
          <p className="font-bold text-brand-text-black">{transaction.description}</p>
          <p className="text-sm text-brand-gray-secondary">{transaction.date}</p>
        </div>
        <p className={`font-medium ${isPositive ? 'text-brand-positive' : 'text-red-600'}`}>
          {displayAmount}
        </p>
      </div>
      {showDivider && <hr className="border-brand-border" />}
    </div>
  );
}
