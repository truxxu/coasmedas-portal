"use client";

import { useMemo } from "react";
import { Card } from "@/src/atoms";
import { FormField, SelectField } from "@/src/molecules";
import type {
  CategoryOption,
  ConvenioOption,
  UtilityRegistrationForm as FormData,
  UtilityRegistrationErrors,
} from "@/src/types";

interface UtilityRegistrationFormProps {
  categories: CategoryOption[];
  convenios: ConvenioOption[];
  formData: FormData;
  errors: UtilityRegistrationErrors;
  onCategoryChange: (categoryId: string, categoryName: string) => void;
  onConvenioChange: (convenioId: string, convenioName: string) => void;
  onBillNumberChange: (value: string) => void;
  onAliasChange: (value: string) => void;
}

export function UtilityRegistrationForm({
  categories,
  convenios,
  formData,
  errors,
  onCategoryChange,
  onConvenioChange,
  onBillNumberChange,
  onAliasChange,
}: UtilityRegistrationFormProps) {
  const categoryOptions = useMemo(() => categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  })), [categories]);

  const convenioOptions = useMemo(() => convenios.map((convenio) => ({
    value: convenio.id,
    label: convenio.name,
  })), [convenios]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    const category = categories.find((c) => c.id === categoryId);
    onCategoryChange(categoryId, category?.name || "");
  };

  const handleConvenioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const convenioId = e.target.value;
    const convenio = convenios.find((c) => c.id === convenioId);
    onConvenioChange(convenioId, convenio?.name || "");
  };

  return (
    <Card className="p-6 md:p-8">
      {/* Section Title */}
      <h2 className="text-lg font-bold text-brand-navy mb-6">
        Inscripción de Servicios Públicos
      </h2>

      <div className="space-y-5">
        {/* Categoría Select */}
        <SelectField
          label="Categoría"
          name="categoria"
          options={categoryOptions}
          placeholder="Selecciona una categoría"
          value={formData.categoryId}
          onChange={handleCategoryChange}
          error={errors.categoryId}
          required
        />

        {/* Convenio Select */}
        <SelectField
          label="Convenio"
          name="convenio"
          options={convenioOptions}
          placeholder="Selecciona un convenio"
          value={formData.convenioId}
          onChange={handleConvenioChange}
          error={errors.convenioId}
          disabled={!formData.categoryId || convenioOptions.length === 0}
          required
        />

        {/* Bill Number Input */}
        <FormField
          label="Número de Factura o Referencia"
          name="billNumber"
          type="text"
          placeholder="Ingresa el numero de factura"
          value={formData.billNumber}
          onChange={(e) => onBillNumberChange(e.target.value)}
          error={errors.billNumber}
          required
        />

        {/* Alias Input */}
        <FormField
          label='Alias (ej. "Luz Apartamento")'
          name="alias"
          type="text"
          placeholder="Ingresa un alias para identificar el servicio"
          value={formData.alias}
          onChange={(e) => onAliasChange(e.target.value)}
          error={errors.alias}
          maxLength={50}
          required
        />
      </div>
    </Card>
  );
}
