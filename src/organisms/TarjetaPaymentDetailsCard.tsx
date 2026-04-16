"use client";

import React from "react";
import { Card, CurrencyInput } from "@/src/atoms";
import { TarjetaCreditoProduct } from "@/src/types/tarjetaCredito";
import {
  TarjetaSourceAccount,
  TarjetaPaymentValueType,
} from "@/src/types/tarjeta-payment";
import { formatCurrency, maskCurrency } from "@/src/utils";

interface TarjetaPaymentDetailsCardProps {
  product: TarjetaCreditoProduct;
  sourceAccounts: TarjetaSourceAccount[];
  selectedAccountId: string;
  valorAPagar: number;
  activePaymentType: TarjetaPaymentValueType;
  hideBalances: boolean;
  accountError?: string;
  error?: string;
  onAccountChange: (accountId: string) => void;
  onPaymentTypeSelect: (type: TarjetaPaymentValueType) => void;
  onValorChange: (valor: number) => void;
  onNeedMoreBalance: () => void;
}

export const TarjetaPaymentDetailsCard: React.FC<
  TarjetaPaymentDetailsCardProps
> = ({
  product,
  sourceAccounts,
  selectedAccountId,
  valorAPagar,
  activePaymentType,
  hideBalances,
  accountError,
  error,
  onAccountChange,
  onPaymentTypeSelect,
  onValorChange,
  onNeedMoreBalance,
}) => {
  const fmt = (amount: number) =>
    hideBalances ? maskCurrency() : formatCurrency(amount);

  const accountLabel = (account: TarjetaSourceAccount) =>
    `${account.displayName} - Saldo: ${fmt(account.balance)}`;

  const radioOptions: { value: TarjetaPaymentValueType; label: string }[] = [
    { value: "total", label: "Pago Total" },
    { value: "minimum", label: "Pago Mínimo" },
    { value: "custom", label: "Otro Valor" },
  ];

  return (
    <Card className="space-y-6 p-6">
      <h2 className="text-lg font-bold text-brand-navy">
        Pagar Tarjeta de Crédito
      </h2>

      {/* Source account selector */}
      <div className="space-y-2">
        <label className="block text-[14px] text-brand-navy-alt">
          Pagar desde la cuenta:
        </label>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <select
            value={selectedAccountId}
            onChange={(e) => onAccountChange(e.target.value)}
            className={`
              flex-1 h-11 px-3 rounded-md border text-base text-black bg-white
              focus:outline-none focus:ring-2 focus:ring-brand-primary
              ${accountError ? "border-brand-error" : "border-brand-footer-text"}
            `}
          >
            <option value="">Seleccionar cuenta</option>
            {sourceAccounts.map((account) => (
              <option key={account.id} value={account.id}>
                {accountLabel(account)}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onNeedMoreBalance}
            className="text-[13px] text-brand-navy-alt hover:underline whitespace-nowrap self-end sm:self-auto"
          >
            ¿Necesitas más saldo?
          </button>
        </div>
        {accountError && (
          <p className="text-sm text-brand-error">{accountError}</p>
        )}
      </div>

      {/* Tarjeta info block */}
      <div className="bg-brand-gray-light rounded-lg p-4 space-y-2">
        <p className="text-[15px] font-medium text-brand-navy-alt">
          Pagando: {product.title} (****{product.last4})
        </p>
        <div className="flex justify-between">
          <span className="text-[14px] text-brand-navy-alt">
            Deuda Total a la fecha:
          </span>
          <span className="text-[14px] font-medium text-brand-navy-alt">
            {fmt(product.deudaTotal)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[14px] text-brand-navy-alt">Pago Mínimo:</span>
          <span className="text-[14px] font-medium text-brand-navy-alt">
            {fmt(product.pagoMinimo)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[14px] text-brand-navy-alt">
            Cupo Disponible:
          </span>
          <span className="text-[14px] font-medium text-brand-navy-alt">
            {fmt(product.cupoDisponible)}
          </span>
        </div>
      </div>

      {/* Payment value selection */}
      <div className="space-y-3">
        <p className="text-[14px] text-brand-navy-alt">
          Selecciona el valor a pagar:
        </p>
        <div className="space-y-2">
          {radioOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-3 cursor-pointer"
            >
              <input
                type="radio"
                name="tarjetaPaymentType"
                value={option.value}
                checked={activePaymentType === option.value}
                onChange={() => onPaymentTypeSelect(option.value)}
                className="w-4 h-4 accent-brand-primary"
              />
              <span className="text-[14px] text-brand-navy-alt">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Amount input */}
      <div>
        <CurrencyInput
          value={valorAPagar}
          onChange={onValorChange}
          prefix="$"
          hasError={Boolean(error)}
          disabled={activePaymentType !== "custom"}
          className="w-full"
        />
      </div>

      {error && <p className="text-sm text-brand-error">{error}</p>}
    </Card>
  );
};
