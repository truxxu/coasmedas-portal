"use client";

import { Card, Divider } from "@/src/atoms";
import type { CupoRotativoTransferResult } from "@/src/types";
import { formatCurrency, maskCurrency } from "@/src/utils";

interface CupoRotativoResultCardProps {
  result: CupoRotativoTransferResult;
  hideBalances: boolean;
}

export function CupoRotativoResultCard({
  result,
  hideBalances,
}: CupoRotativoResultCardProps) {
  const isSuccess = result.status === "success";

  return (
    <Card className="space-y-6 p-8">
      {/* Success/Error Icon */}
      <div className="flex flex-col items-center gap-4">
        <div
          className={`w-[60px] h-[60px] rounded-full flex items-center justify-center border-2 ${
            isSuccess ? "border-brand-teal" : "border-brand-error"
          }`}
        >
          {isSuccess ? (
            <svg
              className="w-8 h-8 text-brand-teal"
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
          ) : (
            <svg
              className="w-8 h-8 text-brand-error"
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
          )}
        </div>

        <h2 className="text-[22px] font-bold text-brand-navy">
          {isSuccess ? "Transacción Exitosa" : "Transacción Fallida"}
        </h2>
      </div>

      {/* Transfer Details */}
      <div className="space-y-3">
        <div className="flex justify-between items-center py-1">
          <span className="text-[15px] text-brand-text-black">
            Cuenta Origen:
          </span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {result.sourceAccount}
          </span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-[15px] text-brand-text-black">
            Cuenta Destino:
          </span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {result.destinationAccount}
          </span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-[15px] text-brand-text-black">
            Valor Transferido:
          </span>
          <span className="text-[17px] font-bold text-brand-text-black">
            {hideBalances
              ? maskCurrency()
              : formatCurrency(result.amountTransferred)}
          </span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-[15px] text-brand-text-black">
            Costo Transacción:
          </span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {formatCurrency(result.transactionCost)}
          </span>
        </div>

        <Divider />

        <div className="flex justify-between items-center py-1">
          <span className="text-[15px] text-brand-text-black">
            Fecha de Transacción:
          </span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {result.transactionDate}
          </span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-[15px] text-brand-text-black">
            Hora de Transacción:
          </span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {result.transactionTime}
          </span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-[15px] text-brand-text-black">
            Número de Aprobación:
          </span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {result.approvalNumber}
          </span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-[15px] text-brand-text-black">
            Descripción:
          </span>
          <span
            className={`text-[15px] font-medium ${
              isSuccess ? "text-brand-teal" : "text-brand-error"
            }`}
          >
            {result.description}
          </span>
        </div>
      </div>
    </Card>
  );
}
