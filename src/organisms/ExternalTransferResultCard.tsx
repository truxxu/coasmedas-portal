"use client";

import { Card, Divider } from "@/src/atoms";
import type { ExternalTransferResult } from "@/src/types/externalTransfer";
import { formatCurrency, maskCurrency } from "@/src/utils";

interface ExternalTransferResultCardProps {
  result: ExternalTransferResult;
  hideBalances: boolean;
}

export function ExternalTransferResultCard({
  result,
  hideBalances,
}: ExternalTransferResultCardProps) {
  const isSuccess = result.status === "success";

  return (
    <Card className="space-y-6 p-8">
      {/* Success/Error Icon */}
      <div className="flex flex-col items-center gap-4">
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
          {isSuccess ? "Transaccion Exitosa" : "Transaccion Fallida"}
        </h2>
      </div>

      {isSuccess ? (
        /* Success State - Transfer Details */
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2">
            <span className="text-[15px] text-brand-text-black">
              Cuenta Origen:
            </span>
            <span className="text-[15px] font-medium text-brand-text-black">
              {result.sourceAccount}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-[15px] text-brand-text-black">
              Banco Destino:
            </span>
            <span className="text-[15px] font-medium text-brand-text-black">
              {result.destinationBank}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-[15px] text-brand-text-black">
              Cuenta Destino:
            </span>
            <span className="text-[15px] font-medium text-brand-text-black">
              {result.destinationAccountNumber}
            </span>
          </div>

          <Divider />

          <div className="flex justify-between items-center py-2">
            <span className="text-[15px] text-brand-text-black">
              Valor Transferido:
            </span>
            <span className="text-[18px] font-medium text-brand-text-black">
              {hideBalances
                ? maskCurrency()
                : formatCurrency(result.amountTransferred)}
            </span>
          </div>
          {result.concept && (
            <div className="flex justify-between items-center py-2">
              <span className="text-[15px] text-brand-text-black">
                Concepto:
              </span>
              <span className="text-[15px] font-medium text-brand-text-black">
                {result.concept}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center py-2">
            <span className="text-[15px] text-brand-text-black">
              Costo Transaccion:
            </span>
            <span className="text-[15px] font-medium text-brand-text-black">
              {formatCurrency(result.transactionCost)}
            </span>
          </div>

          <Divider />

          <div className="flex justify-between items-center py-2">
            <span className="text-[15px] text-brand-text-black">
              Fecha de Transaccion:
            </span>
            <span className="text-[15px] font-medium text-brand-text-black">
              {result.transactionDate}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-[15px] text-brand-text-black">
              Hora de Transaccion:
            </span>
            <span className="text-[15px] font-medium text-brand-text-black">
              {result.transactionTime}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-[15px] text-brand-text-black">
              Numero de Aprobacion:
            </span>
            <span className="text-[15px] font-medium text-brand-text-black">
              {result.approvalNumber}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-[15px] text-brand-text-black">
              Descripcion:
            </span>
            <span className="text-[15px] font-medium text-brand-success-icon">
              {result.description}
            </span>
          </div>
        </div>
      ) : (
        /* Error State */
        <div className="text-center py-4">
          <p className="text-[15px] text-brand-text-black">
            {result.errorMessage || "Ha ocurrido un error al procesar la transferencia."}
          </p>
        </div>
      )}
    </Card>
  );
}
