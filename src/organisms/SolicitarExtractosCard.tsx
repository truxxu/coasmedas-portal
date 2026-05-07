"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Card, SelectOption } from "@/src/atoms";
import { FormField, SelectField } from "@/src/molecules";
import {
  solicitarExtractosSchema,
  SolicitarExtractosFormData,
} from "@/src/schemas/solicitarExtractosSchema";

interface SolicitarExtractosCardProps {
  productOptions: readonly SelectOption[];
  userName?: string;
  submitting?: boolean;
  onSubmit: (data: SolicitarExtractosFormData) => void;
  onBack: () => void;
}

export function SolicitarExtractosCard({
  productOptions,
  userName,
  submitting = false,
  onSubmit,
  onBack,
}: SolicitarExtractosCardProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SolicitarExtractosFormData>({
    resolver: yupResolver(solicitarExtractosSchema),
    defaultValues: { productId: "", periodo: "" },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => {
        onSubmit(data);
        reset({ productId: "", periodo: "" });
      })}
      className="space-y-6"
    >
      <Card className="p-6 md:p-8 space-y-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-brand-navy mb-2">
            Solicitud de Extractos de Mis Productos
          </h2>
          <p className="text-sm text-brand-gray-high">
            {userName
              ? `Hola ${userName}, selecciona el producto y el período para tu extracto.`
              : "Selecciona el producto y el período para tu extracto."}
          </p>
        </div>

        <div className="space-y-4">
          <SelectField
            label="Producto"
            placeholder="Selecciona un producto"
            options={productOptions}
            error={errors.productId?.message}
            {...register("productId")}
          />

          <FormField
            label="Período (Mes y Año)"
            type="month"
            error={errors.periodo?.message}
            {...register("periodo")}
          />
        </div>
      </Card>

      <div className="flex justify-between">
        <Button type="button" variant="ghost" onClick={onBack}>
          Volver
        </Button>
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? "Procesando..." : "Solicita tu extracto"}
        </Button>
      </div>
    </form>
  );
}
