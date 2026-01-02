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
        <h2 className="text-xl md:text-2xl font-bold text-[#1D4E8F] mb-2">
          Confirmación de Pago
        </h2>
        <p className="text-sm md:text-base text-[#58585B]">
          Por favor, verificar que los datos de la transformación sean correctos
          antes de continuar.
        </p>
      </div>

      {/* User Info */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-sm md:text-base text-[#111827]">Titular:</span>
          <span className="text-sm md:text-base text-[#111827] font-medium">
            {confirmationData.titular}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm md:text-base text-[#111827]">
            Documento:
          </span>
          <span className="text-sm md:text-base text-[#111827] font-medium">
            {confirmationData.documento}
          </span>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="border-t border-[#E4E6EA]">
        <h3 className="text-xl md:text-2xl font-bold text-[#1D4E8F] mt-2">
          Resumen del pago:
        </h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm md:text-base text-[#111827]">
              Aportes:
            </span>
            <span className="text-sm md:text-base text-[#111827]">
              {displayAmount(confirmationData.aportes)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm md:text-base text-[#111827]">
              Obligaciones:
            </span>
            <span className="text-sm md:text-base text-[#111827]">
              {displayAmount(confirmationData.obligaciones)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm md:text-base text-[#111827]">
              Protección:
            </span>
            <span className="text-sm md:text-base text-[#111827]">
              {displayAmount(confirmationData.proteccion)}
            </span>
          </div>
        </div>

        {/* Divider and Account/Total */}
        <div className="mt-4 pt-4 border-t border-[#E4E6EA] space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm md:text-base text-[#111827]">
              Producto a Debitar:
            </span>
            <span className="text-sm md:text-base text-[#111827] font-medium">
              {confirmationData.debitAccount}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm md:text-base text-[#111827]">
              Valor Total a Pagar:
            </span>
            <span className="text-base md:text-lg text-[#1D4E8F] font-bold">
              {displayAmount(confirmationData.totalAmount)}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
};
