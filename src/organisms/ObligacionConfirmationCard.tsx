"use client";

import React from "react";
import { Card, Divider } from "@/src/atoms";
import { ObligacionConfirmationData } from "@/src/types/obligacion-payment";
import { formatCurrency, maskCurrency } from "@/src/utils";

interface ObligacionConfirmationCardProps {
  confirmationData: ObligacionConfirmationData;
  hideBalances: boolean;
}

export const ObligacionConfirmationCard: React.FC<
  ObligacionConfirmationCardProps
> = ({ confirmationData, hideBalances }) => {
  return (
    <Card className="space-y-6 p-6">
      {/* Title */}
      <h2 className="text-lg font-bold text-brand-navy">
        Confirmación de Pagos
      </h2>

      {/* Description */}
      <p className="text-[15px] text-black">
        Por favor, verifica que los datos de la transacción sean correctos
        antes de continuar.
      </p>

      {/* User Info Section */}
      <div className="space-y-3">
        <div className="flex justify-between py-2">
          <span className="text-[15px] text-black">Titular:</span>
          <span className="text-[15px] font-medium text-black">
            {confirmationData.titular}
          </span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-[15px] text-black">Documento:</span>
          <span className="text-[15px] font-medium text-black">
            {confirmationData.documento}
          </span>
        </div>
      </div>

      <Divider />

      {/* Payment Info Section */}
      <div className="space-y-3">
        <div className="flex justify-between py-2">
          <span className="text-[15px] text-black">Producto a Pagar:</span>
          <span className="text-[15px] font-medium text-black">
            {confirmationData.productoAPagar}
          </span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-[15px] text-black">Numero de Producto:</span>
          <span className="text-[15px] font-medium text-black">
            {confirmationData.numeroProducto}
          </span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-[15px] text-black">Producto a Debitar:</span>
          <span className="text-[15px] font-medium text-black">
            {confirmationData.productoADebitar}
          </span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-[15px] text-black">Valor a Pagar:</span>
          <span className="text-[15px] font-medium text-black">
            {hideBalances
              ? maskCurrency()
              : formatCurrency(confirmationData.valorAPagar)}
          </span>
        </div>
      </div>
    </Card>
  );
};
