"use client";

import React from "react";
import { Card, Divider, ErrorIcon, SuccessIcon } from "@/src/atoms";
import { TarjetaPaymentResult } from "@/src/types/tarjeta-payment";
import { formatCurrency, maskCurrency } from "@/src/utils";

interface TarjetaPaymentResultCardProps {
  result: TarjetaPaymentResult;
  hideBalances: boolean;
}

export const TarjetaPaymentResultCard: React.FC<
  TarjetaPaymentResultCardProps
> = ({ result, hideBalances }) => {
  const isSuccess = result.status === "success";

  const displayAmount = (amount: number) =>
    hideBalances ? maskCurrency() : formatCurrency(amount);

  return (
    <Card className="space-y-6 p-6">
      <div className="flex flex-col items-center gap-4">
        {isSuccess ? <SuccessIcon size="md" /> : <ErrorIcon size="md" />}
        <h2 className="text-[22px] font-bold text-brand-navy text-center">
          {isSuccess ? "¡Pago exitoso!" : "No pudimos procesar tu pago"}
        </h2>
        <p className="text-[14px] text-brand-navy-alt text-center">
          {isSuccess
            ? `Tu pago de ${formatCurrency(result.valorPagado)} fue aplicado a tu tarjeta de Crédito.`
            : (result.descripcion ??
              "Ocurrió un error al procesar el pago. Intenta nuevamente.")}
        </p>
      </div>

      <Divider />

      <div className="space-y-3">
        <div className="flex justify-between py-1">
          <span className="text-[14px] text-brand-navy-alt">
            Número de la tarjeta:
          </span>
          <span className="text-[14px] font-medium text-brand-navy-alt">
            {result.tarjetaDisplay}
          </span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-[14px] text-brand-navy-alt">Valor pagado:</span>
          <span className="text-lg font-bold text-brand-navy-alt">
            {displayAmount(result.valorPagado)}
          </span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-[14px] text-brand-navy-alt">
            Nuevo Saldo Estimado:
          </span>
          <span className="text-[14px] font-medium text-brand-navy-alt">
            {displayAmount(result.newEstimatedBalance)}
          </span>
        </div>
      </div>

      <Divider />

      <div className="space-y-3">
        <div className="flex justify-between py-1">
          <span className="text-[14px] text-brand-navy-alt">
            Fecha de la transacción:
          </span>
          <span className="text-[14px] font-medium text-brand-navy-alt">
            {result.fechaTransaccion}
          </span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-[14px] text-brand-navy-alt">
            Hora de la transacción:
          </span>
          <span className="text-[14px] font-medium text-brand-navy-alt">
            {result.horaTransaccion}
          </span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-[14px] text-brand-navy-alt">
            Número de aprobación:
          </span>
          <span className="text-[14px] font-medium text-brand-navy-alt">
            {result.numeroAprobacion}
          </span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-[14px] text-brand-navy-alt">Dirección IP:</span>
          <span className="text-[14px] font-medium text-brand-navy-alt">
            {result.direccionIp}
          </span>
        </div>
      </div>
    </Card>
  );
};
