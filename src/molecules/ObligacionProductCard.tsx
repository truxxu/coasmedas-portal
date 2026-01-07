'use client';

import { useUIContext } from '@/src/contexts';
import { ObligacionProduct } from '@/src/types';
import { formatCurrency, maskCurrency, maskNumber } from '@/src/utils';
import { formatDate } from '@/src/utils/dates';

interface ObligacionProductCardProps {
  product: ObligacionProduct;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function ObligacionProductCard({
  product,
  isSelected = false,
  onClick,
  className = '',
}: ObligacionProductCardProps) {
  const { hideBalances } = useUIContext();

  const statusColor = {
    al_dia: 'text-brand-success-icon',
    en_mora: 'text-red-600',
  }[product.status];

  const statusLabel = {
    al_dia: 'Al día',
    en_mora: 'En mora',
  }[product.status];

  // Format product number with optional prefix
  const displayProductNumber = product.productPrefix
    ? `${product.productPrefix}${maskNumber(product.productNumber)}`
    : maskNumber(product.productNumber);

  return (
    <div
      role="option"
      aria-selected={isSelected}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={`
        rounded-2xl p-5 cursor-pointer min-w-[280px]
        transition-all duration-200
        ${isSelected
          ? 'bg-white border-2 border-brand-navy-dark'
          : 'bg-brand-gray-light border border-brand-border hover:border-brand-footer-text'
        }
        ${className}
      `}
    >
      {/* Title */}
      <h3 className="text-[16px] font-medium text-black mb-1">
        {product.title}
      </h3>

      {/* Product Number */}
      <p className="text-[14px] text-black mb-3">
        Número de producto: {displayProductNumber}
      </p>

      {/* Balance Section */}
      <p className="text-[15px] text-black">Saldo a la fecha</p>
      <p className="text-[21px] font-bold text-brand-navy">
        {hideBalances ? maskCurrency() : formatCurrency(product.currentBalance)}
      </p>

      {/* Status */}
      <p className={`text-[15px] ${statusColor}`}>
        {statusLabel}
      </p>

      {/* Divider */}
      <div className="border-t border-brand-border my-3" />

      {/* Additional Info Section */}
      <div className="space-y-1">
        {/* Valor desembolsado */}
        <div className="flex justify-between">
          <span className="text-[14px] text-brand-gray-muted">Valor desembolsado:</span>
          <span className="text-[14px] font-medium text-brand-navy-alt">
            {hideBalances ? maskCurrency() : formatCurrency(product.disbursedAmount)}
          </span>
        </div>

        {/* Próximo pago */}
        <div className="flex justify-between">
          <span className="text-[14px] text-brand-gray-muted">Próximo pago:</span>
          <span className="text-[14px] font-medium text-black">
            {formatDate(product.nextPaymentDate)}
          </span>
        </div>

        {/* Valor próximo pago */}
        <div className="flex justify-between">
          <span className="text-[14px] text-brand-gray-muted">Valor próximo pago:</span>
          <span className="text-[14px] font-medium text-brand-navy-alt">
            {hideBalances ? maskCurrency() : formatCurrency(product.nextPaymentAmount)}
          </span>
        </div>
      </div>
    </div>
  );
}
