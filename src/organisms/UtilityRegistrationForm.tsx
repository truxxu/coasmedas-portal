"use client";

import { Card, Button } from "@/src/atoms";
import { FormField, SelectField } from "@/src/molecules";
import type {
  CityOption,
  ConvenioOption,
  UtilityRegistrationForm as FormData,
  UtilityRegistrationErrors,
} from "@/src/types";

interface UtilityRegistrationFormProps {
  cities: CityOption[];
  convenios: ConvenioOption[];
  formData: FormData;
  errors: UtilityRegistrationErrors;
  isLoading: boolean;
  onCityChange: (cityId: string, cityName: string) => void;
  onConvenioChange: (convenioId: string, convenioName: string) => void;
  onBillNumberChange: (value: string) => void;
  onAliasChange: (value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export function UtilityRegistrationForm({
  cities,
  convenios,
  formData,
  errors,
  isLoading,
  onCityChange,
  onConvenioChange,
  onBillNumberChange,
  onAliasChange,
  onSubmit,
  onBack,
}: UtilityRegistrationFormProps) {
  // Convert cities to select options
  const cityOptions = cities.map((city) => ({
    value: city.id,
    label: city.name,
  }));

  // Convert convenios to select options
  const convenioOptions = convenios.map((convenio) => ({
    value: convenio.id,
    label: convenio.name,
  }));

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityId = e.target.value;
    const city = cities.find((c) => c.id === cityId);
    onCityChange(cityId, city?.name || "");
  };

  const handleConvenioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const convenioId = e.target.value;
    const convenio = convenios.find((c) => c.id === convenioId);
    onConvenioChange(convenioId, convenio?.name || "");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Card className="p-6 md:p-8">
      {/* Section Title */}
      <h2 className="text-lg font-bold text-brand-navy mb-6">
        Inscripcion de Servicios Publicos
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Ciudad Select */}
        <SelectField
          label="Ciudad"
          name="ciudad"
          options={cityOptions}
          placeholder="Selecciona una ciudad"
          value={formData.cityId}
          onChange={handleCityChange}
          error={errors.cityId}
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
          disabled={!formData.cityId || convenioOptions.length === 0}
          required
        />

        {/* Bill Number Input */}
        <FormField
          label="Numero de Factura o Referencia"
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

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-medium text-brand-teal-dark hover:underline"
          >
            Volver
          </button>
          <Button type="submit" variant="primary" disabled={isLoading}>
            {isLoading ? "Inscribiendo..." : "Inscribir"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
