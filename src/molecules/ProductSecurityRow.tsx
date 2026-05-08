"use client";

import { memo, useCallback } from "react";
import { Switch } from "@/src/atoms";
import { maskNumber } from "@/src/utils/formatCurrency";
import { formatDateCapitalized } from "@/src/utils/dates";
import type { ProductSecurityItem } from "@/src/types";

interface ProductSecurityRowProps {
  item: ProductSecurityItem;
  onToggleRequest: (id: string, nextChecked: boolean) => void;
  showDivider?: boolean;
}

function ProductSecurityRowImpl({
  item,
  onToggleRequest,
  showDivider = true,
}: ProductSecurityRowProps) {
  const isActive = item.status === "activo";
  const statusLabel = isActive ? "Activo" : "Bloqueado";
  const statusColor = isActive ? "text-[#00a44c]" : "text-[#e1182c]";

  const handleChange = useCallback(
    (next: boolean) => onToggleRequest(item.id, next),
    [item.id, onToggleRequest],
  );

  return (
    <div
      className={`flex items-center justify-between py-5 ${
        showDivider ? "border-b border-brand-gray-low" : ""
      }`}
    >
      <div className="min-w-0">
        <p className="text-base font-medium text-black truncate">
          {item.title} ({maskNumber(item.productNumber)})
        </p>
        <p className="text-sm text-brand-gray-high mt-1">
          Última actualización: {formatDateCapitalized(item.lastUpdate)}
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className={`text-sm font-medium ${statusColor}`}>
          {statusLabel}
        </span>
        <Switch
          checked={isActive}
          onChange={handleChange}
          ariaLabel={`${statusLabel} ${item.title}`}
        />
      </div>
    </div>
  );
}

export const ProductSecurityRow = memo(ProductSecurityRowImpl);
