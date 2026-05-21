"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Card, SelectOption } from "@/src/atoms";
import { SelectField } from "@/src/molecules";
import {
  certificadosTributariosSchema,
  CertificadosTributariosFormData,
} from "@/src/schemas/certificadosTributariosSchema";

interface CertificadosTributariosCardProps {
  tipoOptions: readonly SelectOption[];
  anioOptions: readonly SelectOption[];
  userName?: string;
  submitting?: boolean;
  onSubmit: (data: CertificadosTributariosFormData) => void;
  onBack: () => void;
}

export function CertificadosTributariosCard({
  tipoOptions,
  anioOptions,
  userName,
  submitting = false,
  onSubmit,
  onBack,
}: CertificadosTributariosCardProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CertificadosTributariosFormData>({
    resolver: yupResolver(certificadosTributariosSchema),
    defaultValues: { tipoCertificado: "", anio: "" },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="p-6 md:p-8 space-y-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-brand-navy mb-2">
            Solicitar mis Certificados Tributarios
          </h2>
          <p className="text-sm text-brand-gray-high">
            {userName
              ? `Hola ${userName}, selecciona el tipo de certificado y el año.`
              : "Selecciona el tipo de certificado y el año."}
          </p>
        </div>

        <div className="space-y-4">
          <SelectField
            label="Tipo de Certificado"
            placeholder="Selecciona el tipo de certificado"
            options={tipoOptions}
            error={errors.tipoCertificado?.message}
            {...register("tipoCertificado")}
          />

          <SelectField
            label="Año"
            placeholder="Selecciona el año"
            options={anioOptions}
            error={errors.anio?.message}
            {...register("anio")}
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
