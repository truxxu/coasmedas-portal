"use client";

import React from "react";
import { Card, Divider } from "@/src/atoms";
import { NetworkTransferResult } from "@/src/types/networkTransfer";
import { formatCurrency, maskCurrency } from "@/src/utils";

interface NetworkTransferResultCardProps {
  result: NetworkTransferResult;
  hideBalances: boolean;
}

export function NetworkTransferResultCard({
  result,
  hideBalances,
}: NetworkTransferResultCardProps) {
  const isSuccess = result.status === "success";

  return (
    <Card className="p-6 space-y-6">
      {/* Success/Error Icon */}
      <div className="flex flex-col items-center gap-4">
        <div
          className={`
            w-[60px] h-[60px] rounded-full
            flex items-center justify-center
            border-2
            ${isSuccess ? "border-[#00AFA9]" : "border-[#FF0D00]"}
          `}
        >
          {isSuccess ? (
            <svg
              className="w-8 h-8 text-[#00AFA9]"
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
          )}
        </div>

        <h2 className="text-[22px] font-bold text-[#1D4E8F]">
          {isSuccess ? "Transacción Exitosa" : "Transacción Fallida"}
        </h2>
      </div>

      {/* Transfer Details - Section 1 */}
      <div className="space-y-3">
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-black">Cuenta Origen:</span>
          <span className="text-[15px] font-medium text-black text-right">
            {result.sourceAccount}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-black">Destinatario:</span>
          <span className="text-[15px] font-medium text-black text-right">
            {result.recipientName}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-black">Cuenta Destino:</span>
          <span className="text-[15px] font-medium text-black text-right">
            {result.destinationAccount}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-black">Valor Transferido:</span>
          <span className="text-[15px] font-medium text-black">
            {hideBalances
              ? maskCurrency()
              : formatCurrency(result.amountTransferred)}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-black">Costo Transacción:</span>
          <span className="text-[15px] font-medium text-black">
            {formatCurrency(result.transactionCost)}
          </span>
        </div>
      </div>

      <Divider />

      {/* Transaction Metadata - Section 2 */}
      <div className="space-y-3">
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-black">Fecha de Transacción:</span>
          <span className="text-[15px] font-medium text-black">
            {result.transactionDate}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-black">Hora de Transacción:</span>
          <span className="text-[15px] font-medium text-black">
            {result.transactionTime}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-black">Número de Aprobación:</span>
          <span className="text-[15px] font-medium text-black">
            {result.approvalNumber}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-black">Descripción:</span>
          <span
            className={`text-[15px] font-medium ${isSuccess ? "text-[#00A44C]" : "text-[#FF0D00]"}`}
          >
            {result.description}
          </span>
        </div>
      </div>
    </Card>
  );
}
