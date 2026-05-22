"use client";

import React, { useMemo } from "react";
import { Card, CurrencyInput } from "@/src/atoms";
import { FormField, SelectField } from "@/src/molecules";
import { TarjetaCreditoProduct } from "@/src/types/tarjetaCredito";
import { TarjetaSourceAccount } from "@/src/types/tarjeta-payment";
import {
  TarjetaAvanceFormData,
  TarjetaAvanceFormErrors,
} from "@/src/types/tarjeta-avance";

interface TarjetaAvanceDetailsCardProps {
  product: TarjetaCreditoProduct;
  destinationAccounts: TarjetaSourceAccount[];
  documentDisplay: string;
  values: TarjetaAvanceFormData;
  errors: TarjetaAvanceFormErrors;
  onChange: (patch: Partial<TarjetaAvanceFormData>) => void;
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
  documentDisplay,
  values,
  errors,
  onChange,
}) => {
  const destinationOptions = useMemo(
    () =>
      destinationAccounts.map((account) => ({
        value: account.id,
        label: `${account.displayName} (${account.maskedNumber})`,
      })),
    [destinationAccounts],
  );

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
          value={values.destinationAccountId}
          onChange={(e) => onChange({ destinationAccountId: e.target.value })}
          placeholder="Selecciona una cuenta"
          error={errors.destinationAccountId}
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
          value={values.vencimiento}
          onChange={(e) =>
            onChange({ vencimiento: formatVencimiento(e.target.value) })
          }
          error={errors.vencimiento}
          required
        />

        <FormField
          label="CVV"
          name="cvv"
          type="password"
          inputMode="numeric"
          placeholder="***"
          maxLength={4}
          value={values.cvv}
          onChange={(e) =>
            onChange({ cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })
          }
          error={errors.cvv}
          required
        />

        <SelectField
          label="Número de Cuotas"
          name="cuotas"
          options={CUOTAS_OPTIONS}
          value={values.cuotas ? String(values.cuotas) : ""}
          onChange={(e) =>
            onChange({ cuotas: parseInt(e.target.value, 10) || 0 })
          }
          placeholder="Selecciona"
          error={errors.cuotas}
          required
        />

        <div>
          <label className="block text-[14px] text-brand-navy mb-1">
            Valor del Avance
          </label>
          <CurrencyInput
            value={values.valor}
            onChange={(v) => onChange({ valor: v })}
            prefix="$"
            hasError={Boolean(errors.valor)}
            className="w-full"
          />
          {errors.valor && (
            <p className="text-sm text-brand-error mt-1">{errors.valor}</p>
          )}
        </div>
      </div>
    </Card>
  );
};
