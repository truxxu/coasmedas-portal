'use client';

import React from 'react';
import { Card, Divider } from '@/src/atoms';
import { ConfirmationRow } from '@/src/molecules';
import { OtrosAsociadosTransactionResult } from '@/src/types';
import { formatCurrency, maskCurrency } from '@/src/utils';

interface OtrosAsociadosResultCardProps {
  result: OtrosAsociadosTransactionResult;
  hideBalances: boolean;
}

export const OtrosAsociadosResultCard: React.FC<OtrosAsociadosResultCardProps> = ({
  result,
  hideBalances,
}) => {
  const isSuccess = result.success;

  return (
    <Card className="p-6 space-y-6">
      {/* Success/Error Icon */}
      <div className="flex justify-center">
        {isSuccess ? (
          <div className="w-16 h-16 rounded-full border-4 border-brand-success-icon flex items-center justify-center">
            <svg
              className="w-8 h-8 text-brand-success-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        ) : (
          <div className="w-16 h-16 rounded-full border-4 border-brand-error flex items-center justify-center">
            <svg
              className="w-8 h-8 text-brand-error"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Result Title */}
      <h2 className="text-[22px] font-bold text-brand-navy text-center">
        {isSuccess ? 'Transacción Exitosa' : 'Transacción Fallida'}
      </h2>

      <Divider />

      {/* Transaction Details */}
      <div className="space-y-2">
        <ConfirmationRow
          label="Línea crédito:"
          value={result.creditLine}
        />
        <ConfirmationRow
          label="Número de producto:"
          value={result.productNumber}
        />
        <ConfirmationRow
          label="Valor pagado:"
          value={hideBalances ? maskCurrency() : formatCurrency(result.amountPaid)}
        />
      </div>

      <Divider />

      <ConfirmationRow
        label="Costo transacción:"
        value={formatCurrency(result.transactionCost)}
      />

      <Divider />

      <div className="space-y-2">
        <ConfirmationRow
          label="Fecha de Transmisión:"
          value={result.transmissionDate}
        />
        <ConfirmationRow
          label="Hora de Transacción:"
          value={result.transactionTime}
        />
        <ConfirmationRow
          label="Número de Aprobación:"
          value={result.approvalNumber}
        />
        <ConfirmationRow
          label="Descripción:"
          value={result.description}
          valueColor={isSuccess ? 'success' : 'error'}
        />
      </div>
    </Card>
  );
};
