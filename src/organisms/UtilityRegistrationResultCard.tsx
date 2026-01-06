"use client";

import { Card, SuccessIcon, ErrorIcon, Button } from "@/src/atoms";
import { ConfirmationRow } from "@/src/molecules";
import type { UtilityRegistrationResult } from "@/src/types";

interface UtilityRegistrationResultCardProps {
  result: UtilityRegistrationResult;
  onRegisterAnother: () => void;
  onGoToPayments: () => void;
}

export function UtilityRegistrationResultCard({
  result,
  onRegisterAnother,
  onGoToPayments,
}: UtilityRegistrationResultCardProps) {
  const isSuccess = result.success;

  return (
    <Card className="p-6 md:p-8">
      {/* Result Icon and Title */}
      <div className="flex flex-col items-center mb-6">
        {isSuccess ? (
          <SuccessIcon size="md" className="mb-4" />
        ) : (
          <ErrorIcon size="md" className="mb-4" />
        )}
        <h2 className="text-[23px] font-bold text-brand-navy text-center">
          {isSuccess ? "Inscripcion Aceptada" : "Inscripcion Rechazada"}
        </h2>
      </div>

      {/* Error Message Box (only for errors) */}
      {!isSuccess && result.errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-700">{result.errorMessage}</p>
        </div>
      )}

      {/* Registration Details */}
      <div className="space-y-1 border-t border-b border-gray-200 py-4">
        <ConfirmationRow
          label="Estado de Inscripcion:"
          value={result.status}
          valueColor={isSuccess ? "success" : "error"}
        />
        <ConfirmationRow label="Alias:" value={result.alias} />
        <ConfirmationRow label="Convenio:" value={result.convenio} />
        <ConfirmationRow label="Ciudad:" value={result.city} />
        <ConfirmationRow label="Numero de Factura:" value={result.billNumber} />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-6">
        <Button variant="secondary" onClick={onRegisterAnother}>
          Inscribir otro servicio
        </Button>
        <Button variant="primary" onClick={onGoToPayments}>
          Ir a Pagos
        </Button>
      </div>
    </Card>
  );
}
