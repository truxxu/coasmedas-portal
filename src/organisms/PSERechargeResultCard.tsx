"use client";

import { Card, Divider } from "@/src/atoms";
import type { PSERechargeResult } from "@/src/types/pseRecharge";
import { formatCurrency, maskCurrency } from "@/src/utils";

interface PSERechargeResultCardProps {
  result: PSERechargeResult;
  hideBalances: boolean;
}

export function PSERechargeResultCard({
  result,
  hideBalances,
}: PSERechargeResultCardProps) {
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
          {isSuccess ? "Transaccion Exitosa" : "Transaccion Fallida"}
        </h2>
      </div>

      {/* Recharge Details */}
      <div className="space-y-4">
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-brand-text-black">
            Producto Recargado
          </span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {result.productRecharged}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-brand-text-black">
            Valor Recargado
          </span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {hideBalances
              ? maskCurrency()
              : formatCurrency(result.amountRecharged)}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-brand-text-black">Metodo</span>
          <span className="text-[18px] font-medium text-brand-text-black">
            {result.method}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-brand-text-black">
            Costo de Transaccion
          </span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {formatCurrency(result.transactionCost)}
          </span>
        </div>

        <Divider />

        {/* Transaction Metadata */}
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-brand-text-black">
            Fecha de Transaccion
          </span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {result.transactionDate}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-brand-text-black">
            Hora de Transaccion
          </span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {result.transactionTime}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-brand-text-black">
            Número de Aprobacion
          </span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {result.approvalNumber}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-brand-text-black">Descripcion</span>
          <span
            className={`text-[15px] font-medium ${
              isSuccess ? "text-brand-success-icon" : "text-brand-error"
            }`}
          >
            {result.description}
          </span>
        </div>
      </div>
    </Card>
  );
}
