"use client";

import React from "react";
import { Card } from "@/src/atoms";
import { TarjetaBloqueoConfirmationData } from "@/src/types/tarjeta-bloqueo";

interface TarjetaBloqueoConfirmationCardProps {
  confirmationData: TarjetaBloqueoConfirmationData;
}

export const TarjetaBloqueoConfirmationCard: React.FC<
  TarjetaBloqueoConfirmationCardProps
> = ({ confirmationData }) => {
  return (
    <Card className="space-y-6 p-6">
      <div>
        <h2 className="text-lg font-bold text-brand-navy">Confirmar Bloqueo</h2>
        <p className="text-[14px] text-brand-text-black mt-2">
          Estás a punto de bloquear tu tarjeta. Esta acción es irreversible.
        </p>
      </div>

      <div className="flex justify-between py-1 gap-4">
        <span className="text-[14px] text-brand-text-black">
          Tarjeta a Bloquear:
        </span>
        <span className="text-[14px] font-medium text-brand-text-black text-right">
          {confirmationData.cardDisplay}
        </span>
      </div>

      <div
        role="alert"
        className="rounded-lg border border-brand-pink-red px-4 py-3"
      >
        <p className="text-[14px] font-bold text-brand-pink-red">
          ¡Atención! Una vez bloqueada, no podrás volver a usar esta tarjeta.
          Deberás solicitar una nueva.
        </p>
      </div>
    </Card>
  );
};
