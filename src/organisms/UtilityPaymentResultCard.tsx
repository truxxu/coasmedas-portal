"use client";

import React from "react";
import { Card, Button, Divider } from "@/src/atoms";
import { ConfirmationRow } from "@/src/molecules";
import type { UtilityPaymentResult } from "@/src/types";
import { formatCurrency, maskCurrency } from "@/src/utils";

interface UtilityPaymentResultCardProps {
  result: UtilityPaymentResult;
  hideBalances: boolean;
  onPrint: () => void;
  onFinish: () => void;
}

export function UtilityPaymentResultCard({
  result,
  hideBalances,
  onPrint,
  onFinish,
}: UtilityPaymentResultCardProps) {
  const isSuccess = result.success;

  return (
    <Card className="p-6 md:p-8 space-y-6">
      {/* Success/Error Icon */}
      <div className="flex justify-center">
        {isSuccess ? (
          <div className="w-16 h-16 rounded-full border-4 border-[#00A44C] flex items-center justify-center">
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
        {isSuccess ? "Transaccion Exitosa" : "Transaccion Fallida"}
      </h2>

      <Divider />

      {/* Transaction Details */}
      <div className="space-y-2">
        <ConfirmationRow label="Linea credito:" value={result.creditLine} />
        <ConfirmationRow
          label="Numero de producto:"
          value={result.productNumber}
        />
        <ConfirmationRow
          label="Valor pagado:"
          value={hideBalances ? maskCurrency() : formatCurrency(result.amountPaid)}
        />
      </div>

      <Divider />

      <ConfirmationRow
        label="Costo transaccion:"
        value={formatCurrency(result.transactionCost)}
      />

      <Divider />

      <div className="space-y-2">
        <ConfirmationRow
          label="Fecha de Transmision:"
          value={result.transmissionDate}
        />
        <ConfirmationRow
          label="Hora de Transaccion:"
          value={result.transactionTime}
        />
        <ConfirmationRow
          label="Numero de Aprobacion:"
          value={result.approvalNumber || "-"}
        />
        <ConfirmationRow
          label="Descripcion:"
          value={result.description}
          valueColor={isSuccess ? "success" : "error"}
        />
      </div>

      {/* Footer Actions */}
      <div className="flex justify-end items-center gap-4 pt-4">
        <Button variant="outline" onClick={onPrint}>
          Imprimir/Guardar
        </Button>
        <Button variant="primary" onClick={onFinish}>
          Finalizar
        </Button>
      </div>
    </Card>
  );
}
