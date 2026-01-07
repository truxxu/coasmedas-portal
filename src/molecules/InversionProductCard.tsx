"use client";

import { useUIContext } from "@/src/contexts";
import { InversionProduct } from "@/src/types";
import { formatCurrency, maskCurrency, maskNumber } from "@/src/utils";
import { formatDate } from "@/src/utils/dates";

interface InversionProductCardProps {
  product: InversionProduct;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function InversionProductCard({
  product,
  isSelected = false,
  onClick,
  className = "",
}: InversionProductCardProps) {
  const { hideBalances } = useUIContext();

  const statusColor = {
    activo: "text-brand-success-icon",
    vencido: "text-red-600",
  }[product.status];

  const statusLabel = {
    activo: "Activo",
    vencido: "Vencido",
  }[product.status];

  // Format product number with prefix
  const displayProductNumber = product.productPrefix
    ? `${product.productPrefix}${maskNumber(product.productNumber)}`
    : maskNumber(product.productNumber);

  // Format term with "dias" suffix
  const displayTerm = `${product.termDays} dias`;

  return (
    <div
      role="option"
      aria-selected={isSelected}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={`
        rounded-2xl p-5 cursor-pointer min-w-[280px]
        transition-all duration-200
        ${
          isSelected
            ? "bg-white border-2 border-brand-navy-dark"
            : "bg-brand-border border border-brand-border hover:border-brand-footer-text"
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
        Numero de producto: {displayProductNumber}
      </p>

      {/* Amount Section */}
      <p className="text-[15px] text-black">Monto del CDAT</p>
      <p className="text-[21px] font-bold text-brand-navy-alt">
        {hideBalances ? maskCurrency() : formatCurrency(product.amount)}
      </p>

      {/* Status */}
      <p className={`text-[15px] ${statusColor}`}>{statusLabel}</p>

      {/* Divider */}
      <div className="border-t border-brand-border my-3" />

      {/* Investment Details Section */}
      <div className="space-y-1">
        {/* Tasa E.A. */}
        <div className="flex justify-between">
          <span className="text-[14px] text-brand-gray-muted">Tasa E.A.:</span>
          <span className="text-[14px] font-medium text-black">
            {product.interestRate}
          </span>
        </div>

        {/* Plazo */}
        <div className="flex justify-between">
          <span className="text-[14px] text-brand-gray-muted">Plazo:</span>
          <span className="text-[14px] font-medium text-black">
            {displayTerm}
          </span>
        </div>

        {/* F. Creacion */}
        <div className="flex justify-between">
          <span className="text-[14px] text-brand-gray-muted">F. Creación:</span>
          <span className="text-[14px] font-medium text-black">
            {formatDate(product.creationDate)}
          </span>
        </div>

        {/* F. Vencimiento */}
        <div className="flex justify-between">
          <span className="text-[14px] text-brand-gray-muted">F. Vencimiento:</span>
          <span className="text-[14px] font-medium text-black">
            {formatDate(product.maturityDate)}
          </span>
        </div>
      </div>
    </div>
  );
}
