"use client";

import React from "react";
import { Card, Divider, CurrencyInput } from "@/src/atoms";
import { ObligacionPaymentCard, PaymentTypeButton } from "@/src/molecules";
import {
  ObligacionPaymentProduct,
  PaymentType,
} from "@/src/types/obligacion-payment";
import { formatCurrency, maskCurrency } from "@/src/utils";

interface ObligacionDetailsCardProps {
  products: ObligacionPaymentProduct[];
  selectedProductId: string;
  valorAPagar: number;
  activePaymentType: PaymentType | null;
  onProductSelect: (productId: string) => void;
  onValorChange: (valor: number) => void;
  onPaymentTypeSelect: (type: PaymentType) => void;
  onNeedMoreBalance: () => void;
  hideBalances: boolean;
}

export const ObligacionDetailsCard: React.FC<ObligacionDetailsCardProps> = ({
  products,
  selectedProductId,
  valorAPagar,
  activePaymentType,
  onProductSelect,
  onValorChange,
  onPaymentTypeSelect,
  onNeedMoreBalance,
  hideBalances,
}) => {
  const selectedProduct = products.find((p) => p.id === selectedProductId);

  return (
    <Card className="space-y-6 p-6">
      {/* Title */}
      <h2 className="text-lg font-bold text-[#1D4E8F]">Pago de Obligaciones</h2>

      {/* Payment Method Selector */}
      <div className="space-y-2">
        <label className="block text-[15px] text-black">
          ¿De cuál cuenta quiere pagar?
        </label>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <select
            disabled
            className="flex-1 h-11 px-3 rounded-md border border-[#B1B1B1] text-base text-black bg-white cursor-not-allowed"
          >
            <option>PSE (Pagos con otras entidades)</option>
          </select>
          <button
            type="button"
            onClick={onNeedMoreBalance}
            className="text-xs text-[#1D4E8F] hover:underline whitespace-nowrap self-end sm:self-auto"
          >
            ¿Necesitas más saldo?
          </button>
        </div>
      </div>

      {/* Product Selection Section */}
      <div className="space-y-3">
        <label className="block text-[15px] text-black">
          ¿Cuál producto desea pagar?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((product) => (
            <ObligacionPaymentCard
              key={product.id}
              product={product}
              selected={product.id === selectedProductId}
              onClick={() => onProductSelect(product.id)}
              hideBalances={hideBalances}
            />
          ))}
        </div>
      </div>

      {/* Payment Details Section - Only show if product selected */}
      {selectedProduct && (
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-[#1D4E8F]">
            Detalle del Pago
          </h3>

          <Divider />

          {/* Payment Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[15px] text-black">
                Pago Mínimo del Periodo:
              </span>
              <span className="text-[15px] font-medium text-black">
                {hideBalances
                  ? maskCurrency()
                  : formatCurrency(selectedProduct.minimumPayment)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[15px] text-black">Pago Total:</span>
              <span className="text-[15px] font-medium text-black">
                {hideBalances
                  ? maskCurrency()
                  : formatCurrency(selectedProduct.totalBalance)}
              </span>
            </div>
          </div>

          <Divider />

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[15px] text-black">
                Fecha Límite de Pago:
              </span>
              <span className="text-[15px] font-medium text-black">
                {selectedProduct.paymentDeadline}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[15px] text-black">
                Costo de la Transacción:
              </span>
              <span className="text-[15px] font-medium text-black">$ 0</span>
            </div>
          </div>

          {/* Payment Type Buttons */}
          <div className="flex gap-3">
            <PaymentTypeButton
              label="Pago Mínimo"
              onClick={() => onPaymentTypeSelect("minimum")}
              active={activePaymentType === "minimum"}
            />
            <PaymentTypeButton
              label="Pago Total"
              onClick={() => onPaymentTypeSelect("total")}
              active={activePaymentType === "total"}
            />
          </div>

          {/* Value Input */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-2">
            <span className="text-base font-bold text-[#1D4E8F]">
              Valor a Pagar
            </span>
            <CurrencyInput
              value={valorAPagar}
              onChange={onValorChange}
              prefix="$"
            />
          </div>

          <Divider />

          {/* Total Display */}
          <div className="flex justify-between items-center">
            <span className="text-base font-bold text-black">
              Total a Pagar
            </span>
            <span className="text-lg font-medium text-black">
              {hideBalances ? maskCurrency() : formatCurrency(valorAPagar)}
            </span>
          </div>
        </div>
      )}
    </Card>
  );
};
