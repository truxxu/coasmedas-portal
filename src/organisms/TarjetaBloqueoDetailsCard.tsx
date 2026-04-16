"use client";

import React from "react";
import { Card } from "@/src/atoms";
import { TarjetaCreditoProduct } from "@/src/types/tarjetaCredito";

interface TarjetaBloqueoDetailsCardProps {
  product: TarjetaCreditoProduct;
}

export const TarjetaBloqueoDetailsCard: React.FC<
  TarjetaBloqueoDetailsCardProps
> = ({ product }) => {
  return (
    <Card className="space-y-6 p-6">
      <div>
        <h2 className="text-lg font-bold text-brand-navy">
          Bloqueo de Tarjeta de Crédito
        </h2>
        <p className="text-[14px] text-brand-text-black mt-2">
          Para confirmar el bloqueo de tu tarjeta.
        </p>
      </div>

      <div className="rounded-lg border border-brand-border p-4">
        <p className="text-[15px] font-bold text-brand-navy">{product.title}</p>
        <p className="text-[13px] text-brand-gray-secondary mt-1">
          {product.maskedNumber}
        </p>
      </div>
    </Card>
  );
};
