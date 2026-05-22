"use client";

import { Card, Divider } from "@/src/atoms";
import type { BrebQrPaymentResult } from "@/src/types/brebQrPayment";
import { formatCurrency, maskCurrency } from "@/src/utils";

interface BrebQrPaymentResultCardProps {
  result: BrebQrPaymentResult;
  hideBalances: boolean;
}

export function BrebQrPaymentResultCard({
  result,
  hideBalances,
}: BrebQrPaymentResultCardProps) {
  const isSuccess = result.status === "success";

  return (
    <Card className="space-y-6 p-8">
      <div className="flex flex-col items-center gap-3">
        <div
          className={`w-[60px] h-[60px] rounded-full flex items-center justify-center border-2 ${
            isSuccess ? "border-brand-success-icon" : "border-brand-error"
          }`}
        >
          {isSuccess ? (
            <svg
              className="w-8 h-8 text-brand-success-icon"
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

        <h2
          className={`text-[22px] font-bold ${
            isSuccess ? "text-brand-navy" : "text-brand-error"
          }`}
        >
          {isSuccess ? "Transacción Exitosa" : "Transacción Fallida"}
        </h2>
        {isSuccess && (
          <p className="text-[14px] text-brand-text-black">
            Tu pago fue procesado.
          </p>
        )}
      </div>

      <Divider />

      {isSuccess ? (
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2">
            <span className="text-[14px] text-brand-text-black">
              Destinatario:
            </span>
            <span className="text-[15px] font-medium text-brand-text-black">
              {result.destinationName}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-[14px] text-brand-text-black">Llave:</span>
            <span className="text-[15px] font-medium text-brand-text-black">
              {result.destinationKey}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-[14px] text-brand-text-black">
              Valor pagado:
            </span>
            <span className="text-[18px] font-medium text-brand-text-black">
              {hideBalances ? maskCurrency() : formatCurrency(result.amount)}
            </span>
          </div>

          <Divider />

          <div className="flex justify-between items-center py-2">
            <span className="text-[14px] text-brand-text-black">
              Fecha de Transacción:
            </span>
            <span className="text-[15px] font-medium text-brand-text-black">
              {result.transactionDate}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-[14px] text-brand-text-black">
              Hora de Transacción:
            </span>
            <span className="text-[15px] font-medium text-brand-text-black">
              {result.transactionTime}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-[14px] text-brand-text-black">
              Número de Referencia:
            </span>
            <span className="text-[15px] font-medium text-brand-text-black">
              {result.referenceNumber}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-[14px] text-brand-text-black">
              Medio de Pago Origen:
            </span>
            <span className="text-[15px] font-medium text-brand-text-black">
              {result.sourceAccount}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-[14px] text-brand-text-black">
              Estado de la Operación:
            </span>
            <span className="text-[15px] font-medium text-brand-success-icon">
              Exitosa
            </span>
          </div>
        </div>
      ) : (
        <div className="text-center py-4">
          <p className="text-[15px] text-brand-text-black">
            {result.errorMessage ||
              "Ha ocurrido un error al procesar la transacción."}
          </p>
        </div>
      )}
    </Card>
  );
}
