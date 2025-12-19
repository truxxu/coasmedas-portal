'use client';

import { useState } from 'react';
import { Card, Divider } from '@/src/atoms';
import { DateRangeFilter } from '@/src/molecules';
import { TransactionItem } from '@/src/molecules';
import { Transaction } from '@/src/types/transaction';
import { getDateMonthsAgo, getTodayDate } from '@/src/utils/dates';

interface TransactionHistoryCardProps {
  title: string;
  subtitle?: string;
  transactions: Transaction[];
  onFilter: (startDate: string, endDate: string) => void;
  maxRangeMonths?: number;
  loading?: boolean;
  className?: string;
}

export function TransactionHistoryCard({
  title,
  subtitle = 'Últimos movimientos registrados.',
  transactions,
  onFilter,
  maxRangeMonths = 3,
  loading = false,
  className = '',
}: TransactionHistoryCardProps) {
  const [startDate, setStartDate] = useState(getDateMonthsAgo(maxRangeMonths));
  const [endDate, setEndDate] = useState(getTodayDate());

  const handleApply = () => {
    onFilter(startDate, endDate);
  };

  return (
    <Card className={`p-6 rounded-2xl ${className}`}>
      {/* Header with filter */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
        {/* Title and subtitle */}
        <div>
          <h2 className="text-[19px] font-bold text-brand-navy">{title}</h2>
          <p className="text-[14px] text-[#6A717F] mt-1">{subtitle}</p>
        </div>

        {/* Filter aligned right */}
        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          onApply={handleApply}
          maxRangeMonths={maxRangeMonths}
          disabled={loading}
        />
      </div>

      <Divider className="mb-6" />

      {/* Transactions list or empty state */}
      {loading ? (
        <div className="py-8 text-center">
          <p className="text-[16px] text-[#6A717F]">Cargando movimientos...</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-[16px] text-[#6A717F]">
            No se encontraron movimientos en el período seleccionado.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </div>
      )}

      <Divider className="mt-6" />
    </Card>
  );
}
