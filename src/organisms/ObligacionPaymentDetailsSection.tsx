"use client";

import React from "react";
import { Card, Divider, CurrencyInput, InfoBox } from "@/src/atoms";
import { PaymentTypeButton, ExcessPaymentRadioGroup } from "@/src/molecules";
import {
  ObligacionPaymentProduct,
  PaymentType,
  ExcessPaymentOption,
} from "@/src/types/obligacion-payment";
import { formatCurrency, maskCurrency } from "@/src/utils";

interface ObligacionPaymentDetailsSectionProps {
  selectedProduct: ObligacionPaymentProduct;
  valorAPagar: number;
  activePaymentType: PaymentType | null;
  excessPaymentOption: ExcessPaymentOption | null;
  onValorChange: (valor: number) => void;
  onPaymentTypeSelect: (type: PaymentType) => void;
  onExcessOptionChange: (option: ExcessPaymentOption) => void;
  hideBalances: boolean;
}

export const ObligacionPaymentDetailsSection: React.FC<
  ObligacionPaymentDetailsSectionProps
> = ({
  selectedProduct,
  valorAPagar,
  activePaymentType,
  excessPaymentOption,
  onValorChange,
  onPaymentTypeSelect,
  onExcessOptionChange,
  hideBalances,
}) => {
  const showExcessOptions = valorAPagar > selectedProduct.minimumPayment;

  return (
    <Card className="space-y-4 p-6">
      {/* Header */}
      <h3 className="text-sm font-medium text-brand-navy">Detalle del Pago</h3>

      <Divider />

      {/* Detail Rows */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-[15px] text-black">Línea de Crédito:</span>
          <span className="text-[15px] font-medium text-black">
            {selectedProduct.name}
          </span>
        </div>

        {selectedProduct.fechaApertura && (
          <div className="flex justify-between items-center">
            <span className="text-[15px] text-black">Fecha de Apertura:</span>
            <span className="text-[15px] font-medium text-black">
              {selectedProduct.fechaApertura}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <span className="text-[15px] text-black">
            Pago Mínimo del Periodo:
          </span>
          <span className="text-[15px] font-medium text-black">
            {hideBalances
              ? maskCurrency()
              : formatCurrency(selectedProduct.minimumPayment)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[15px] text-black">Pago Total:</span>
          <span className="text-[15px] font-medium text-black">
            {hideBalances
              ? maskCurrency()
              : formatCurrency(selectedProduct.totalBalance)}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[15px] text-black">Fecha Límite de Pago:</span>
          <span className="text-[15px] font-medium text-black">
            {selectedProduct.paymentDeadline}
          </span>
        </div>
      </div>

      <Divider />

      {/* Transaction Cost */}
      <div className="flex justify-between items-center">
        <span className="text-[15px] text-black">Costo de la Transacción:</span>
        <span className="text-[15px] font-medium text-black">$ 0</span>
      </div>

      {/* Payment Type Buttons */}
      <div className="flex gap-3 justify-end">
        <PaymentTypeButton
          label="Pago Mínimo"
          onClick={() => onPaymentTypeSelect("minimum")}
          active={activePaymentType === "minimum"}
        />
        <PaymentTypeButton
          label="Pago Total"
          onClick={() => onPaymentTypeSelect("total")}
          active={activePaymentType === "total"}
        />
      </div>

      {/* Value Input */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <span className="text-[17px] font-bold text-brand-navy">
          Valor a Pagar
        </span>
        <CurrencyInput
          value={valorAPagar}
          onChange={onValorChange}
          prefix="$"
        />
      </div>

      {/* Excess Payment Options */}
      {showExcessOptions && (
        <div className="space-y-4">
          <InfoBox variant="warning">
            Has ingresado un valor superior al pago mínimo. Selecciona cómo
            deseas aplicar el excedente
          </InfoBox>
          <ExcessPaymentRadioGroup
            value={excessPaymentOption}
            onChange={onExcessOptionChange}
          />
        </div>
      )}

      <Divider />

      {/* Total Display */}
      <div className="flex justify-between items-center">
        <span className="text-[17px] font-bold text-brand-navy">
          Total a Pagar:
        </span>
        <span className="text-lg font-medium text-black">
          {hideBalances ? maskCurrency() : formatCurrency(valorAPagar)}
        </span>
      </div>
    </Card>
  );
};
