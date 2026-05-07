"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Card, SelectOption } from "@/src/atoms";
import { SelectField } from "@/src/molecules";
import {
  certificadosProductosSchema,
  CertificadosProductosFormData,
} from "@/src/schemas/certificadosProductosSchema";

interface CertificadosProductosCardProps {
  productoOptions: readonly SelectOption[];
  userName?: string;
  submitting?: boolean;
  onSubmit: (data: CertificadosProductosFormData) => void;
  onBack: () => void;
}

export function CertificadosProductosCard({
  productoOptions,
  userName,
  submitting = false,
  onSubmit,
  onBack,
}: CertificadosProductosCardProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CertificadosProductosFormData>({
    resolver: yupResolver(certificadosProductosSchema),
    defaultValues: { tipoProducto: "" },
  });

  return (
    <form
      onSubmit={handleSubmit((data) => {
        onSubmit(data);
        reset({ tipoProducto: "" });
      })}
      className="space-y-6"
    >
      <Card className="p-6 md:p-8 space-y-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-brand-navy mb-2">
            Solicitar mis Certificados de Productos Financieros
          </h2>
          <p className="text-sm text-brand-gray-high">
            {userName
              ? `Hola ${userName}, selecciona el producto para generar el certificado.`
              : "Selecciona el producto para generar el certificado."}
          </p>
        </div>

        <div className="space-y-4">
          <SelectField
            label="Tipo de Producto"
            placeholder="Selecciona el producto"
            options={productoOptions}
            error={errors.tipoProducto?.message}
            {...register("tipoProducto")}
          />
        </div>
      </Card>

      <div className="flex justify-between">
        <Button type="button" variant="ghost" onClick={onBack}>
          Volver
        </Button>
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? "Procesando..." : "Solicita tu certificado"}
        </Button>
      </div>
    </form>
  );
}
