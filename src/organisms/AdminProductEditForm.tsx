"use client";

import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Card, Label, Input, ErrorMessage } from "@/src/atoms";
import { ChannelLimitsAccordion, ProductLimitsRow } from "@/src/molecules";
import {
  adminProductoSchema,
  type AdminProductoFormValues,
} from "@/src/schemas/adminProductoSchema";
import {
  ADMIN_CHANNELS,
  type AdminProduct,
  type ProductLimits,
} from "@/src/types";

interface AdminProductEditFormProps {
  product: AdminProduct;
  onSubmit: (data: AdminProductoFormValues) => void;
  onCancel: () => void;
}

const EMPTY_LIMITS: ProductLimits = {
  transactions: { daily: 0, weekly: 0, monthly: 0 },
  amounts: { daily: 0, weekly: 0, monthly: 0 },
};

function buildDefaults(product: AdminProduct): AdminProductoFormValues {
  const channelLimits = ADMIN_CHANNELS.reduce(
    (acc, channel) => {
      acc[channel] = product.channelLimits[channel] ?? EMPTY_LIMITS;
      return acc;
    },
    {} as AdminProductoFormValues["channelLimits"],
  );

  return {
    alias: product.alias,
    globalLimits: product.globalLimits,
    channelLimits,
  };
}

function buildResetDefaults(product: AdminProduct): AdminProductoFormValues {
  const channelLimits = ADMIN_CHANNELS.reduce(
    (acc, channel) => {
      acc[channel] = product.defaultChannelLimits[channel] ?? EMPTY_LIMITS;
      return acc;
    },
    {} as AdminProductoFormValues["channelLimits"],
  );

  return {
    alias: product.alias,
    globalLimits: product.defaultGlobalLimits,
    channelLimits,
  };
}

export function AdminProductEditForm({
  product,
  onSubmit,
  onCancel,
}: AdminProductEditFormProps) {
  const defaultValues = useMemo(() => buildDefaults(product), [product]);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdminProductoFormValues>({
    resolver: yupResolver(adminProductoSchema),
    defaultValues,
    mode: "onBlur",
  });

  const handleReset = () => {
    reset(buildResetDefaults(product));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="p-6 md:p-8 space-y-8">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[18px] font-bold text-brand-primary">
              Editando Límites de {product.displayName.split(" (")[0]}
            </h2>
            <p className="text-[14px] text-brand-gray-medium mt-1">
              Número: {product.number}
            </p>
          </div>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={handleReset}
          >
            Restablecer límites
          </Button>
        </div>

        {/* Personalización */}
        <section className="space-y-3">
          <h3 className="text-[15px] font-medium text-brand-primary">
            Personalización
          </h3>
          <div className="max-w-md">
            <Label htmlFor="alias">Nombre Personalizado (Alias)</Label>
            <Input
              id="alias"
              {...register("alias")}
              error={errors.alias?.message}
            />
            <ErrorMessage message={errors.alias?.message} />
            <p className="text-xs text-brand-text-secondary mt-1">
              Asigna un nombre fácil de recordar para identificar este producto
              en tu portal.
            </p>
          </div>
        </section>

        {/* Límites Globales */}
        <section className="space-y-3">
          <h3 className="text-[15px] font-medium text-brand-primary">
            Límites Globales del Producto
          </h3>
          <ProductLimitsRow
            pathPrefix="globalLimits"
            register={register}
            control={control}
            errors={errors}
          />
        </section>

        {/* Límites por Canal */}
        <section className="space-y-3">
          <h3 className="text-[15px] font-medium text-brand-primary">
            Límites por Canal Transaccional
          </h3>
          <p className="text-[13px] text-brand-gray-medium">
            Los límites por canal no pueden superar los límites globales que
            definiste arriba.
          </p>
          <div className="space-y-2">
            {ADMIN_CHANNELS.map((channel) => (
              <ChannelLimitsAccordion
                key={channel}
                channel={channel}
                defaultOpen={false}
                register={register}
                control={control}
                errors={errors}
              />
            ))}
          </div>
        </section>
      </Card>

      {/* Footer actions */}
      <div className="flex justify-between items-center mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-2 text-sm font-medium text-brand-navy hover:opacity-80"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M19 12H5M5 12L12 19M5 12L12 5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Volver
        </button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          Guardar Cambios
        </Button>
      </div>
    </form>
  );
}
