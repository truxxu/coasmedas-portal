import React from 'react';
import { formatCurrency, maskCurrency } from '@/src/utils';

interface PaymentSummaryRowProps {
  label: string;
  amount: number;
  variant?: 'default' | 'total';
  hideAmount?: boolean;
}

export const PaymentSummaryRow: React.FC<PaymentSummaryRowProps> = ({
  label,
  amount,
  variant = 'default',
  hideAmount = false,
}) => {
  const isTotal = variant === 'total';

  return (
    <div
      className={`flex justify-between items-center ${
        isTotal ? 'pt-4 mt-4 border-t border-[#E4E6EA]' : 'py-2'
      }`}
    >
      <span
        className={`text-base ${isTotal ? 'font-bold' : 'font-normal'} text-[#111827]`}
      >
        {label}
      </span>
      <span
        className={`text-base ${isTotal ? 'font-bold' : 'font-normal'} text-[#111827]`}
      >
        {hideAmount ? maskCurrency() : formatCurrency(amount)}
      </span>
    </div>
  );
};
