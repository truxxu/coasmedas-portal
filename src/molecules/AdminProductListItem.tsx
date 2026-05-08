"use client";

import { Button } from "@/src/atoms";
import { formatCurrency, formatDate } from "@/src/utils";
import type { AdminProduct } from "@/src/types";

interface AdminProductListItemProps {
  product: AdminProduct;
  onManage: (product: AdminProduct) => void;
  hideBalances?: boolean;
}

export function AdminProductListItem({
  product,
  onManage,
  hideBalances = false,
}: AdminProductListItemProps) {
  const dailyTx = product.globalLimits.transactions.daily;
  const dailyAmount = product.globalLimits.amounts.daily;

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border border-brand-border rounded-md p-4">
      <div className="flex-1 min-w-0">
        <p className="font-bold text-brand-navy truncate">
          {product.displayName}
        </p>
        <p className="text-brand-gray-high mt-1">
          Límites globales: {dailyTx} transacciones/día:{" "}
          {hideBalances ? "$ ****" : formatCurrency(dailyAmount)} monto/día
        </p>
        <p className="text-brand-gray-medium mt-0.5">
          Última actualización: {formatDate(product.lastUpdate)}
        </p>
      </div>
      <div className="md:ml-4">
        <Button variant="secondary" size="sm" onClick={() => onManage(product)}>
          Gestionar
        </Button>
      </div>
    </div>
  );
}
