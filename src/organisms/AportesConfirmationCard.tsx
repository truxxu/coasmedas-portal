"use client";

import React from "react";
import { Card, Divider } from "@/src/atoms";
import { AportesConfirmationData } from "@/src/types/aportes-payment";
import { formatCurrency, maskCurrency } from "@/src/utils";

interface AportesConfirmationCardProps {
  confirmationData: AportesConfirmationData;
  hideBalances: boolean;
}

export const AportesConfirmationCard: React.FC<
  AportesConfirmationCardProps
> = ({ confirmationData, hideBalances }) => {
  const displayAmount = (amount: number) =>
    hideBalances ? maskCurrency() : formatCurrency(amount);

  return (
    <Card className="p-6 md:p-8 space-y-6">
      {/* Title */}
      <h2 className="text-xl md:text-2xl font-bold text-brand-navy">
        Confirmacion de Pagos
      </h2>

      {/* Description */}
      <p className="text-[15px] text-brand-text-black">
        Por favor, verifica que los datos de la transacción sean correctos antes
        de continuar.
      </p>

      {/* User Info Section */}
      <div className="space-y-3">
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-brand-text-black">Titular:</span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {confirmationData.titular}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-brand-text-black">Documento:</span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {confirmationData.documento}
          </span>
        </div>
      </div>

      <Divider />

      {/* Payment Info Section */}
      <div className="space-y-3">
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-brand-text-black">Producto a Pagar:</span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {confirmationData.productoAPagar}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-brand-text-black">
            Numero de Producto:
          </span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {confirmationData.numeroProducto}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-brand-text-black">
            Producto a Debitar:
          </span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {confirmationData.productoADebitar}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-brand-text-black">Valor a Pagar:</span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {displayAmount(confirmationData.valorAPagar)}
          </span>
        </div>
      </div>
    </Card>
  );
};
