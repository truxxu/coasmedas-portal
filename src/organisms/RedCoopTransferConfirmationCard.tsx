"use client";

import { Card, Divider } from "@/src/atoms";
import type { RedCoopTransferConfirmationData } from "@/src/types/redCoopTransfer";
import { formatCurrency, maskCurrency } from "@/src/utils";

interface RedCoopTransferConfirmationCardProps {
  confirmationData: RedCoopTransferConfirmationData;
  hideBalances: boolean;
}

export function RedCoopTransferConfirmationCard({
  confirmationData,
  hideBalances,
}: RedCoopTransferConfirmationCardProps) {
  return (
    <Card className="space-y-6 p-8">
      <div>
        <h2 className="text-lg font-bold text-brand-navy mb-2">
          Confirmación de Pago
        </h2>
        <p className="text-[14px] text-brand-gray-high">
          Por favor, verifica que los datos de la transaccion sean correctos
          antes de continuar.
        </p>
      </div>

      <div className="space-y-3">
        {/* Holder Info Section */}
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-brand-text-black">
            Nombre Titular:
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
            {confirmationData.holderDocument}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-brand-text-black">
            Producto a Debitar:
          </span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {confirmationData.sourceProduct}
          </span>
        </div>

        <Divider />

        {/* Destination Section */}
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-brand-text-black">
            Titular Destino:
          </span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {confirmationData.destinationHolder}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-brand-text-black">
            Banco Destino:
          </span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {confirmationData.destinationBank}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-brand-text-black">
            Tipo de Cuenta:
          </span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {confirmationData.destinationAccountType}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-brand-text-black">
            Cuenta Destino:
          </span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {confirmationData.destinationAccountNumber}
          </span>
        </div>

        <Divider />

        {/* Transfer Details Section */}
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-brand-text-black">
            Valor a Transferir:
          </span>
          <span className="text-[18px] font-medium text-brand-text-black">
            {hideBalances
              ? maskCurrency()
              : formatCurrency(confirmationData.amount)}
          </span>
        </div>
        {confirmationData.concept && (
          <div className="flex justify-between items-center py-2">
            <span className="text-[15px] text-brand-text-black">Concepto:</span>
            <span className="text-[15px] font-medium text-brand-text-black">
              {confirmationData.concept}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
