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
  const displayAmount = (amount: number) =>
    hideBalances ? maskCurrency() : formatCurrency(amount);

  return (
    <Card className="space-y-6 p-6">
      {/* Title */}
      <h2 className="text-lg font-bold text-brand-navy">
        Confirmación de Pago
      </h2>

      {/* Description */}
      <p className="text-[15px] text-gray-700">
        Por favor, verifica que los datos de la transacción sean correctos antes
        de continuar.
      </p>

      {/* Section 1: User Info */}
      <div className="space-y-3">
        <div className="flex justify-between py-2">
          <span className="text-[15px] text-gray-700">Nombre del Titular:</span>
          <span className="text-[15px] font-medium text-black">
            {confirmationData.titular}
          </span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-[15px] text-gray-700">Documento:</span>
          <span className="text-[15px] font-medium text-black">
            {confirmationData.documento}
          </span>
        </div>
      </div>

      <Divider />

      {/* Section 2: Credit Details */}
      <div className="space-y-3">
        <div className="flex justify-between py-2">
          <span className="text-[15px] text-gray-700">Línea de Crédito:</span>
          <span className="text-[15px] font-medium text-black">
            {confirmationData.lineaCredito}
          </span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-[15px] text-gray-700">Fecha de Apertura:</span>
          <span className="text-[15px] font-medium text-black">
            {confirmationData.fechaApertura || "N/A"}
          </span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-[15px] text-gray-700">Saldo Total:</span>
          <span className="text-[15px] font-medium text-black">
            {displayAmount(confirmationData.saldoTotal)}
          </span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-[15px] text-gray-700">
            Fecha Límite de Pago:
          </span>
          <span className="text-[15px] font-medium text-black">
            {confirmationData.fechaLimitePago}
          </span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-[15px] text-gray-700">Valor en Mora:</span>
          <span className="text-lg font-bold text-black">
            {displayAmount(confirmationData.valorEnMora)}
          </span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-[15px] text-gray-700">Pago Mínimo:</span>
          <span className="text-[15px] font-medium text-black">
            {displayAmount(confirmationData.pagoMinimo)}
          </span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-[15px] text-gray-700">Pago Total:</span>
          <span className="text-[15px] font-medium text-black">
            {displayAmount(confirmationData.pagoTotal)}
          </span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-[15px] text-gray-700">Costo Transacción:</span>
          <span className="text-[15px] font-medium text-black">
            {displayAmount(confirmationData.costoTransaccion)}
          </span>
        </div>
      </div>

      <Divider />

      {/* Section 3: Payment Info */}
      <div className="space-y-3">
        <div className="flex justify-between py-2">
          <span className="text-[15px] text-gray-700">Producto a Debitar:</span>
          <span className="text-base font-normal text-black">
            {confirmationData.productoADebitar}
          </span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-[15px] text-gray-700">Valor a Pagar:</span>
          <span className="text-lg font-bold text-black">
            {displayAmount(confirmationData.valorAPagar)}
          </span>
        </div>
      </div>
    </Card>
  );
};
