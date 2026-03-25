"use client";

import React from "react";
import { Card, Divider } from "@/src/atoms";
import { NetworkTransferConfirmationData } from "@/src/types/networkTransfer";
import { formatCurrency, maskCurrency } from "@/src/utils";

interface NetworkTransferConfirmationCardProps {
  confirmationData: NetworkTransferConfirmationData;
  hideBalances: boolean;
}

export function NetworkTransferConfirmationCard({
  confirmationData,
  hideBalances,
}: NetworkTransferConfirmationCardProps) {
  const sourceDisplay = confirmationData.sourceAccountMaskedNumber
    ? `${confirmationData.sourceProduct} (${confirmationData.sourceAccountMaskedNumber})`
    : confirmationData.sourceProduct;

  const destinationDisplay = `${confirmationData.destinationAccountType} (${confirmationData.destinationAccountNumber})`;

  return (
    <Card className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-brand-navy">
          Confirmación de Pago
        </h2>
        <p className="text-[15px] text-brand-gray-high mt-1">
          Por favor, verifica que los datos de la transaccion sean correctos
          antes de continuar.
        </p>
      </div>

      {/* Transfer Details */}
      <div className="space-y-3">
        <div className="flex justify-between items-center py-2">
          <span className="text-sm font-light text-brand-text-black">
            Nombre del Titular:
          </span>
          <span className="text-sm text-brand-text-black text-right">
            {confirmationData.holderName}
          </span>
        </div>
        <Divider />
        <div className="flex justify-between items-center py-2">
          <span className="text-sm font-light text-brand-text-black">
            Cuenta de Origen:
          </span>
          <span className="text-sm text-brand-text-black text-right">
            {sourceDisplay}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-sm font-light text-brand-text-black">
            Destinatario:
          </span>
          <span className="text-sm text-brand-text-black text-right">
            {confirmationData.destinationHolder}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-sm font-light text-brand-text-black">
            Cuenta Destino:
          </span>
          <span className="text-sm text-brand-text-black text-right">
            {destinationDisplay}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-sm font-light text-brand-text-black">
            Costo Transaccion:
          </span>
          <span className="text-sm text-brand-text-black text-right">
            {formatCurrency(confirmationData.transactionCost ?? 0)}
          </span>
        </div>
      </div>

      <Divider />

      {/* Amount */}
      <div className="flex justify-between items-center py-2">
        <span className="text-sm font-light text-brand-text-black">
          Valor a Transferir:
        </span>
        <span className="text-lg font-medium text-brand-text-black">
          {hideBalances
            ? maskCurrency()
            : formatCurrency(confirmationData.amount)}
        </span>
      </div>

      {/* Concept (if provided) */}
      {confirmationData.concept && (
        <>
          <Divider />
          <div className="flex justify-between items-center py-2">
            <span className="text-sm font-light text-brand-text-black">
              Concepto:
            </span>
            <span className="text-sm text-brand-text-black text-right">
              {confirmationData.concept}
            </span>
          </div>
        </>
      )}
    </Card>
  );
}
