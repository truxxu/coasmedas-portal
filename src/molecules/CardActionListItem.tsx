"use client";

import React from "react";
import { TarjetaCreditoProduct } from "@/src/types/tarjetaCredito";

interface CardActionListItemProps {
  product: TarjetaCreditoProduct;
  onBlock?: (product: TarjetaCreditoProduct) => void;
  onActivate?: (product: TarjetaCreditoProduct) => void;
}

const STATUS_BADGE: Record<
  TarjetaCreditoProduct["status"],
  { label: string; className: string }
> = {
  activa: {
    label: "Activa",
    className: "bg-green-50 text-[#0b6637]",
  },
  pendiente_activacion: {
    label: "Pendiente de activación",
    className: "bg-amber-50 text-[#cc7900]",
  },
  bloqueada: {
    label: "Bloqueada",
    className: "bg-red-50 text-brand-error",
  },
};

export function CardActionListItem({
  product,
  onBlock,
  onActivate,
}: CardActionListItemProps) {
  const badge = STATUS_BADGE[product.status];

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-brand-gray-light px-5 py-4">
      <div className="min-w-0 flex-1">
        <p className="text-[16px] font-medium text-brand-navy">
          {product.title}
        </p>
        <p className="text-[14px] text-brand-gray-secondary mt-1">
          {product.maskedNumber}
        </p>
      </div>

      <span
        className={`shrink-0 rounded-full px-3 py-1 text-[12px] font-medium ${badge.className}`}
      >
        {badge.label}
      </span>

      <div className="flex w-[160px] shrink-0 items-center justify-end">
        {product.status === "activa" && (
          <button
            type="button"
            onClick={() => onBlock?.(product)}
            className="rounded-md bg-brand-error px-5 py-2 text-[14px] font-medium text-white shadow-sm transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-error focus:ring-offset-2"
          >
            Bloquear
          </button>
        )}
        {product.status === "pendiente_activacion" && (
          <button
            type="button"
            onClick={() => onActivate?.(product)}
            className="rounded-md bg-brand-text-black px-5 py-2 text-[14px] font-medium text-white shadow-sm transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-brand-text-black focus:ring-offset-2"
          >
            Activar Tarjeta
          </button>
        )}
        {product.status === "bloqueada" && (
          <p className="text-right text-[14px] text-brand-gray-secondary">
            Bloqueada
            <br />
            permanentemente
          </p>
        )}
      </div>
    </div>
  );
}
