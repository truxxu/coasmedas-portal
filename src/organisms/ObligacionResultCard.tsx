"use client";

import React from "react";
import { Card, Divider } from "@/src/atoms";
import { ObligacionTransactionResult } from "@/src/types/obligacion-payment";
import { formatCurrency, maskCurrency } from "@/src/utils";

interface ObligacionResultCardProps {
  result: ObligacionTransactionResult;
  hideBalances: boolean;
}

export const ObligacionResultCard: React.FC<ObligacionResultCardProps> = ({
  result,
  hideBalances,
}) => {
  const isSuccess = result.status === "success";

  return (
    <Card className="space-y-6 p-6">
      {/* Success/Error Icon */}
      <div className="flex justify-center">
        {isSuccess ? (
          <div className="w-16 h-16 rounded-full border-4 border-[#00AFA9] flex items-center justify-center">
            <svg
              className="w-8 h-8 text-[#00A44C]"
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
          <div className="w-16 h-16 rounded-full border-4 border-[#FF0D00] flex items-center justify-center">
            <svg
              className="w-8 h-8 text-[#FF0D00]"
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
      <h2 className="text-[22px] font-bold text-[#1D4E8F] text-center">
        {isSuccess ? "Transacción Exitosa" : "Transacción Fallida"}
      </h2>

      <Divider />

      {/* Transaction Details Section 1 */}
      <div className="space-y-3">
        <div className="flex justify-between py-2">
          <span className="text-[15px] text-black">Línea crédito:</span>
          <span className="text-[15px] font-medium text-black">
            {result.lineaCredito}
          </span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-[15px] text-black">Número de producto:</span>
          <span className="text-[15px] font-medium text-black">
            {result.numeroProducto}
          </span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-[15px] text-black">Valor pagado:</span>
          <span className="text-lg font-medium text-black">
            {hideBalances ? maskCurrency() : formatCurrency(result.valorPagado)}
          </span>
        </div>
      </div>

      {/* Transaction Details Section 2 */}
      <div className="space-y-3">
        <div className="flex justify-between py-2">
          <span className="text-[15px] text-black">Costo Transacción:</span>
          <span className="text-[15px] font-medium text-black">
            {formatCurrency(result.costoTransaccion)}
          </span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-[15px] text-black">Abono Excedente:</span>
          <span className="text-[15px] font-medium text-black">
            {result.abonoExcedente}
          </span>
        </div>
      </div>

      <Divider />

      {/* Transaction Details Section 3 */}
      <div className="space-y-3">
        <div className="flex justify-between py-2">
          <span className="text-[15px] text-black">Fecha de Transmisión:</span>
          <span className="text-[15px] font-medium text-black">
            {result.fechaTransmision}
          </span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-[15px] text-black">Hora de Transacción:</span>
          <span className="text-[15px] font-medium text-black">
            {result.horaTransaccion}
          </span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-[15px] text-black">Número de Aprobación:</span>
          <span className="text-[15px] font-medium text-black">
            {result.numeroAprobacion}
          </span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-[15px] text-black">Descripción:</span>
          <span
            className={`text-[15px] font-medium ${
              isSuccess ? "text-[#00A44C]" : "text-[#FF0D00]"
            }`}
          >
            {result.descripcion}
          </span>
        </div>
      </div>
    </Card>
  );
};
