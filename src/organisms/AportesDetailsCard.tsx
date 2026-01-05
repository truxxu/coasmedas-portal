'use client';

import React from 'react';
import { Card, Divider, CurrencyInput } from '@/src/atoms';
import { AportesPaymentDetailRow } from '@/src/molecules';
import { PaymentAccount } from '@/src/types/payment';
import { AportesPaymentBreakdown } from '@/src/types/aportes-payment';
import { formatCurrency, maskCurrency } from '@/src/utils';

interface AportesDetailsCardProps {
  accounts: PaymentAccount[];
  paymentBreakdown: AportesPaymentBreakdown;
  selectedAccountId: string;
  valorAPagar: number;
  onAccountChange: (accountId: string) => void;
  onValorChange: (valor: number) => void;
  onNeedMoreBalance: () => void;
  hideBalances: boolean;
}

export const AportesDetailsCard: React.FC<AportesDetailsCardProps> = ({
  accounts,
  paymentBreakdown,
  selectedAccountId,
  valorAPagar,
  onAccountChange,
  onValorChange,
  onNeedMoreBalance,
  hideBalances,
}) => {
  const accountOptions = accounts.map((account) => ({
    value: account.id,
    label: `${account.name} - Saldo: ${
      hideBalances ? maskCurrency() : formatCurrency(account.balance)
    }`,
  }));

  return (
    <Card className="space-y-6 p-6 md:p-8">
      {/* Title */}
      <h2 className="text-xl md:text-2xl font-bold text-[#1D4E8F]">
        Pago de Aportes
      </h2>

      {/* Account Selector Section */}
      <div className="space-y-2">
        <label className="block text-base font-medium text-[#111827]">
          De cual cuenta quiere pagar?
        </label>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <select
            value={selectedAccountId}
            onChange={(e) => onAccountChange(e.target.value)}
            className="w-full sm:flex-1 h-11 px-3 rounded-md border border-[#B1B1B1] text-base text-[#111827] focus:border-[#007FFF] focus:ring-2 focus:ring-[#007FFF] focus:outline-none"
          >
            <option value="">Seleccionar cuenta</option>
            {accountOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={onNeedMoreBalance}
            className="text-sm text-[#1D4E8F] hover:underline whitespace-nowrap self-end sm:self-auto"
          >
            Necesitas mas saldo?
          </button>
        </div>
      </div>

      {/* Payment Breakdown Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-[#1D4E8F]">
          Detalle del Pago - {paymentBreakdown.planName}
        </h3>

        <Divider />

        {/* Vigentes Section */}
        <AportesPaymentDetailRow
          label="Aportes Vigentes:"
          value={formatCurrency(paymentBreakdown.aportesVigentes)}
          hideValue={hideBalances}
        />
        <AportesPaymentDetailRow
          label="Fondo de Solidaridad Vigente:"
          value={formatCurrency(paymentBreakdown.fondoSolidaridadVigente)}
          hideValue={hideBalances}
        />

        {/* Mora Section - Always show in red */}
        <AportesPaymentDetailRow
          label="Aportes en Mora:"
          value={formatCurrency(paymentBreakdown.aportesEnMora)}
          valueColor="red"
          hideValue={hideBalances}
        />
        <AportesPaymentDetailRow
          label="Fondo de Solidaridad en Mora:"
          value={formatCurrency(paymentBreakdown.fondoSolidaridadEnMora)}
          valueColor="red"
          hideValue={hideBalances}
        />

        <Divider />

        {/* Additional Info */}
        <AportesPaymentDetailRow
          label="Fecha Limite de Pago:"
          value={paymentBreakdown.fechaLimitePago}
        />
        <AportesPaymentDetailRow
          label="Costo de la Transaccion:"
          value={formatCurrency(paymentBreakdown.costoTransaccion)}
        />

        <Divider />

        {/* Editable Value Section */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 pt-2">
          <span className="text-sm font-medium text-[#1D4E8F]">Valor</span>
          <CurrencyInput
            value={valorAPagar}
            onChange={onValorChange}
            prefix="$"
          />
        </div>
      </div>
    </Card>
  );
};
