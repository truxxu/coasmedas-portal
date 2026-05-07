"use client";

import { Card } from "@/src/atoms";
import type { BrebKeyModificationConfirmationData } from "@/src/types/brebKeyModification";

interface BrebKeyModificationConfirmationCardProps {
  data: BrebKeyModificationConfirmationData;
}

export function BrebKeyModificationConfirmationCard({
  data,
}: BrebKeyModificationConfirmationCardProps) {
  return (
    <Card className="space-y-6 p-8">
      <div>
        <h2 className="text-[19px] font-bold text-brand-navy mb-1">
          Confirmar Modificación de Llave
        </h2>
        <p className="text-[15px] text-brand-gray-high">
          Verificar los cambios que vas a aplicar a tu llave.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center py-2">
          <span className="text-[14px] text-brand-gray-high">
            Llave a Modificar:
          </span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {data.currentKeyTypeLabel}: {data.currentKeyValue}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[14px] text-brand-gray-high">
            Nueva Llave Escogida:
          </span>
          <span className="text-[16px] text-brand-text-black">
            {data.newKeyValue}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[14px] text-brand-gray-high">
            Cuenta Asociada:
          </span>
          <span className="text-[16px] text-brand-text-black">
            {data.accountLabel}
          </span>
        </div>
      </div>
    </Card>
  );
}
