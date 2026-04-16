"use client";

import React from "react";
import { Card } from "@/src/atoms";
import { CardActionListItem } from "@/src/molecules";
import { TarjetaCreditoProduct } from "@/src/types/tarjetaCredito";

interface CardBlockActivateListProps {
  products: TarjetaCreditoProduct[];
  onBlock?: (product: TarjetaCreditoProduct) => void;
  onActivate?: (product: TarjetaCreditoProduct) => void;
}

export function CardBlockActivateList({
  products,
  onBlock,
  onActivate,
}: CardBlockActivateListProps) {
  return (
    <Card className="space-y-6 p-6">
      <div>
        <h2 className="text-[20px] font-bold text-brand-navy">
          Gestión de Tarjeta de Crédito
        </h2>
        <p className="text-[14px] text-brand-text-black mt-2">
          Desde aquí puedes activar o bloquear tu tarjeta de crédito de forma
          segura.
        </p>
      </div>

      <div className="space-y-3">
        {products.map((product) => (
          <CardActionListItem
            key={product.id}
            product={product}
            onBlock={onBlock}
            onActivate={onActivate}
          />
        ))}
      </div>
    </Card>
  );
}
