"use client";

import React from "react";
import { Card, Checkbox, Divider } from "@/src/atoms";
import { TarjetaPaymentConfirmationData } from "@/src/types/tarjeta-payment";
import { formatCurrency, maskCurrency } from "@/src/utils";

interface TarjetaPaymentConfirmationCardProps {
  confirmationData: TarjetaPaymentConfirmationData;
  hideBalances: boolean;
  termsAccepted: boolean;
  onTermsChange: (accepted: boolean) => void;
}

export const TarjetaPaymentConfirmationCard: React.FC<
  TarjetaPaymentConfirmationCardProps
> = ({ confirmationData, hideBalances, termsAccepted, onTermsChange }) => {
  const displayAmount = (amount: number) =>
    hideBalances ? maskCurrency() : formatCurrency(amount);

  return (
    <Card className="space-y-6 p-6">
      <h2 className="text-lg font-bold text-brand-navy">
        Confirmación de Pago
      </h2>

      <p className="text-[14px] text-brand-navy-alt">
        Por favor, verifica que los datos de la transacción sean correctos antes
        de continuar.
      </p>

      <div className="space-y-3">
        <div className="flex justify-between py-2">
          <span className="text-[14px] text-brand-navy-alt">
            Cuenta Origen:
          </span>
          <span className="text-[14px] font-medium text-brand-navy-alt">
            {confirmationData.sourceAccount}
          </span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-[14px] text-brand-navy-alt">
            Tarjeta a Pagar:
          </span>
          <span className="text-[14px] font-medium text-brand-navy-alt">
            {confirmationData.tarjetaDisplay}
          </span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-[14px] text-brand-navy-alt">
            Nuevo Saldo Estimado:
          </span>
          <span className="text-[14px] font-medium text-brand-navy-alt">
            {displayAmount(confirmationData.newEstimatedBalance)}
          </span>
        </div>
      </div>

      <Divider />

      <div className="flex justify-between py-2">
        <span className="text-[14px] text-brand-navy-alt">Valor a Pagar:</span>
        <span className="text-[14px] font-medium text-brand-navy-alt">
          {displayAmount(confirmationData.valorAPagar)}
        </span>
      </div>

      <label className="flex items-start gap-2 cursor-pointer">
        <Checkbox
          id="tarjeta-terms"
          checked={termsAccepted}
          onChange={onTermsChange}
          aria-label="Aceptar términos y condiciones"
        />
        <span className="text-[11px] text-brand-navy-alt">
          Acepto los términos y condiciones y el pagaré asociado a este pago.
        </span>
      </label>
    </Card>
  );
};
