"use client";

import React from "react";
import { Card, Button, Divider } from "@/src/atoms";
import { ConfirmationRow } from "@/src/molecules";
import type { ProtectionPaymentResultData } from "@/src/types";
import { formatCurrency, maskCurrency } from "@/src/utils";

interface ProtectionPaymentResultCardProps {
  result: ProtectionPaymentResultData;
  onPrint: () => void;
  onFinish: () => void;
  hideBalances?: boolean;
}

export const ProtectionPaymentResultCard: React.FC<
  ProtectionPaymentResultCardProps
> = ({ result, onPrint, onFinish, hideBalances = false }) => {
  const isSuccess = result.success;

  return (
    <Card className="p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
      {/* Success/Error Icon */}
      <div className="flex justify-center">
        {isSuccess ? (
          <div className="w-16 h-16 rounded-full border-4 border-[#00A44C] flex items-center justify-center">
            <svg
              className="w-8 h-8 text-[#00A44C]"
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
          <div className="w-16 h-16 rounded-full border-4 border-[#FF0D00] flex items-center justify-center">
            <svg
              className="w-8 h-8 text-[#FF0D00]"
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
      <h2 className="text-xl sm:text-[22px] font-bold text-[#1D4E8F] text-center">
        {isSuccess ? "Transacción Exitosa" : "Transacción Fallida"}
      </h2>

      <Divider />

      {/* Transaction Details - Product Info */}
      <div className="space-y-2">
        <ConfirmationRow label="Linea crédito" value={result.creditLine} />
        <ConfirmationRow
          label="Número de producto"
          value={result.productNumber}
        />
        <ConfirmationRow
          label="Valor pagado"
          value={
            hideBalances ? maskCurrency() : formatCurrency(result.amountPaid)
          }
        />
        <ConfirmationRow
          label="Costo Transacción"
          value={formatCurrency(result.transactionCost)}
        />
      </div>

      <Divider />

      {/* Transaction Details - Date/Time Info */}
      <div className="space-y-2">
        <ConfirmationRow
          label="Fecha de Transmisión"
          value={result.transmissionDate}
        />
        <ConfirmationRow
          label="Hora de Transacción"
          value={result.transactionTime}
        />
        <ConfirmationRow
          label="Numero de Aprobación"
          value={result.approvalNumber || "-"}
        />
        <ConfirmationRow
          label="Descripción"
          value={result.description}
          valueColor={isSuccess ? "success" : "error"}
        />
      </div>

      {/* Footer Actions */}
      <div className="flex flex-col sm:flex-row justify-end items-stretch sm:items-center gap-3 sm:gap-4 pt-4">
        <Button variant="secondary" onClick={onPrint}>
          Imprimir/Guardar
        </Button>
        <Button variant="primary" onClick={onFinish}>
          Finalizar
        </Button>
      </div>
    </Card>
  );
};
