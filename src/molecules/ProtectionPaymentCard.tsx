'use client';

import React from 'react';
import type { ProtectionPaymentProduct } from '@/src/types/protection-payment';
import { formatCurrency, maskCurrency } from '@/src/utils';

interface ProtectionPaymentCardProps {
  product: ProtectionPaymentProduct;
  isSelected: boolean;
  onSelect: (product: ProtectionPaymentProduct) => void;
  hideBalances?: boolean;
}

const statusColors: Record<ProtectionPaymentProduct['status'], string> = {
  activo: 'text-[#00A44C]',
  inactivo: 'text-[#808284]',
  cancelado: 'text-[#FF0D00]',
};

const statusLabels: Record<ProtectionPaymentProduct['status'], string> = {
  activo: 'Activo',
  inactivo: 'Inactivo',
  cancelado: 'Cancelado',
};

export const ProtectionPaymentCard: React.FC<ProtectionPaymentCardProps> = ({
  product,
  isSelected,
  onSelect,
  hideBalances = false,
}) => {
  const handleClick = () => {
    onSelect(product);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(product);
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-pressed={isSelected}
      aria-label={`Seleccionar ${product.title}`}
      className={`
        w-full min-w-[280px] max-w-[320px] p-5
        rounded-lg border-2 transition-all duration-200
        text-left cursor-pointer
        focus:outline-none focus:ring-2 focus:ring-[#007FFF] focus:ring-offset-2
        ${isSelected
          ? 'bg-white border-[#007FFF]'
          : 'bg-white border-[#E4E6EA] hover:border-[#B1B1B1]'
        }
      `}
    >
      {/* Product Title */}
      <h3 className="text-base font-medium text-black mb-2">
        {product.title}
      </h3>

      {/* Product Number */}
      <p className="text-sm text-black mb-3">
        Numero: {product.productNumber}
      </p>

      {/* Next Payment Section */}
      <div className="mb-3">
        <p className="text-sm text-black mb-1">Proximo Pago</p>
        <p className="text-[19px] font-medium text-[#194E8D]">
          {hideBalances ? maskCurrency() : formatCurrency(product.nextPaymentAmount)}
        </p>
      </div>

      {/* Status Badge */}
      <span className={`text-[15px] ${statusColors[product.status]}`}>
        {statusLabels[product.status]}
      </span>
    </div>
  );
};
