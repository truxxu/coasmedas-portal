"use client";

import { Card, Divider } from "@/src/atoms";
import type { BrebQrPaymentConfirmationData } from "@/src/types/brebQrPayment";
import { formatCurrency, maskCurrency } from "@/src/utils";

interface BrebQrPaymentConfirmationCardProps {
  confirmationData: BrebQrPaymentConfirmationData;
  hideBalances: boolean;
}

export function BrebQrPaymentConfirmationCard({
  confirmationData,
  hideBalances,
}: BrebQrPaymentConfirmationCardProps) {
  return (
    <Card className="space-y-6 p-8">
      <div>
        <h2 className="text-lg font-bold text-brand-navy mb-2">
          Confirmar de Pago
        </h2>
        <p className="text-[14px] text-brand-text-black">
          Por favor, verifica que los datos de la transacción sean correctos
          antes de continuar.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center py-2">
          <span className="text-[14px] text-brand-text-black">
            Cuenta Origen:
          </span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {confirmationData.sourceProduct}
          </span>
        </div>

        <Divider />

        <div className="flex justify-between items-center py-2">
          <span className="text-[14px] text-brand-text-black">
            Destinatario:
          </span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {confirmationData.destinationName}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[14px] text-brand-text-black">
            Llave Destino:
          </span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {confirmationData.destinationKey}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[14px] text-brand-text-black">
            Valor a Enviar:
          </span>
          <span className="text-[18px] font-medium text-brand-text-black">
            {hideBalances
              ? maskCurrency()
              : formatCurrency(confirmationData.amount)}
          </span>
        </div>
      </div>
    </Card>
  );
}
