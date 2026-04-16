"use client";

import React from "react";
import { Card, Divider, ErrorIcon, SuccessIcon } from "@/src/atoms";
import { TarjetaAvanceResult } from "@/src/types/tarjeta-avance";
import { formatCurrency, maskCurrency } from "@/src/utils";

interface TarjetaAvanceResultCardProps {
  result: TarjetaAvanceResult;
  hideBalances: boolean;
}

export const TarjetaAvanceResultCard: React.FC<
  TarjetaAvanceResultCardProps
> = ({ result, hideBalances }) => {
  const isSuccess = result.status === "success";

  const displayAmount = (amount: number) =>
    hideBalances ? maskCurrency() : formatCurrency(amount);

  return (
    <Card className="space-y-6 p-6">
      <div className="flex flex-col items-center gap-4">
        {isSuccess ? <SuccessIcon size="md" /> : <ErrorIcon size="md" />}
        <h2 className="text-[22px] font-bold text-brand-navy text-center">
          {isSuccess ? "¡Avance exitoso!" : "No pudimos procesar tu avance"}
        </h2>
        <p className="text-[14px] text-brand-navy text-center">
          {isSuccess
            ? `El valor de ${formatCurrency(result.valorAbonado)} fue abonado a tu cuenta ${result.destinationAccount}.`
            : (result.descripcion ??
              "Ocurrió un error al procesar el avance. Intenta nuevamente.")}
        </p>
      </div>

      <Divider />

      <div className="space-y-3">
        <div className="flex justify-between py-1">
          <span className="text-[14px] text-brand-navy">
            Cupo disponible actualizado:
          </span>
          <span className="text-[14px] font-medium text-brand-navy">
            {displayAmount(result.cupoDisponibleActualizado)}
          </span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-[14px] text-brand-navy">Valor abonado:</span>
          <span className="text-lg font-bold text-brand-navy">
            {displayAmount(result.valorAbonado)}
          </span>
        </div>
      </div>

      <Divider />

      <div className="space-y-3">
        <div className="flex justify-between py-1">
          <span className="text-[14px] text-brand-navy">
            Fecha de la transacción:
          </span>
          <span className="text-[14px] font-medium text-brand-navy">
            {result.fechaTransaccion}
          </span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-[14px] text-brand-navy">
            Hora de la transacción:
          </span>
          <span className="text-[14px] font-medium text-brand-navy">
            {result.horaTransaccion}
          </span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-[14px] text-brand-navy">
            Número de aprobación:
          </span>
          <span className="text-[14px] font-medium text-brand-navy">
            {result.numeroAprobacion}
          </span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-[14px] text-brand-navy">Dirección IP:</span>
          <span className="text-[14px] font-medium text-brand-navy">
            {result.direccionIp}
          </span>
        </div>
      </div>
    </Card>
  );
};
