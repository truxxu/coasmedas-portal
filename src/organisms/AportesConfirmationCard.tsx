'use client';

import React from 'react';
import { Card, Divider } from '@/src/atoms';
import { AportesConfirmationData } from '@/src/types/aportes-payment';
import { formatCurrency, maskCurrency } from '@/src/utils';

interface AportesConfirmationCardProps {
  confirmationData: AportesConfirmationData;
  hideBalances: boolean;
}

export const AportesConfirmationCard: React.FC<AportesConfirmationCardProps> = ({
  confirmationData,
  hideBalances,
}) => {
  const displayAmount = (amount: number) =>
    hideBalances ? maskCurrency() : formatCurrency(amount);

  return (
    <Card className="p-6 md:p-8 space-y-6">
      {/* Title */}
      <h2 className="text-xl md:text-2xl font-bold text-[#1D4E8F]">
        Confirmacion de Pagos
      </h2>

      {/* Description */}
      <p className="text-[15px] text-[#111827]">
        Por favor, verifica que los datos de la transaccion sean correctos
        antes de continuar.
      </p>

      {/* User Info Section */}
      <div className="space-y-3">
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-[#111827]">Titular:</span>
          <span className="text-[15px] font-medium text-[#111827]">
            {confirmationData.titular}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-[#111827]">Documento:</span>
          <span className="text-[15px] font-medium text-[#111827]">
            {confirmationData.documento}
          </span>
        </div>
      </div>

      <Divider />

      {/* Payment Info Section */}
      <div className="space-y-3">
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-[#111827]">Producto a Pagar:</span>
          <span className="text-[15px] font-medium text-[#111827]">
            {confirmationData.productoAPagar}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-[#111827]">Numero de Producto:</span>
          <span className="text-[15px] font-medium text-[#111827]">
            {confirmationData.numeroProducto}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-[#111827]">Producto a Debitar:</span>
          <span className="text-[15px] font-medium text-[#111827]">
            {confirmationData.productoADebitar}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-[#111827]">Valor a Pagar:</span>
          <span className="text-[15px] font-medium text-[#111827]">
            {displayAmount(confirmationData.valorAPagar)}
          </span>
        </div>
      </div>
    </Card>
  );
};
