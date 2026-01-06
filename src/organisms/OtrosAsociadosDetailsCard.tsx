'use client';

import React from 'react';
import { Card, Divider } from '@/src/atoms';
import { PayableProductCard } from '@/src/molecules';
import { SourceAccount, PayableProduct } from '@/src/types';
import { formatCurrency, maskCurrency } from '@/src/utils';

interface OtrosAsociadosDetailsCardProps {
  beneficiaryName: string;
  accounts: SourceAccount[];
  selectedAccountId: string;
  products: PayableProduct[];
  totalAmount: number;
  onAccountChange: (accountId: string) => void;
  onProductSelectionChange: (productId: string, selected: boolean) => void;
  onProductAmountChange: (productId: string, amount: number) => void;
  onNeedMoreBalance: () => void;
  hideBalances: boolean;
}

export const OtrosAsociadosDetailsCard: React.FC<OtrosAsociadosDetailsCardProps> = ({
  beneficiaryName,
  accounts,
  selectedAccountId,
  products,
  totalAmount,
  onAccountChange,
  onProductSelectionChange,
  onProductAmountChange,
  onNeedMoreBalance,
  hideBalances,
}) => {
  return (
    <Card className="p-6 space-y-6">
      {/* Title with Beneficiary Name */}
      <h2 className="text-lg font-bold text-[#1D4E8F]">
        Pago de {beneficiaryName}
      </h2>

      {/* Source Account Selection */}
      <div className="space-y-2">
        <label className="block text-[15px] text-black">
          ¿De cuál cuenta quiere pagar?
        </label>
        <div className="flex items-center justify-between gap-4">
          <select
            value={selectedAccountId}
            onChange={(e) => onAccountChange(e.target.value)}
            className="flex-1 h-11 px-3 rounded-md border border-[#B1B1B1] text-base text-black bg-white focus:border-[#007FFF] focus:ring-2 focus:ring-[#007FFF] focus:outline-none"
          >
            <option value="">Seleccionar cuenta</option>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.type} - Saldo: {hideBalances ? maskCurrency() : formatCurrency(account.balance)}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onNeedMoreBalance}
            className="text-xs text-[#1D4E8F] hover:underline whitespace-nowrap"
          >
            ¿Necesitas más saldo?
          </button>
        </div>
      </div>

      {/* Products Selection Section */}
      <div className="space-y-3">
        <label className="block text-[15px] text-black">
          Selecciona el/los producto(s) a pagar:
        </label>
        <div className="space-y-4">
          {products.map((product) => (
            <PayableProductCard
              key={product.id}
              product={product}
              onSelectionChange={(selected) =>
                onProductSelectionChange(product.id, selected)
              }
              onAmountChange={(amount) =>
                onProductAmountChange(product.id, amount)
              }
              hideBalances={hideBalances}
            />
          ))}
        </div>
      </div>

      {/* Payment Summary */}
      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-bold text-[#1D4E8F]">
          Resumen del Pago
        </h3>

        <Divider />

        <div className="flex justify-between items-center">
          <span className="text-xl font-bold text-[#1D4E8F]">
            Total a Pagar:
          </span>
          <span className="text-xl font-medium text-black">
            {hideBalances ? maskCurrency() : formatCurrency(totalAmount)}
          </span>
        </div>
      </div>
    </Card>
  );
};
