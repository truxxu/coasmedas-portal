import React from "react";
import { Card } from "@/src/atoms";
import { PaymentConfirmationData } from "@/src/types/payment";
import { formatCurrency, maskCurrency } from "@/src/utils";

interface PaymentConfirmationCardProps {
  confirmationData: PaymentConfirmationData;
  hideBalances: boolean;
}

export const PaymentConfirmationCard: React.FC<
  PaymentConfirmationCardProps
> = ({ confirmationData, hideBalances }) => {
  const displayAmount = (amount: number) =>
    hideBalances ? maskCurrency() : formatCurrency(amount);

  return (
    <Card className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-brand-navy mb-2">
          Confirmación de Pago
        </h2>
        <p className="text-sm md:text-base text-brand-gray-high">
          Por favor, verificar que los datos de la transformación sean correctos
          antes de continuar.
        </p>
      </div>

      {/* User Info */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-sm md:text-base text-brand-text-black">Titular:</span>
          <span className="text-sm md:text-base text-brand-text-black font-medium">
            {confirmationData.titular}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm md:text-base text-brand-text-black">
            Documento:
          </span>
          <span className="text-sm md:text-base text-brand-text-black font-medium">
            {confirmationData.documento}
          </span>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="border-t border-brand-border">
        <h3 className="text-xl md:text-2xl font-bold text-brand-navy mt-2">
          Resumen del pago:
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm md:text-base text-brand-text-black">
              Aportes:
            </span>
            <span className="text-sm md:text-base text-brand-text-black">
              {displayAmount(confirmationData.aportes)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm md:text-base text-brand-text-black">
              Obligaciones:
            </span>
            <span className="text-sm md:text-base text-brand-text-black">
              {displayAmount(confirmationData.obligaciones)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm md:text-base text-brand-text-black">
              Protección:
            </span>
            <span className="text-sm md:text-base text-brand-text-black">
              {displayAmount(confirmationData.proteccion)}
            </span>
          </div>
        </div>

        {/* Divider and Account/Total */}
        <div className="mt-4 pt-4 border-t border-brand-border space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm md:text-base text-brand-text-black">
              Producto a Debitar:
            </span>
            <span className="text-sm md:text-base text-brand-text-black font-medium">
              {confirmationData.debitAccount}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm md:text-base text-brand-text-black">
              Valor Total a Pagar:
            </span>
            <span className="text-base md:text-lg text-brand-navy font-bold">
              {displayAmount(confirmationData.totalAmount)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
