"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Card, Divider } from "@/src/atoms";
import { FormField } from "@/src/molecules";
import { TarjetaCreditoProduct } from "@/src/types/tarjetaCredito";
import {
  tarjetaClaveCambiarSchema,
  TarjetaClaveCambiarFormData,
} from "@/src/schemas/tarjetaClaveCambiarSchema";

interface TarjetaClaveCambiarDetailsCardProps {
  product: TarjetaCreditoProduct;
  formId: string;
  onSubmit: (data: TarjetaClaveCambiarFormData) => void;
  onValidityChange?: (isValid: boolean) => void;
}

export const TarjetaClaveCambiarDetailsCard: React.FC<
  TarjetaClaveCambiarDetailsCardProps
> = ({ product, formId, onSubmit, onValidityChange }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<TarjetaClaveCambiarFormData>({
    resolver: yupResolver(tarjetaClaveCambiarSchema),
    mode: "onChange",
  });

  React.useEffect(() => {
    onValidityChange?.(isValid);
  }, [isValid, onValidityChange]);

  return (
    <Card className="space-y-6 p-6">
      <div>
        <h2 className="text-lg font-bold text-brand-navy">
          Cambiar Clave de Seguridad
        </h2>
        <p className="text-[14px] text-brand-text-black mt-2">
          Ingresa tu clave actual y define una nueva clave de 4 dígitos.
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
          label="Clave Actual"
          placeholder="****"
          maxLength={4}
          autoComplete="current-password"
          inputMode="numeric"
          type="password"
          error={errors.claveActual?.message}
          {...register("claveActual")}
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
