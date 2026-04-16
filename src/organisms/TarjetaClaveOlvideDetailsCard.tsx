"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Card, Divider } from "@/src/atoms";
import { FormField } from "@/src/molecules";
import { TarjetaCreditoProduct } from "@/src/types/tarjetaCredito";
import {
  tarjetaClaveOlvideSchema,
  TarjetaClaveOlvideFormData,
} from "@/src/schemas/tarjetaClaveOlvideSchema";

interface TarjetaClaveOlvideDetailsCardProps {
  product: TarjetaCreditoProduct;
  formId: string;
  onSubmit: (data: TarjetaClaveOlvideFormData) => void;
  onValidityChange?: (isValid: boolean) => void;
}

export const TarjetaClaveOlvideDetailsCard: React.FC<
  TarjetaClaveOlvideDetailsCardProps
> = ({ product, formId, onSubmit, onValidityChange }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<TarjetaClaveOlvideFormData>({
    resolver: yupResolver(tarjetaClaveOlvideSchema),
    mode: "onChange",
  });

  React.useEffect(() => {
    onValidityChange?.(isValid);
  }, [isValid, onValidityChange]);

  return (
    <Card className="space-y-6 p-6">
      <div>
        <h2 className="text-lg font-bold text-brand-navy">
          Recuperar Clave por Olvido
        </h2>
        <p className="text-[14px] text-brand-text-black mt-2">
          Valida tu identidad y establece una nueva clave.
        </p>
      </div>

      <div className="rounded-lg border border-brand-border p-4">
        <p className="text-[15px] font-bold text-brand-navy">{product.title}</p>
        <p className="text-[13px] text-brand-gray-secondary mt-1">
          {product.maskedNumber}
        </p>
      </div>

      <form
        id={formId}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
        noValidate
      >
        <FormField
          label="Fecha de vencimiento (MM/AA)"
          placeholder="MM/AA"
          maxLength={5}
          autoComplete="cc-exp"
          inputMode="numeric"
          error={errors.fechaVencimiento?.message}
          {...register("fechaVencimiento")}
        />
        <FormField
          label="CVV"
          placeholder="***"
          maxLength={3}
          autoComplete="cc-csc"
          inputMode="numeric"
          type="password"
          error={errors.cvv?.message}
          {...register("cvv")}
        />

        <Divider />

        <FormField
          label="Clave Transaccional (la de tu portal)"
          autoComplete="current-password"
          type="password"
          error={errors.claveTransaccional?.message}
          {...register("claveTransaccional")}
        />
        <FormField
          label="Nueva Clave (4 dígitos)"
          placeholder="****"
          maxLength={4}
          autoComplete="new-password"
          inputMode="numeric"
          type="password"
          error={errors.nuevaClave?.message}
          {...register("nuevaClave")}
        />
        <FormField
          label="Confirma Nueva Clave"
          placeholder="****"
          maxLength={4}
          autoComplete="new-password"
          inputMode="numeric"
          type="password"
          error={errors.confirmarClave?.message}
          {...register("confirmarClave")}
        />
      </form>
    </Card>
  );
};
