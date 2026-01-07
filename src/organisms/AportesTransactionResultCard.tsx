"use client";

import React from "react";
import { Card, Divider } from "@/src/atoms";
import { AportesTransactionResult } from "@/src/types/aportes-payment";
import { formatCurrency, maskCurrency } from "@/src/utils";

interface AportesTransactionResultCardProps {
  result: AportesTransactionResult;
  hideBalances: boolean;
}

export const AportesTransactionResultCard: React.FC<
  AportesTransactionResultCardProps
> = ({ result, hideBalances }) => {
  const isSuccess = result.status === "success";

  const displayAmount = (amount: number) =>
    hideBalances ? maskCurrency() : formatCurrency(amount);

  return (
    <Card className="p-6 md:p-8 space-y-6">
      {/* Success/Error Icon */}
      <div className="flex justify-center">
        {isSuccess ? (
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-brand-success-icon flex items-center justify-center">
            <svg
              className="w-8 h-8 md:w-10 md:h-10 text-brand-success-icon"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
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
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-brand-error flex items-center justify-center">
            <svg
              className="w-8 h-8 md:w-10 md:h-10 text-brand-error"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
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
      <h2 className="text-xl md:text-[22px] font-bold text-brand-navy text-center">
        {isSuccess ? "Transacción Exitosa" : "Transacción Fallida"}
      </h2>

      {/* Transaction Details Section 1 */}
      <div className="space-y-3">
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-brand-text-black">Linea crédito:</span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {result.lineaCredito}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-brand-text-black">
            Numero de producto:
          </span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {result.numeroProducto}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-brand-text-black">Valor pagado:</span>
          <span className="text-lg font-medium text-brand-navy">
            {displayAmount(result.valorPagado)}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-brand-text-black">Costo transacción:</span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {formatCurrency(result.costoTransaccion)}
          </span>
        </div>
      </div>

      <Divider />

      {/* Transaction Details Section 2 */}
      <div className="space-y-3">
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-brand-text-black">
            Fecha de Transmision:
          </span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {result.fechaTransmision}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-brand-text-black">
            Hora de Transacción:
          </span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {result.horaTransaccion}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-brand-text-black">
            Numero de Aprobacion:
          </span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {result.numeroAprobacion}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-brand-text-black">Descripcion:</span>
          <span
            className={`text-[15px] font-medium ${
              isSuccess ? "text-brand-success-icon" : "text-brand-error"
            }`}
          >
            {result.descripcion}
          </span>
        </div>
      </div>
    </Card>
  );
};
