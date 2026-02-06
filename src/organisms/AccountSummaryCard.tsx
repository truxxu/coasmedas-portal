'use client';

import Link from 'next/link';
import { Account } from '@/src/types';
import { formatCurrency, maskCurrency } from '@/src/utils';
import { useHideBalances } from '@/src/hooks';

export interface ProductBalances {
  aportes: number;
  ahorro: number;
  inversion: number;
  credito: number;
  proteccion: number;
}

interface AccountSummaryCardProps {
  account?: Account;
  balances?: ProductBalances;
  loading?: boolean;
}

const BALANCE_LABELS: { key: keyof ProductBalances; label: string }[] = [
  { key: 'ahorro', label: 'Ahorros' },
  { key: 'aportes', label: 'Aportes' },
  { key: 'credito', label: 'Crédito' },
  { key: 'inversion', label: 'Inversiones' },
  { key: 'proteccion', label: 'Protección' },
];

export function AccountSummaryCard({ account, balances, loading }: AccountSummaryCardProps) {
  const { hideBalances } = useHideBalances();

  if (loading) {
    return (
      <div className="bg-white rounded-[5px] p-6 mb-6 animate-pulse">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="h-6 w-40 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-28 bg-gray-200 rounded" />
          </div>
          <div className="text-right">
            <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
            <div className="h-8 w-36 bg-gray-200 rounded" />
          </div>
        </div>
        <hr className="border-brand-border my-4" />
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i}>
              <div className="h-3 w-16 bg-gray-200 rounded mb-1" />
              <div className="h-5 w-24 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!account && !balances) return null;

  const displayAvailable = hideBalances
    ? maskCurrency()
    : formatCurrency(account?.availableBalance ?? 0);
  const displayTotal = hideBalances
    ? maskCurrency()
    : formatCurrency(account?.totalBalance ?? 0);

  return (
    <div className="bg-white rounded-[5px] p-6 mb-6">
      {account && (
        <>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-brand-navy">Cuenta de Ahorros</h2>
              <p className="text-sm text-brand-gray-secondary">
                Ahorros {account.maskedNumber}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-brand-gray-secondary">Saldo disponible</p>
              <p className="text-2xl font-medium text-brand-navy">{displayAvailable}</p>
            </div>
          </div>

          <hr className="border-brand-border my-4" />

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <p className="text-sm text-brand-gray-secondary">
              Saldo total:{' '}
              <span className="font-bold text-brand-text-black">{displayTotal}</span>
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
              <Link
                href="/bolsillos"
                className="text-sm font-medium text-brand-text-black bg-brand-border px-4 py-2 rounded-full hover:bg-gray-300 transition-colors text-center flex-1 sm:flex-none"
              >
                Ver Bolsillos
              </Link>
              <Link
                href="/movimientos"
                className="text-sm font-medium text-brand-text-black bg-brand-border px-4 py-2 rounded-full hover:bg-gray-300 transition-colors text-center flex-1 sm:flex-none"
              >
                Ver Movimientos
              </Link>
            </div>
          </div>
        </>
      )}

      {balances && (
        <>
          {account && <hr className="border-brand-border my-4" />}
          <p className="text-sm font-semibold text-brand-navy mb-3">Resumen de productos</p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {BALANCE_LABELS.map(({ key, label }) => (
              <div key={key}>
                <p className="text-xs text-brand-gray-secondary">{label}</p>
                <p className="text-sm font-bold text-brand-text-black">
                  {hideBalances ? maskCurrency() : formatCurrency(balances[key])}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
