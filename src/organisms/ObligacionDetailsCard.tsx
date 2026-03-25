"use client";

import React from "react";
import { Card } from "@/src/atoms";
import { ObligacionPaymentCard } from "@/src/molecules";
import {
  ObligacionPaymentProduct,
  ObligacionSourceAccount,
  ObligacionPaymentMethod,
} from "@/src/types/obligacion-payment";
import { formatCurrency, maskCurrency } from "@/src/utils";

interface ObligacionDetailsCardProps {
  products: ObligacionPaymentProduct[];
  sourceAccounts: ObligacionSourceAccount[];
  selectedProductId: string;
  selectedAccountId: string;
  onProductSelect: (productId: string) => void;
  onAccountChange: (accountId: string, paymentMethod: ObligacionPaymentMethod) => void;
  onNeedMoreBalance: () => void;
  hideBalances: boolean;
  accountError?: string;
}

export const ObligacionDetailsCard: React.FC<ObligacionDetailsCardProps> = ({
  products,
  sourceAccounts,
  selectedProductId,
  selectedAccountId,
  onProductSelect,
  onAccountChange,
  onNeedMoreBalance,
  hideBalances,
  accountError,
}) => {
  const getAccountDisplayName = (account: ObligacionSourceAccount): string => {
    const accountType = account.type === 'ahorros' ? 'Cuenta de Ahorros' : 'Cuenta Corriente';
    const balance = hideBalances ? maskCurrency() : formatCurrency(account.balance);
    return `${accountType} - Saldo: ${balance}`;
  };

  return (
    <Card className="space-y-6 p-6">
      {/* Title */}
      <h2 className="text-lg font-bold text-brand-navy">Pago de Obligaciones</h2>

      {/* Payment Method Selector */}
      <div className="space-y-2">
        <label className="block text-[15px] text-black">
          ¿De cuál cuenta quiere pagar?
        </label>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <select
            value={selectedAccountId}
            onChange={(e) => {
              const value = e.target.value;
              const isPSE = value === 'pse';
              onAccountChange(value, isPSE ? 'pse' : 'account');
            }}
            className={`
              flex-1 h-11 px-3 rounded-md border text-base text-black bg-white
              focus:outline-none focus:ring-2 focus:ring-brand-primary
              ${accountError ? 'border-brand-error' : 'border-brand-footer-text'}
            `}
          >
            <option value="">Seleccionar cuenta</option>
            {sourceAccounts.map((account) => (
              <option key={account.id} value={account.id}>
                {getAccountDisplayName(account)}
              </option>
            ))}
            <option value="pse">PSE (Pagos con otras entidades)</option>
          </select>
          <button
            type="button"
            onClick={onNeedMoreBalance}
            className="text-xs text-brand-navy hover:underline whitespace-nowrap self-end sm:self-auto"
          >
            ¿Necesitas más saldo?
          </button>
        </div>
        {accountError && (
          <p className="text-sm text-brand-error">{accountError}</p>
        )}
      </div>

      {/* Product Selection Section */}
      <div className="space-y-3">
        <label className="block text-[15px] text-black">
          ¿Qué Obligación deseas pagar?
        </label>
        <div className="flex gap-4 overflow-x-auto pb-2">
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
        {!selectedProductId && (
          <p className="text-base text-gray-medium text-center">
            Selecciona la obligación que deseas pagar
          </p>
        )}
      </div>
    </Card>
  );
};
