"use client";

import React from "react";
import { Card, Checkbox, Divider } from "@/src/atoms";
import { TarjetaAvanceConfirmationData } from "@/src/types/tarjeta-avance";
import { formatCurrency, maskCurrency } from "@/src/utils";

interface TarjetaAvanceConfirmationCardProps {
  confirmationData: TarjetaAvanceConfirmationData;
  hideBalances: boolean;
  termsAccepted: boolean;
  onTermsChange: (accepted: boolean) => void;
}

export const TarjetaAvanceConfirmationCard: React.FC<
  TarjetaAvanceConfirmationCardProps
> = ({ confirmationData, hideBalances, termsAccepted, onTermsChange }) => {
  const displayAmount = (amount: number) =>
    hideBalances ? maskCurrency() : formatCurrency(amount);

  return (
    <Card className="space-y-6 p-6">
      <h2 className="text-lg font-bold text-brand-navy">
        Confirmación de Avance
      </h2>

      <p className="text-[14px] text-brand-navy">
        Por favor, verifica que los datos de la transacción sean correctos antes
        de continuar.
      </p>

      <div className="space-y-3">
        <div className="flex justify-between py-1">
          <span className="text-[14px] text-brand-navy">Cuenta Destino:</span>
          <span className="text-[14px] font-medium text-brand-navy">
            {confirmationData.destinationAccount}
          </span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-[14px] text-brand-navy">Tarjeta Origen:</span>
          <span className="text-[14px] font-medium text-brand-navy">
            {confirmationData.tarjetaDisplay}
          </span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-[14px] text-brand-navy">Número de Cuotas:</span>
          <span className="text-[14px] font-medium text-brand-navy">
            {confirmationData.cuotas}
          </span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-[14px] text-brand-navy">
            Costos Asociados (Comisión):
          </span>
          <span className="text-[14px] font-medium text-brand-navy">
            {displayAmount(confirmationData.comision)}
          </span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-[14px] text-brand-navy">
            Valor por Cuota (Aprox):
          </span>
          <span className="text-[14px] font-medium text-brand-navy">
            {displayAmount(confirmationData.valorPorCuota)}
          </span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-[14px] text-brand-navy">
            Cupo Restante Estimado:
          </span>
          <span className="text-[14px] font-medium text-brand-navy">
            {displayAmount(confirmationData.cupoRestante)}
          </span>
        </div>
      </div>

      <Divider />

      <div className="flex justify-between py-1">
        <span className="text-[14px] text-brand-navy">
          Valor Total a Avanzar:
        </span>
        <span className="text-[14px] font-medium text-brand-navy">
          {displayAmount(confirmationData.valorTotal)}
        </span>
      </div>

      <Divider />

      <label className="flex items-start gap-2 cursor-pointer">
        <Checkbox
          id="tarjeta-avance-terms"
          checked={termsAccepted}
          onChange={onTermsChange}
          aria-label="Aceptar términos y condiciones"
        />
        <span className="text-[11px] text-brand-navy">
          Acepto los términos y condiciones y el pagaré asociado a este avance.
        </span>
      </label>
    </Card>
  );
};
