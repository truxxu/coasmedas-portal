"use client";

import React from "react";
import { Checkbox, CurrencyInput } from "@/src/atoms";
import { PayableProduct } from "@/src/types";
import { formatCurrency, maskCurrency } from "@/src/utils";

interface PayableProductCardProps {
  product: PayableProduct;
  onSelectionChange: (selected: boolean) => void;
  onAmountChange: (amount: number) => void;
  hideBalances: boolean;
}

export const PayableProductCard: React.FC<PayableProductCardProps> = ({
  product,
  onSelectionChange,
  onAmountChange,
  hideBalances,
}) => {
  const formatAmount = (amount: number | null): string => {
    if (amount === null) return "N/A";
    if (hideBalances) return maskCurrency();
    return formatCurrency(amount);
  };

  const formatTotalPayment = (amount: number | null): string => {
    if (amount === null) return "Indefinido";
    if (hideBalances) return maskCurrency();
    return formatCurrency(amount);
  };

  return (
    <div className="border border-[#E4E6EA] p-4">
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <div className="pt-1">
          <Checkbox
            checked={product.isSelected}
            onChange={onSelectionChange}
            aria-label={`Seleccionar ${product.name}`}
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 space-y-2">
          {/* Product Title */}
          <h3 className="text-lg font-bold text-[#1D4E8F]">
            {product.name} ({product.productNumber})
          </h3>

          {/* Payment Info Row */}
          <div className="flex flex-col gap-2 text-md text-black">
            <div className="flex justify-between">
              <span className="text-[#58585B]">Pago Mínimo: </span>
              <span className="font-medium">
                {formatAmount(product.minimumPayment)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#58585B]">Pago Total: </span>
              <span className="font-medium">
                {formatTotalPayment(product.totalPayment)}
              </span>
            </div>
          </div>

          {/* Amount Input - Always visible, disabled when not selected */}
          <div className="flex flex-col gap-1 pt-2">
            <span
              className={`text-md ${
                product.isSelected ? "text-black" : "text-[#808284]"
              }`}
            >
              Valor a Pagar:
            </span>
            <CurrencyInput
              value={product.amountToPay}
              onChange={onAmountChange}
              prefix="$"
              disabled={!product.isSelected}
              className="w-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
