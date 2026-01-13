"use client";

import { Card } from "@/src/atoms";
import { ConfirmationRow } from "@/src/molecules";
import type { UtilityConfirmationData } from "@/src/types";

interface UtilityConfirmationCardProps {
  confirmationData: UtilityConfirmationData;
}

export function UtilityConfirmationCard({
  confirmationData,
}: UtilityConfirmationCardProps) {
  return (
    <Card className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-brand-navy mb-2">
          Confirmar Inscripción
        </h2>
        <p className="text-[15px] text-black">
          Verifica los datos del servicio que vas a inscribir.
        </p>
      </div>

      {/* Confirmation Details */}
      <div className="space-y-1 border-t border-b border-gray-200 py-4">
        <ConfirmationRow label="Ciudad:" value={confirmationData.city} />
        <ConfirmationRow label="Convenio:" value={confirmationData.convenio} />
        <ConfirmationRow
          label="Número de Factura:"
          value={confirmationData.billNumber}
        />
        <ConfirmationRow label="Alias:" value={confirmationData.alias} />
      </div>
    </Card>
  );
}
