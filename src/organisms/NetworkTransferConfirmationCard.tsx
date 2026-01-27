"use client";

import React from "react";
import { Card, Divider, Button } from "@/src/atoms";
import { NetworkTransferConfirmationData } from "@/src/types/networkTransfer";
import { formatCurrency, maskCurrency } from "@/src/utils";

interface NetworkTransferConfirmationCardProps {
  confirmationData: NetworkTransferConfirmationData;
  hideBalances: boolean;
  onConfirm: () => void;
  onBack: () => void;
}

export function NetworkTransferConfirmationCard({
  confirmationData,
  hideBalances,
  onConfirm,
  onBack,
}: NetworkTransferConfirmationCardProps) {
  return (
    <Card className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-brand-navy">
          Confirmacion de Pago
        </h2>
        <p className="text-[15px] text-brand-gray-high mt-1">
          Por favor, verifica que los datos de la transaccion sean correctos
          antes de continuar.
        </p>
      </div>

      {/* Holder Section */}
      <div className="space-y-3">
        <div className="flex justify-between items-center py-2">
          <span className="text-sm font-light text-brand-text-black">
            Nombre Titular:
          </span>
          <span className="text-sm text-brand-text-black text-right">
            {confirmationData.holderName}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-sm font-light text-brand-text-black">
            Documento Titular:
          </span>
          <span className="text-sm text-brand-text-black text-right">
            {confirmationData.holderDocument}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-sm font-light text-brand-text-black">
            Producto a Debitar:
          </span>
          <span className="text-sm text-brand-text-black text-right">
            {confirmationData.sourceProduct}
          </span>
        </div>
      </div>

      <Divider />

      {/* Destination Section */}
      <div className="space-y-3">
        <div className="flex justify-between items-center py-2">
          <span className="text-sm font-light text-brand-text-black">
            Titular Destino:
          </span>
          <span className="text-sm text-brand-text-black text-right">
            {confirmationData.destinationHolder}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-sm font-light text-brand-text-black">
            Banco Destino:
          </span>
          <span className="text-sm text-brand-text-black text-right">
            {confirmationData.destinationBank}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-sm font-light text-brand-text-black">
            Tipo de Cuenta:
          </span>
          <span className="text-sm text-brand-text-black text-right">
            {confirmationData.destinationAccountType}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-sm font-light text-brand-text-black">
            Cuenta Destino:
          </span>
          <span className="text-sm text-brand-text-black text-right">
            {confirmationData.destinationAccountNumber}
          </span>
        </div>
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
      </div>

      {/* Concept (if provided) */}
      {confirmationData.concept && (
        <>
          <Divider />
          <div className="flex justify-between items-center py-2">
            <span className="text-sm font-light text-brand-text-black">Concepto:</span>
            <span className="text-sm text-brand-text-black text-right">
              {confirmationData.concept}
            </span>
          </div>
        </>
      )}

      {/* Actions */}
      <div className="flex justify-between items-center pt-4">
        <button
          onClick={onBack}
          className="text-sm font-medium text-brand-teal-dark hover:underline"
        >
          Volver
        </button>
        <Button variant="primary" onClick={onConfirm}>
          Confirmar Pago
        </Button>
      </div>
    </Card>
  );
}
