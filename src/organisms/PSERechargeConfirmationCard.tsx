"use client";

import { Card, Divider } from "@/src/atoms";
import type { PSERechargeConfirmationData } from "@/src/types/pseRecharge";
import { formatCurrency, maskCurrency } from "@/src/utils";

interface PSERechargeConfirmationCardProps {
  confirmationData: PSERechargeConfirmationData;
  hideBalances: boolean;
}

export function PSERechargeConfirmationCard({
  confirmationData,
  hideBalances,
}: PSERechargeConfirmationCardProps) {
  return (
    <Card className="space-y-6 p-8">
      <div>
        <h2 className="text-lg font-bold text-brand-navy mb-2">
          Confirmación de Pago
        </h2>
        <p className="text-[15px] text-brand-text-black">
          Por favor, verificar que los datos de la transaccion sean correctos
          antes de continuar.
        </p>
      </div>

      <div className="space-y-4">
        {/* Holder Info */}
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-brand-text-black">Titular</span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {confirmationData.holderName}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-brand-text-black">Documento</span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {confirmationData.documentNumber}
          </span>
        </div>

        <Divider />

        {/* Recharge Info */}
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-brand-text-black">
            Producto a Recargar
          </span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {confirmationData.productToRecharge}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-brand-text-black">
            Valor a Recargar
          </span>
          <span className="text-lg font-medium text-brand-text-black">
            {hideBalances
              ? maskCurrency()
              : formatCurrency(confirmationData.amount)}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-brand-text-black">
            Costo Transacción:
          </span>
          <span className="text-[15px] font-medium text-brand-text-black">
            {formatCurrency(confirmationData.transactionCost ?? 0)}
          </span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[15px] text-brand-text-black">Metodo</span>
          <span className="text-[17px] font-medium text-brand-text-black">
            {confirmationData.method}
          </span>
        </div>
      </div>
    </Card>
  );
}
