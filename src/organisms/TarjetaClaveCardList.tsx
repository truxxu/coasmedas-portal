"use client";

import React from "react";
import { Card } from "@/src/atoms";
import { TarjetaCreditoProduct } from "@/src/types/tarjetaCredito";

type BadgeVariant = "warning" | "success" | "neutral";

interface TarjetaClaveCardListProps {
  title: string;
  description: string;
  products: TarjetaCreditoProduct[];
  badgeLabel: string;
  badgeVariant?: BadgeVariant;
  emptyMessage?: string;
  onSelect: (product: TarjetaCreditoProduct) => void;
}

const BADGE_CLASSES: Record<BadgeVariant, string> = {
  warning: "bg-amber-50 text-[#cc7900]",
  success: "bg-green-50 text-[#0b6637]",
  neutral: "bg-brand-gray-light text-brand-gray-secondary",
};

export function TarjetaClaveCardList({
  title,
  description,
  products,
  badgeLabel,
  badgeVariant = "warning",
  emptyMessage = "No hay tarjetas disponibles para esta acción.",
  onSelect,
}: TarjetaClaveCardListProps) {
  const badgeClass = BADGE_CLASSES[badgeVariant];

  return (
    <Card className="space-y-6 p-6">
      <div>
        <h2 className="text-[20px] font-bold text-brand-navy">{title}</h2>
        <p className="text-[14px] text-brand-text-black mt-2">{description}</p>
      </div>

      {products.length === 0 ? (
        <p className="text-[14px] text-brand-gray-secondary">{emptyMessage}</p>
      ) : (
        <div className="space-y-3">
          {products.map((product) => (
            <button
              key={product.id}
              type="button"
              onClick={() => onSelect(product)}
              className="w-full flex items-center justify-between gap-4 rounded-lg border border-brand-border px-5 py-4 text-left transition-all hover:border-brand-navy hover:shadow-md focus:outline-none focus:ring-2 focus:ring-brand-navy focus:ring-offset-2"
            >
              <div className="min-w-0 flex-1">
                <p className="text-[16px] font-bold text-brand-navy">
                  {product.title}
                </p>
                <p className="text-[13px] text-brand-gray-secondary mt-1">
                  {product.maskedNumber}
                </p>
              </div>

              <span
                className={`shrink-0 rounded-full px-3 py-1 text-[12px] font-medium ${badgeClass}`}
              >
                {badgeLabel}
              </span>
            </button>
          ))}
        </div>
      )}
    </Card>
  );
}
