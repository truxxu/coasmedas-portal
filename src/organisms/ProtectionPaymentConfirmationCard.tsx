"use client";

import React from "react";
import { Card, Button, Divider } from "@/src/atoms";
import { ConfirmationRow } from "@/src/molecules";
import type { ProtectionPaymentConfirmationData } from "@/src/types";
import { formatCurrency, maskCurrency } from "@/src/utils";

interface ProtectionPaymentConfirmationCardProps {
  confirmation: ProtectionPaymentConfirmationData;
  onBack: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  hideBalances?: boolean;
}

export const ProtectionPaymentConfirmationCard: React.FC<
  ProtectionPaymentConfirmationCardProps
> = ({
  confirmation,
  onBack,
  onConfirm,
  isLoading = false,
  hideBalances = false,
}) => {
  return (
    <Card className="p-4 sm:p-6 space-y-5 sm:space-y-6">
      {/* Card Title */}
      <div className="space-y-2">
        <h2 className="text-lg font-bold text-brand-navy">
          Confirmacion de Pagos
        </h2>
        <p className="text-[15px] text-black">
          Por favor, verifica que los datos de la transacción sean correctos
          antes de continuar.
        </p>
      </div>

      {/* User Info Section */}
      <div className="space-y-1">
        <ConfirmationRow label="Titular" value={confirmation.holderName} />
        <ConfirmationRow
          label="Documento"
          value={confirmation.holderDocument}
        />
      </div>

      <Divider />

      {/* Product Info Section */}
      <div className="space-y-1">
        <ConfirmationRow
          label="Producto a Pagar"
          value={confirmation.productToPay}
        />
        <ConfirmationRow
          label="Numero de Poliza"
          value={confirmation.policyNumber}
        />
        <ConfirmationRow
          label="Producto a Debitar"
          value={confirmation.productToDebit}
        />
      </div>

      {/* Amount Section */}
      <div className="flex justify-between items-center">
        <span className="text-[15px] font-bold text-black">Valor a Pagar:</span>
        <span className="text-lg font-bold text-brand-navy-dark">
          {hideBalances
            ? maskCurrency()
            : formatCurrency(confirmation.amountToPay)}
        </span>
      </div>

      {/* Footer Actions */}
      <div className="flex justify-between items-center pt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="text-sm font-medium text-brand-navy hover:underline disabled:opacity-50"
        >
          Volver
        </button>
        <Button variant="primary" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? "Procesando..." : "Confirmar Pago"}
        </Button>
      </div>
    </Card>
  );
};
