'use client';

import { formatCurrency, maskCurrency } from '@/src/utils';
import { useHideBalances } from '@/src/hooks';

interface AccountSummaryCardProps {
  consolidatedSavings?: number;
  loading?: boolean;
}

export function AccountSummaryCard({ consolidatedSavings, loading }: AccountSummaryCardProps) {
  const { hideBalances } = useHideBalances();

  if (loading) {
    return (
      <div className="bg-white rounded-[5px] p-6 mb-6 animate-pulse">
        <div className="flex justify-between items-center">
          <div>
            <div className="h-5 w-48 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-56 bg-gray-200 rounded" />
          </div>
          <div className="text-right">
            <div className="h-4 w-20 bg-gray-200 rounded mb-2" />
            <div className="h-8 w-36 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (consolidatedSavings == null) return null;

  const displayBalance = hideBalances
    ? maskCurrency()
    : formatCurrency(consolidatedSavings);

  return (
    <div className="bg-white rounded-[5px] p-6 mb-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[19px] font-bold text-brand-navy">Consolidado de Ahorros</h2>
          <p className="text-sm text-brand-gray-secondary">Total de tus cuentas de ahorro</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-brand-gray-secondary">Saldo Total</p>
          <p className="text-2xl font-medium text-brand-navy">{displayBalance}</p>
        </div>
      </div>
    </div>
  );
}
