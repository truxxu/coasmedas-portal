"use client";

import { Card, Button } from "@/src/atoms";
import { SelectField } from "@/src/molecules";
import { formatCurrency } from "@/src/utils";
import type {
  SourceAccount,
  RegisteredService,
  UtilityPaymentDetails,
  UtilityPaymentMethod,
} from "@/src/types";

interface UtilityPaymentDetailsFormProps {
  sourceAccounts: SourceAccount[];
  registeredServices: RegisteredService[];
  formData: UtilityPaymentDetails;
  errors: {
    sourceAccount?: string;
    service?: string;
  };
  onSourceAccountChange: (accountId: string, paymentMethod: UtilityPaymentMethod) => void;
  onServiceChange: (serviceId: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export function UtilityPaymentDetailsForm({
  sourceAccounts,
  registeredServices,
  formData,
  errors,
  onSourceAccountChange,
  onServiceChange,
  onSubmit,
  onBack,
  isLoading = false,
}: UtilityPaymentDetailsFormProps) {
  // Convert source accounts to select options, adding PSE at the end
  const accountOptions = [
    ...sourceAccounts.map((account) => ({
      value: account.id,
      label: account.displayName,
    })),
    { value: "pse", label: "PSE (Pagos con otras entidades)" },
  ];

  // Convert registered services to select options
  const serviceOptions = registeredServices.map((service) => ({
    value: service.id,
    label: service.displayName,
  }));

  const handleAccountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const isPSE = value === "pse";
    onSourceAccountChange(value, isPSE ? "pse" : "account");
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onServiceChange(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <Card className="p-6 md:p-8">
      {/* Section Title */}
      <h2 className="text-lg font-bold text-brand-teal-dark mb-6">
        Pago de Servicios Publicos
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Cuenta Origen Select */}
        <div className="max-w-[500px] mx-auto">
          <SelectField
            label="Cuenta Origen"
            name="cuentaOrigen"
            options={accountOptions}
            placeholder="Selecciona una cuenta"
            value={formData.sourceAccountId}
            onChange={handleAccountChange}
            error={errors.sourceAccount}
            required
          />
        </div>

        {/* Servicio a Pagar Select */}
        <div className="max-w-[500px] mx-auto">
          <SelectField
            label="Servicio a Pagar"
            name="servicio"
            options={serviceOptions}
            placeholder="Selecciona un servicio"
            value={formData.serviceId}
            onChange={handleServiceChange}
            error={errors.service}
            required
          />
        </div>

        {/* Valor a Pagar (read-only, set by selected service) */}
        <div className="max-w-[500px] mx-auto">
          <label className="block text-sm font-medium text-black mb-1">
            Valor a Pagar
          </label>
          <input
            type="text"
            value={formData.amount > 0 ? formatCurrency(formData.amount) : ""}
            readOnly
            className="w-full h-11 px-3 rounded-md border border-brand-border text-base text-black bg-gray-50 cursor-not-allowed"
          />
        </div>

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
            {isLoading ? "Procesando..." : "Continuar"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
