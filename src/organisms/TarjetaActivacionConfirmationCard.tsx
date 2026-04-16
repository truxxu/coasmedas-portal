"use client";

import React from "react";
import { Card } from "@/src/atoms";
import { TarjetaActivacionConfirmationData } from "@/src/types/tarjeta-activacion";

interface TarjetaActivacionConfirmationCardProps {
  confirmationData: TarjetaActivacionConfirmationData;
}

export const TarjetaActivacionConfirmationCard: React.FC<
  TarjetaActivacionConfirmationCardProps
> = ({ confirmationData }) => {
  return (
    <Card className="space-y-4 p-6">
      <div>
        <h2 className="text-lg font-bold text-brand-navy">
          Confirmar Activación
        </h2>
        <p className="text-[14px] text-brand-text-black mt-2">
          Estás a punto de activar tu tarjeta. Por favor, confirma la operación.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between py-1 gap-4">
          <span className="text-[14px] text-brand-text-black">
            Tarjeta a Activar:
          </span>
          <span className="text-[14px] font-medium text-brand-text-black text-right">
            {confirmationData.cardDisplay}
          </span>
        </div>
        <div className="flex justify-between py-1 gap-4">
          <span className="text-[14px] text-brand-text-black">
            Fecha de Emisión:
          </span>
          <span className="text-[14px] font-medium text-brand-text-black text-right">
            {confirmationData.fechaEmision}
          </span>
        </div>
      </div>
    </Card>
  );
};
