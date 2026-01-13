"use client";

import { Card, Divider } from "@/src/atoms";
import type { TransferConfirmationData } from "@/src/types/transfer";
import { formatCurrency, maskCurrency } from "@/src/utils";

interface TransferConfirmationCardProps {
  confirmationData: TransferConfirmationData;
  hideBalances: boolean;
}

export function TransferConfirmationCard({
  confirmationData,
  hideBalances,
}: TransferConfirmationCardProps) {
  return (
    <Card className="space-y-6 p-8">
      <div>
        <h2 className="text-lg font-bold text-brand-teal-dark mb-2">
          Confirmacion de Pago
        </h2>
        <p className="text-[15px] text-brand-text-black">
          Por favor, verifica que los datos de la transacción sean correctos
          antes de continuar.
        </p>
      </div>

      <div className="space-y-4">
        {/* Holder Info */}
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-brand-text-black">
            Nombre del Titular:
          </span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {confirmationData.holderName}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-brand-text-black">
            Documento Titular:
          </span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {confirmationData.documentNumber}
          </span>
        </div>

        <Divider />

        {/* Account Info */}
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-brand-text-black">
            Cuenta Origen:
          </span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {confirmationData.sourceAccount}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-brand-text-black">
            Cuenta Destino:
          </span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {confirmationData.destinationProduct}
          </span>
        </div>

        <Divider />

        {/* Amount */}
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-brand-text-black">
            Valor a Transferir:
          </span>
          <span className="text-lg font-medium text-brand-text-black">
            {hideBalances
              ? maskCurrency()
              : formatCurrency(confirmationData.amount)}
          </span>
        </div>
      </div>
    </Card>
  );
}
