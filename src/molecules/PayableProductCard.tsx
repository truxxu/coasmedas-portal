'use client';

import React from 'react';
import { Checkbox, CurrencyInput } from '@/src/atoms';
import { PayableProduct } from '@/src/types';
import { formatCurrency, maskCurrency } from '@/src/utils';

interface PayableProductCardProps {
  product: PayableProduct;
  onSelectionChange: (selected: boolean) => void;
  onAmountChange: (amount: number) => void;
  hideBalances: boolean;
}

export const PayableProductCard: React.FC<PayableProductCardProps> = ({
  product,
  onSelectionChange,
  onAmountChange,
  hideBalances,
}) => {
  const formatAmount = (amount: number | null): string => {
    if (amount === null) return 'N/A';
    if (hideBalances) return maskCurrency();
    return formatCurrency(amount);
  };

  const formatTotalPayment = (amount: number | null): string => {
    if (amount === null) return 'Indefinido';
    if (hideBalances) return maskCurrency();
    return formatCurrency(amount);
  };

  return (
    <div className="border-b border-[#E4E6EA] pb-4 last:border-b-0">
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <div className="pt-1">
          <Checkbox
            checked={product.isSelected}
            onChange={onSelectionChange}
            aria-label={`Seleccionar ${product.name}`}
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 space-y-2">
          {/* Product Title */}
          <h3 className="text-lg font-bold text-[#1D4E8F]">
            {product.name} ({product.productNumber})
          </h3>

          {/* Payment Info Row */}
          <div className="flex gap-8 text-xs text-black">
            <div>
              <span className="text-[#58585B]">Pago Mínimo: </span>
              <span className="font-medium">
                {formatAmount(product.minimumPayment)}
              </span>
            </div>
            <div>
              <span className="text-[#58585B]">Pago Total: </span>
              <span className="font-medium">
                {formatTotalPayment(product.totalPayment)}
              </span>
            </div>
          </div>

          {/* Amount Input - Only show when selected */}
          {product.isSelected && (
            <div className="flex items-center gap-2 pt-2">
              <span className="text-sm text-black">Valor a Pagar:</span>
              <CurrencyInput
                value={product.amountToPay}
                onChange={onAmountChange}
                prefix="$"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
