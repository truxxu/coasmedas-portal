"use client";

import React from "react";
import { Card } from "@/src/atoms";
import { TransactionResult } from "@/src/types/payment";
import { formatCurrency } from "@/src/utils";

interface TransactionResultCardProps {
  result: TransactionResult;
}

export const TransactionResultCard: React.FC<TransactionResultCardProps> = ({
  result,
}) => {
  const isSuccess = result.status === "success";

  return (
    <Card className="p-6 md:p-8 mx-auto w-full">
      {/* Icon */}
      <div className="flex justify-center mb-4">
        {isSuccess ? (
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-brand-success flex items-center justify-center">
            <svg
              className="w-8 h-8 md:w-10 md:h-10 text-brand-success"
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

      {/* Title */}
      <h2 className="text-xl md:text-2xl font-bold text-brand-navy text-center mb-6">
        {isSuccess ? "Transacción Exitosa" : "Transacción Fallida"}
      </h2>

      {/* Transaction Details */}
      <div className="space-y-3">
        <div className="flex justify-between items-center py-4 border-b border-t border-brand-border">
          <span className="text-sm md:text-base text-brand-gray-high">
            Costo Transacción:
          </span>
          <span className="text-sm md:text-base text-brand-text-black">
            {formatCurrency(result.transactionCost)}
          </span>
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="text-sm md:text-base text-brand-gray-high">
            Fecha de Transacción:
          </span>
          <span className="text-sm md:text-base text-brand-text-black">
            {result.transactionDate}
          </span>
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="text-sm md:text-base text-brand-gray-high">
            Hora de Transacción:
          </span>
          <span className="text-sm md:text-base text-brand-text-black">
            {result.transactionTime}
          </span>
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="text-sm md:text-base text-brand-gray-high">
            Número Aprobación:
          </span>
          <span className="text-sm md:text-base text-brand-text-black">
            {result.approvalNumber}
          </span>
        </div>

        <div className="flex justify-between items-center py-2">
          <span className="text-sm md:text-base text-brand-gray-high">
            Descripción:
          </span>
          <span
            className={`text-sm md:text-base font-medium ${
              isSuccess ? "text-brand-success" : "text-brand-error"
            }`}
          >
            {result.description}
          </span>
        </div>
      </div>
    </Card>
  );
};
