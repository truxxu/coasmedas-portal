'use client';

import Link from 'next/link';
import { Account } from '@/src/types';
import { formatCurrency, maskCurrency } from '@/src/utils';
import { useHideBalances } from '@/src/hooks';

// Mock data for development
const mockAccount: Account = {
  accountNumber: '1234567890',
  accountType: 'AHORROS',
  productCode: '001',
  availableBalance: 8730500,
  totalBalance: 9150000,
  maskedNumber: '****4428',
};

export function AccountSummaryCard() {
  const { hideBalances } = useHideBalances();
  const account = mockAccount;

  const displayAvailable = hideBalances ? maskCurrency() : formatCurrency(account.availableBalance);
  const displayTotal = hideBalances ? maskCurrency() : formatCurrency(account.totalBalance);

  return (
    <div className="bg-white rounded-[5px] p-6 mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold text-brand-navy">Cuenta de Ahorros</h2>
          <p className="text-sm text-brand-gray-secondary">Ahorros {account.maskedNumber}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-brand-gray-secondary">Saldo disponible</p>
          <p className="text-2xl font-medium text-brand-navy">{displayAvailable}</p>
        </div>
      </div>

      <hr className="border-brand-border my-4" />

      <div className="flex justify-between items-center">
        <p className="text-sm text-brand-gray-secondary">
          Saldo total: <span className="font-bold text-brand-text-black">{displayTotal}</span>
        </p>
        <div className="flex gap-3">
          <Link
            href="/bolsillos"
            className="text-sm font-medium text-brand-text-black bg-[#E4E6EA] px-4 py-2 rounded-full hover:bg-gray-300 transition-colors"
          >
            Ver Bolsillos
          </Link>
          <Link
            href="/movimientos"
            className="text-sm font-medium text-brand-text-black bg-[#E4E6EA] px-4 py-2 rounded-full hover:bg-gray-300 transition-colors"
          >
            Ver Movimientos
          </Link>
        </div>
      </div>
    </div>
  );
}
