"use client";

import React from "react";
import { Card, CurrencyInput } from "@/src/atoms";
import { FormField, SelectField } from "@/src/molecules";
import { TarjetaCreditoProduct } from "@/src/types/tarjetaCredito";
import { TarjetaSourceAccount } from "@/src/types/tarjeta-payment";

interface TarjetaAvanceDetailsCardProps {
  product: TarjetaCreditoProduct;
  destinationAccounts: TarjetaSourceAccount[];
  destinationAccountId: string;
  cuotas: number;
  valor: number;
  vencimiento: string;
  cvv: string;
  documentDisplay: string;
  destinationError?: string;
  vencimientoError?: string;
  cvvError?: string;
  cuotasError?: string;
  valorError?: string;
  onDestinationAccountChange: (accountId: string) => void;
  onCuotasChange: (cuotas: number) => void;
  onValorChange: (valor: number) => void;
  onVencimientoChange: (vencimiento: string) => void;
  onCvvChange: (cvv: string) => void;
}

const CUOTAS_OPTIONS = Array.from({ length: 36 }, (_, i) => ({
  value: String(i + 1),
  label: String(i + 1),
}));

function formatVencimiento(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export const TarjetaAvanceDetailsCard: React.FC<
  TarjetaAvanceDetailsCardProps
> = ({
  product,
  destinationAccounts,
  destinationAccountId,
  cuotas,
  valor,
  vencimiento,
  cvv,
  documentDisplay,
  destinationError,
  vencimientoError,
  cvvError,
  cuotasError,
  valorError,
  onDestinationAccountChange,
  onCuotasChange,
  onValorChange,
  onVencimientoChange,
  onCvvChange,
}) => {
  const destinationOptions = destinationAccounts.map((account) => ({
    value: account.id,
    label: `${account.displayName} (${account.maskedNumber})`,
  }));

  return (
    <Card className="space-y-6 p-6">
      <div>
        <h2 className="text-lg font-bold text-brand-navy">
          Avance de Tarjeta de Crédito
        </h2>
        <p className="text-[14px] text-brand-navy mt-2">
          Por favor, verifica que los datos de la transacción sean correctos
          antes de continuar.
        </p>
      </div>

      <div className="bg-brand-gray-light rounded-lg p-4 space-y-3">
        <div className="flex justify-between">
          <span className="text-[14px] text-brand-navy">Tarjeta Origen:</span>
          <span className="text-[14px] font-medium text-brand-navy">
            {product.title} (****{product.last4})
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-[14px] text-brand-navy">Documento:</span>
          <span className="text-[14px] font-medium text-brand-navy">
            {documentDisplay}
          </span>
        </div>
        <SelectField
          label="Abonar a la cuenta:"
          name="destinationAccount"
          options={destinationOptions}
          value={destinationAccountId}
          onChange={(e) => onDestinationAccountChange(e.target.value)}
          placeholder="Selecciona una cuenta"
          error={destinationError}
          required
        />
      </div>

      <div className="space-y-4">
        <h3 className="text-[17px] font-bold text-brand-navy">
          Ingresa los datos para el avance
        </h3>

        <FormField
          label="Fecha de vencimiento (MM/AA)"
          name="vencimiento"
          type="text"
          inputMode="numeric"
          placeholder="12/28"
          maxLength={5}
          value={vencimiento}
          onChange={(e) =>
            onVencimientoChange(formatVencimiento(e.target.value))
          }
          error={vencimientoError}
          required
        />

        <FormField
          label="CVV"
          name="cvv"
          type="password"
          inputMode="numeric"
          placeholder="***"
          maxLength={4}
          value={cvv}
          onChange={(e) =>
            onCvvChange(e.target.value.replace(/\D/g, "").slice(0, 4))
          }
          error={cvvError}
          required
        />

        <SelectField
          label="Número de Cuotas"
          name="cuotas"
          options={CUOTAS_OPTIONS}
          value={cuotas ? String(cuotas) : ""}
          onChange={(e) => onCuotasChange(parseInt(e.target.value, 10) || 0)}
          placeholder="Selecciona"
          error={cuotasError}
          required
        />

        <div>
          <label className="block text-[14px] text-brand-navy mb-1">
            Valor del Avance
          </label>
          <CurrencyInput
            value={valor}
            onChange={onValorChange}
            prefix="$"
            hasError={Boolean(valorError)}
            className="w-full"
          />
          {valorError && (
            <p className="text-sm text-brand-error mt-1">{valorError}</p>
          )}
        </div>
      </div>
    </Card>
  );
};
