'use client';

import React from 'react';
import { Card, Divider } from '@/src/atoms';
import { ConfirmationRow } from '@/src/molecules';
import { OtrosAsociadosConfirmationData } from '@/src/types';
import { formatCurrency, maskCurrency } from '@/src/utils';

interface OtrosAsociadosConfirmationCardProps {
  confirmationData: OtrosAsociadosConfirmationData;
  hideBalances: boolean;
}

export const OtrosAsociadosConfirmationCard: React.FC<OtrosAsociadosConfirmationCardProps> = ({
  confirmationData,
  hideBalances,
}) => {
  return (
    <Card className="p-6 space-y-6">
      {/* Title */}
      <h2 className="text-lg font-bold text-brand-navy">
        Confirmación de Pago
      </h2>

      {/* Description */}
      <p className="text-[15px] text-black">
        Por favor, verifica que los datos de la transacción sean correctos antes de continuar.
      </p>

      {/* Payer Info Section */}
      <div className="space-y-2">
        <ConfirmationRow
          label="Nombre del Titular:"
          value={confirmationData.titular}
        />
        <ConfirmationRow
          label="Documento:"
          value={confirmationData.documento}
        />
        <ConfirmationRow
          label="Producto a Debitar:"
          value={confirmationData.productoADebitar}
        />
      </div>

      {/* Products Section */}
      <div className="space-y-3">
        <h3 className="text-base font-medium text-brand-navy">
          Productos a pagar para {confirmationData.beneficiaryName}
        </h3>

        <Divider />

        <div className="space-y-2">
          {confirmationData.products.map((product, index) => (
            <ConfirmationRow
              key={index}
              label={`${product.name}:`}
              value={hideBalances ? maskCurrency() : formatCurrency(product.amount)}
            />
          ))}
        </div>
      </div>

      <Divider />

      {/* Total Section */}
      <div className="flex justify-between items-center">
        <span className="text-[15px] font-bold text-black">Valor Total:</span>
        <span className="text-lg font-bold text-black">
          {hideBalances ? maskCurrency() : formatCurrency(confirmationData.totalAmount)}
        </span>
      </div>
    </Card>
  );
};
