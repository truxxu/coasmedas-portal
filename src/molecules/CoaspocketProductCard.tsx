'use client';

import { useUIContext } from '@/src/contexts';
import { CoaspocketProduct } from '@/src/types';
import { formatCurrency, maskCurrency } from '@/src/utils';

interface CoaspocketProductCardProps {
  product: CoaspocketProduct;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function CoaspocketProductCard({
  product,
  isSelected = false,
  onClick,
  className = '',
}: CoaspocketProductCardProps) {
  const { hideBalances } = useUIContext();

  const statusColor = {
    activo: 'text-brand-success-icon',
    inactivo: 'text-brand-gray-medium',
  }[product.status];

  const statusLabel = {
    activo: 'Activo',
    inactivo: 'Inactivo',
  }[product.status];

  // Format product number with "No." prefix
  const displayProductNumber = `No.***${product.pocketNumber.slice(-4)}`;

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
          : 'bg-brand-border border border-brand-border hover:border-brand-footer-text'
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
      <p className="text-[15px] text-black">Saldo del bolsillo</p>
      <p className="text-[21px] font-bold text-brand-navy-alt">
        {hideBalances ? maskCurrency() : formatCurrency(product.balance)}
      </p>

      {/* Status */}
      <p className={`text-[15px] mt-2 ${statusColor}`}>
        {statusLabel}
      </p>
    </div>
  );
}
