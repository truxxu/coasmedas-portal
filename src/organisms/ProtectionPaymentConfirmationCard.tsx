"use client";

import React from "react";
import { Card, Divider } from "@/src/atoms";
import { ConfirmationRow } from "@/src/molecules";
import type { ProtectionPaymentConfirmationData } from "@/src/types";
import { formatCurrency, maskCurrency } from "@/src/utils";

interface ProtectionPaymentConfirmationCardProps {
  confirmation: ProtectionPaymentConfirmationData;
  hideBalances?: boolean;
}

export const ProtectionPaymentConfirmationCard: React.FC<
  ProtectionPaymentConfirmationCardProps
> = ({ confirmation, hideBalances = false }) => {
  return (
    <Card className="p-4 sm:p-6 space-y-5 sm:space-y-6">
      {/* Card Title */}
      <div className="space-y-2">
        <h2 className="text-lg font-bold text-brand-navy">
          Confirmación de Pagos
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
          label="Número de Poliza"
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
    </Card>
  );
};
