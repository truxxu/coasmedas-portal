"use client";

import React from "react";
import { Card, Button, Divider } from "@/src/atoms";
import { ConfirmationRow } from "@/src/molecules";
import type { UtilityPaymentConfirmation } from "@/src/types";
import { formatCurrency, maskCurrency } from "@/src/utils";

interface UtilityPaymentConfirmationCardProps {
  confirmation: UtilityPaymentConfirmation;
  hideBalances: boolean;
  onConfirm: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export function UtilityPaymentConfirmationCard({
  confirmation,
  hideBalances,
  onConfirm,
  onBack,
  isLoading = false,
}: UtilityPaymentConfirmationCardProps) {
  return (
    <Card className="p-6 md:p-8 space-y-6">
      {/* Title */}
      <h2 className="text-lg font-bold text-[#004266]">Confirmacion de Pago</h2>

      {/* Description */}
      <p className="text-[15px] text-black">
        Por favor, verifica que los datos de la transacción sean correctos antes
        de continuar.
      </p>

      {/* Confirmation Details */}
      <div className="space-y-1">
        <ConfirmationRow
          label="Nombre del Titular:"
          value={confirmation.holderName}
        />
        <ConfirmationRow
          label="Documento Titular:"
          value={confirmation.holderDocument}
        />

        <Divider className="my-3" />

        <ConfirmationRow
          label="Servicio a Pagar:"
          value={confirmation.serviceToPay}
        />
        <ConfirmationRow
          label="Referencia (Factura):"
          value={confirmation.invoiceReference}
        />
        <ConfirmationRow
          label="Producto a Debitar:"
          value={confirmation.productToDebit}
        />
      </div>

      <Divider />

      {/* Total Amount */}
      <div className="flex justify-between items-center">
        <span className="text-[15px] font-bold text-black">Valor Total:</span>
        <span className="text-lg font-bold text-black">
          {hideBalances
            ? maskCurrency()
            : formatCurrency(confirmation.totalAmount)}
        </span>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="text-sm font-medium text-[#004266] hover:underline disabled:opacity-50"
        >
          Volver
        </button>
        <Button variant="primary" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? "Procesando..." : "Confirmar Pago"}
        </Button>
      </div>
    </Card>
  );
}
