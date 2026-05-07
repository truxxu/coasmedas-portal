"use client";

import { Card } from "@/src/atoms";
import type { BrebKeyRegistrationConfirmationData } from "@/src/types/brebKeyRegistration";

interface BrebKeyRegistrationConfirmationCardProps {
  data: BrebKeyRegistrationConfirmationData;
}

export function BrebKeyRegistrationConfirmationCard({
  data,
}: BrebKeyRegistrationConfirmationCardProps) {
  return (
    <Card className="space-y-6 p-8">
      <div>
        <h2 className="text-[19px] font-bold text-brand-navy mb-1">
          Confirmar Registro de Llave
        </h2>
        <p className="text-[15px] text-brand-gray-high">
          Verificar los datos de la nueva llave que vas a registrar
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center py-2">
          <span className="text-[14px] text-brand-gray-high">
            Tipo de Llave:
          </span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {data.keyTypeLabel}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[14px] text-brand-gray-high">Valor:</span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {data.keyValue}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[14px] text-brand-gray-high">
            Asociar a Cuenta:
          </span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {data.accountLabel}
          </span>
        </div>
      </div>
    </Card>
  );
}
