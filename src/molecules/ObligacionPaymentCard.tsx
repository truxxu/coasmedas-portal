'use client';

import React from 'react';
import { ObligacionPaymentProduct } from '@/src/types/obligacion-payment';
import { formatCurrency, maskCurrency } from '@/src/utils';

interface ObligacionPaymentCardProps {
  product: ObligacionPaymentProduct;
  selected: boolean;
  onClick: () => void;
  hideBalances: boolean;
}

export const ObligacionPaymentCard: React.FC<ObligacionPaymentCardProps> = ({
  product,
  selected,
  onClick,
  hideBalances,
}) => {
  const statusColor = product.status === 'al_dia' ? 'text-brand-success-icon' : 'text-brand-error';
  const statusText = product.status === 'al_dia' ? 'Al día' : 'En mora';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full p-4 rounded-lg text-left transition-all
        ${selected
          ? 'border-2 border-brand-primary bg-white'
          : 'border border-brand-border bg-white'
        }
      `}
      aria-pressed={selected}
    >
      {/* Product Title */}
      <h3 className="text-[19px] font-medium text-black mb-1">
        {product.name}
      </h3>

      {/* Product Number */}
      <p className="text-[15px] text-black mb-3">
        Número de producto: {product.productNumber}
      </p>

      {/* Balance Label */}
      <p className="text-[15px] text-black mb-1">
        Saldo Total
      </p>

      {/* Balance Amount */}
      <p className="text-[25px] font-bold text-black mb-2">
        {hideBalances ? maskCurrency() : formatCurrency(product.totalBalance)}
      </p>

      {/* Status */}
      <p className={`text-[15px] font-medium ${statusColor}`}>
        {statusText}
      </p>
    </button>
  );
};
