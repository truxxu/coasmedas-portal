'use client';

import { useUIContext } from '@/src/contexts';
import { ProteccionProduct } from '@/src/types';
import { formatCurrency, maskCurrency, formatDate } from '@/src/utils';

interface ProteccionProductCardProps {
  product: ProteccionProduct;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * Mask product number with "No" prefix format
 * @example maskProteccionNumber("65-9") => "No******65-9"
 */
function maskProteccionNumber(number: string): string {
  return `No******${number}`;
}

export function ProteccionProductCard({
  product,
  isSelected = false,
  onClick,
  className = '',
}: ProteccionProductCardProps) {
  const { hideBalances } = useUIContext();

  const statusColor = {
    activo: 'text-[#00A44C]',
    inactivo: 'text-[#808284]',
    cancelado: 'text-red-600',
  }[product.status];

  const statusLabel = {
    activo: 'Activo',
    inactivo: 'Inactivo',
    cancelado: 'Cancelado',
  }[product.status];

  // Format product number with "No" prefix
  const displayProductNumber = maskProteccionNumber(product.productNumber);

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
          ? 'bg-white border-2 border-[#194E8D]'
          : 'bg-[#E4E6EA] border border-[#E4E6EA] hover:border-[#B1B1B1]'
        }
        ${className}
      `}
    >
      {/* Title */}
      <h3 className="text-[16px] font-medium text-black mb-1">
        {product.title}
      </h3>

      {/* Product Number - unique format */}
      <p className="text-[14px] text-black mb-2">
        Número de producto: {displayProductNumber}
      </p>

      {/* Status */}
      <p className={`text-[15px] mb-4 ${statusColor}`}>
        {statusLabel}
      </p>

      {/* Insurance Details Section - NO divider, all at same level */}
      <div className="space-y-2">
        {/* Pago Mínimo */}
        <div className="flex justify-between">
          <span className="text-[14px] text-[#636363]">Pago Mínimo:</span>
          <span className="text-[14px] font-medium text-[#194E8D]">
            {hideBalances ? maskCurrency() : formatCurrency(product.minimumPayment)}
          </span>
        </div>

        {/* Fecha Límite de Pago */}
        <div className="flex justify-between">
          <span className="text-[14px] text-[#636363]">Fecha Límite de Pago:</span>
          <span className="text-[14px] font-medium text-black">
            {formatDate(product.paymentDeadline)}
          </span>
        </div>

        {/* Pago Total Anual */}
        <div className="flex justify-between">
          <span className="text-[14px] text-[#636363]">Pago Total Anual:</span>
          <span className="text-[14px] font-medium text-[#194E8D]">
            {hideBalances ? maskCurrency() : formatCurrency(product.annualPayment)}
          </span>
        </div>
      </div>
    </div>
  );
}
