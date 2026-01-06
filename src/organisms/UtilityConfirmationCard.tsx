"use client";

import { Card, Button } from "@/src/atoms";
import { ConfirmationRow } from "@/src/molecules";
import type { UtilityConfirmationData } from "@/src/types";

interface UtilityConfirmationCardProps {
  confirmationData: UtilityConfirmationData;
  onConfirm: () => void;
  onBack: () => void;
  isLoading: boolean;
}

export function UtilityConfirmationCard({
  confirmationData,
  onConfirm,
  onBack,
  isLoading,
}: UtilityConfirmationCardProps) {
  return (
    <Card className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-lg font-bold text-brand-navy mb-2">
          Confirmar Inscripcion
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
          label="Numero de Factura:"
          value={confirmationData.billNumber}
        />
        <ConfirmationRow label="Alias:" value={confirmationData.alias} />
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-6">
        <button
          type="button"
          onClick={onBack}
          disabled={isLoading}
          className="text-sm font-medium text-[#004266] hover:underline disabled:opacity-50"
        >
          Volver
        </button>
        <Button
          type="button"
          variant="primary"
          onClick={onConfirm}
          disabled={isLoading}
        >
          {isLoading ? "Confirmando..." : "Confirmar Inscripcion"}
        </Button>
      </div>
    </Card>
  );
}
