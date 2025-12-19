'use client';

import { useUIContext } from '@/src/contexts';
import { SavingsProduct } from '@/src/types';
import { formatCurrency, maskCurrency, maskNumber } from '@/src/utils';

interface SavingsProductCardProps {
  product: SavingsProduct;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function SavingsProductCard({
  product,
  isSelected = false,
  onClick,
  className = '',
}: SavingsProductCardProps) {
  const { hideBalances } = useUIContext();

  const statusColor = {
    activo: 'text-[#00A44C]',
    bloqueado: 'text-red-600',
    inactivo: 'text-gray-500',
  }[product.status];

  const statusLabel = {
    activo: 'Activo',
    bloqueado: 'Bloqueado',
    inactivo: 'Inactivo',
  }[product.status];

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
        bg-white rounded-2xl p-5 cursor-pointer
        transition-all duration-200
        ${isSelected
          ? 'border-2 border-[#194E8D]'
          : 'border border-[#E4E6EA] hover:border-[#B1B1B1]'
        }
        ${className}
      `}
    >
      {/* Title */}
      <h3 className="text-[16px] font-medium text-black mb-1">
        {product.title}
      </h3>

      {/* Account Type */}
      <p className="text-[14px] text-black">
        Tipo de cuenta: {product.accountType}
      </p>

      {/* Product Number */}
      <p className="text-[15px] text-black mb-3">
        Número de producto: {maskNumber(product.productNumber)}
      </p>

      {/* Balance Section */}
      <p className="text-[15px] text-black">Saldo Total</p>
      <p className="text-[21px] font-bold text-[#112E7F]">
        {hideBalances ? maskCurrency() : formatCurrency(product.balance)}
      </p>

      {/* Status */}
      <p className={`text-[15px] ${statusColor}`}>
        {statusLabel}
      </p>
    </div>
  );
}
