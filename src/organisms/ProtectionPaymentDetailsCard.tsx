'use client';

import React from 'react';
import { Card, Button } from '@/src/atoms';
import { ProtectionPaymentCard } from '@/src/molecules';
import type {
  ProtectionPaymentSourceAccount,
  ProtectionPaymentProduct,
} from '@/src/types/protection-payment';
import { formatCurrency, maskCurrency } from '@/src/utils';

interface ProtectionPaymentDetailsCardProps {
  sourceAccounts: ProtectionPaymentSourceAccount[];
  products: ProtectionPaymentProduct[];
  selectedAccountId: string;
  selectedProduct: ProtectionPaymentProduct | null;
  onAccountChange: (accountId: string) => void;
  onProductSelect: (product: ProtectionPaymentProduct) => void;
  onBack: () => void;
  onContinue: () => void;
  errors?: {
    sourceAccount?: string;
    product?: string;
  };
  isLoading?: boolean;
  hideBalances?: boolean;
}

export const ProtectionPaymentDetailsCard: React.FC<ProtectionPaymentDetailsCardProps> = ({
  sourceAccounts,
  products,
  selectedAccountId,
  selectedProduct,
  onAccountChange,
  onProductSelect,
  onBack,
  onContinue,
  errors = {},
  isLoading = false,
  hideBalances = false,
}) => {
  const getAccountDisplayName = (account: ProtectionPaymentSourceAccount): string => {
    const accountType = account.type === 'ahorros' ? 'Cuenta de Ahorros' : 'Cuenta Corriente';
    const balance = hideBalances ? maskCurrency() : formatCurrency(account.balance);
    return `${accountType} - Saldo: ${balance}`;
  };

  return (
    <Card className="p-4 sm:p-6 space-y-5 sm:space-y-6">
      {/* Card Title */}
      <h2 className="text-lg font-bold text-[#194E8D]">
        Pago de Proteccion
      </h2>

      {/* Source Account Section */}
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
          <label className="block text-[15px] text-black">
            De cual cuenta quiere pagar?
          </label>
          <a
            href="/productos/ahorros"
            className="text-xs text-[#1D4E8F] hover:underline"
          >
            Necesitas mas saldo?
          </a>
        </div>
        <select
          value={selectedAccountId}
          onChange={(e) => onAccountChange(e.target.value)}
          className={`
            w-full h-11 px-3 rounded-md border text-base text-black bg-white
            focus:outline-none focus:ring-2 focus:ring-[#007FFF]
            ${errors.sourceAccount ? 'border-[#FF0D00]' : 'border-[#B1B1B1]'}
          `}
        >
          <option value="">Seleccionar cuenta</option>
          {sourceAccounts.map((account) => (
            <option key={account.id} value={account.id}>
              {getAccountDisplayName(account)}
            </option>
          ))}
        </select>
        {errors.sourceAccount && (
          <p className="text-sm text-[#FF0D00]">{errors.sourceAccount}</p>
        )}
      </div>

      {/* Product Selection Section */}
      <div className="space-y-3">
        <label className="block text-[15px] text-black">
          Selecciona el producto que deseas pagar
        </label>

        {/* Product Cards - Horizontal Scroll */}
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {products.map((product) => (
            <ProtectionPaymentCard
              key={product.id}
              product={product}
              isSelected={selectedProduct?.id === product.id}
              onSelect={onProductSelect}
              hideBalances={hideBalances}
            />
          ))}
        </div>

        {/* Helper Text */}
        <p className="text-sm text-[#636363] text-center">
          Selecciona el producto que deseas pagar
        </p>

        {errors.product && (
          <p className="text-sm text-[#FF0D00] text-center">{errors.product}</p>
        )}
      </div>

      {/* Footer Actions */}
      <div className="flex justify-between items-center pt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="text-sm font-medium text-[#1D4E8F] hover:underline disabled:opacity-50"
        >
          Volver
        </button>
        <Button
          variant="primary"
          onClick={onContinue}
          disabled={isLoading}
        >
          {isLoading ? 'Procesando...' : 'Continuar'}
        </Button>
      </div>
    </Card>
  );
};
