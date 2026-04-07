"use client";

import { useUIContext } from "@/src/contexts";
import { TarjetaCreditoProduct } from "@/src/types/tarjetaCredito";
import { formatCurrency, maskCurrency } from "@/src/utils";

interface TarjetaCreditoProductCardProps {
  product: TarjetaCreditoProduct;
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
}

export function TarjetaCreditoProductCard({
  product,
  isSelected = false,
  onClick,
  className = "",
}: TarjetaCreditoProductCardProps) {
  const { hideBalances } = useUIContext();

  const isActiva = product.status === "activa";
  const isPendiente = product.status === "pendiente_activacion";
  const isBloqueada = product.status === "bloqueada";

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
        rounded-2xl p-5 cursor-pointer min-w-[260px]
        transition-all duration-200
        ${
          isSelected
            ? "bg-white border-2 border-brand-navy-dark"
            : "bg-brand-gray-light border border-brand-border hover:border-brand-footer-text"
        }
        ${className}
      `}
    >
      <h3 className="text-[16px] font-bold text-black leading-tight">
        {product.title}
      </h3>
      <p className="text-[15px] text-black mt-1">{product.maskedNumber}</p>

      {isActiva ? (
        <>
          <p className="text-[15px] text-black mt-3">Deuda Total</p>
          <p className="text-[18.5px] font-bold text-black">
            {hideBalances ? maskCurrency() : formatCurrency(product.deudaTotal)}
          </p>
          <p className="text-[14px] font-medium text-brand-success-icon mt-2">
            Activa
          </p>
        </>
      ) : (
        <>
          <p className="text-[15px] text-black mt-3">Estado</p>
          <p className="text-[18.5px] font-bold text-black">-</p>
          <p
            className={`text-[14px] font-medium mt-2 ${
              isBloqueada ? "text-brand-error" : "text-brand-navy-alt"
            }`}
          >
            {isPendiente ? "Pendiente de activación" : "Bloqueada"}
          </p>
        </>
      )}
    </div>
  );
}
