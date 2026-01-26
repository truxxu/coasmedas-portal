"use client";

import { Card } from "@/src/atoms";
import type { CupoRotativoConfirmationData } from "@/src/types";
import { formatCurrency, maskCurrency } from "@/src/utils";

interface CupoRotativoConfirmationCardProps {
  confirmationData: CupoRotativoConfirmationData;
  hideBalances: boolean;
}

export function CupoRotativoConfirmationCard({
  confirmationData,
  hideBalances,
}: CupoRotativoConfirmationCardProps) {
  return (
    <Card className="space-y-6 p-8">
      <div>
        <h2 className="text-lg font-bold text-brand-navy mb-2">
          Confirmación de Pago
        </h2>
        <p className="text-[15px] text-brand-text-black">
          Por favor, verificar que los datos de la transacción sean correctos
          antes de continuar.
        </p>
      </div>

      <div className="space-y-3">
        {/* Holder Info */}
        <div className="flex justify-between items-center py-1">
          <span className="text-[15px] text-brand-text-black">Titular:</span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {confirmationData.holderName}
          </span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-[15px] text-brand-text-black">Documento:</span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {confirmationData.documentNumber}
          </span>
        </div>

        {/* Account Info */}
        <div className="flex justify-between items-center py-1 mt-4">
          <span className="text-[15px] text-brand-text-black">Cupo Origen:</span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {confirmationData.cupoOrigen}
          </span>
        </div>
        <div className="flex justify-between items-center py-1">
          <span className="text-[15px] text-brand-text-black">
            Cuenta Destino:
          </span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {confirmationData.cuentaDestino}
          </span>
        </div>

        {/* Amount */}
        <div className="flex justify-between items-center py-1">
          <span className="text-[15px] text-brand-text-black">
            Valor a Transferir:
          </span>
          <span className="text-[17px] font-bold text-brand-text-black">
            {hideBalances
              ? maskCurrency()
              : formatCurrency(confirmationData.amount)}
          </span>
        </div>
      </div>
    </Card>
  );
}
