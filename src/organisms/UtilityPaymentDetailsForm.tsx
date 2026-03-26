"use client";

import { useMemo } from "react";
import { Card, CurrencyInput } from "@/src/atoms";
import { FormField, SelectField } from "@/src/molecules";
import { formatCurrency } from "@/src/utils";
import type {
  UtilitySourceAccount,
  RegisteredService,
  UtilityPaymentDetails,
  UtilityPaymentMethod,
  UtilityPaymentType,
  CategoryOption,
  ConvenioOption,
} from "@/src/types";

interface UtilityPaymentDetailsFormProps {
  sourceAccounts: UtilitySourceAccount[];
  registeredServices: RegisteredService[];
  formData: UtilityPaymentDetails;
  errors: {
    sourceAccount?: string;
    service?: string;
    categoryId?: string;
    convenioId?: string;
    reference?: string;
    amount?: string;
  };
  onSourceAccountChange: (
    accountId: string,
    paymentMethod: UtilityPaymentMethod,
  ) => void;
  onServiceChange: (serviceId: string) => void;
  // Non-registered service props
  categories: CategoryOption[];
  convenios: ConvenioOption[];
  onPaymentTypeChange: (paymentType: UtilityPaymentType) => void;
  onCategoryChange: (categoryId: string, categoryName: string) => void;
  onConvenioChange: (convenioId: string, convenioName: string) => void;
  onReferenceChange: (value: string) => void;
  onAmountChange: (value: number) => void;
}

export function UtilityPaymentDetailsForm({
  sourceAccounts,
  registeredServices,
  formData,
  errors,
  onSourceAccountChange,
  onServiceChange,
  categories,
  convenios,
  onPaymentTypeChange,
  onCategoryChange,
  onConvenioChange,
  onReferenceChange,
  onAmountChange,
}: UtilityPaymentDetailsFormProps) {
  const accountOptions = useMemo(
    () => [
      ...sourceAccounts.map((account) => ({
        value: account.id,
        label: account.displayName,
      })),
      { value: "pse", label: "PSE (Pagos con otras entidades)" },
    ],
    [sourceAccounts],
  );

  const serviceOptions = useMemo(
    () =>
      registeredServices.map((service) => ({
        value: service.id,
        label: service.displayName,
      })),
    [registeredServices],
  );

  const categoryOptions = useMemo(
    () =>
      categories.map((cat) => ({
        value: cat.id,
        label: cat.name,
      })),
    [categories],
  );

  const convenioOptions = useMemo(
    () =>
      convenios.map((conv) => ({
        value: conv.id,
        label: conv.name,
      })),
    [convenios],
  );

  const handleAccountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const isPSE = value === "pse";
    onSourceAccountChange(value, isPSE ? "pse" : "account");
  };

  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onServiceChange(e.target.value);
  };

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

  const isInscrito = formData.paymentType === "inscrito";

  return (
    <Card className="p-6 md:p-8">
      {/* Section Title */}
      <h2 className="text-lg font-bold text-brand-teal-dark mb-6">
        Pago de Servicios Públicos
      </h2>

      <div className="space-y-5">
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

        {/* Tipo de Pago Radio Group */}
        <div className="max-w-[500px] mx-auto">
          <label className="block text-sm font-medium text-black mb-2">
            Tipo de Pago
          </label>
          <div
            role="radiogroup"
            aria-label="Tipo de pago"
            className="flex flex-row gap-6"
          >
            {[
              { value: "inscrito" as const, label: "Servicio Inscrito" },
              {
                value: "no-inscrito" as const,
                label: "Otro Servicio (No inscrito)",
              },
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="paymentType"
                  value={option.value}
                  checked={formData.paymentType === option.value}
                  onChange={() => onPaymentTypeChange(option.value)}
                  className="sr-only"
                  aria-checked={formData.paymentType === option.value}
                />
                <span
                  className={`
                    w-4 h-4 rounded-full border flex items-center justify-center
                    transition-colors duration-150
                    ${
                      formData.paymentType === option.value
                        ? "border-brand-primary"
                        : "border-brand-footer-text"
                    }
                  `}
                >
                  {formData.paymentType === option.value && (
                    <span className="w-2 h-2 rounded-full bg-brand-primary" />
                  )}
                </span>
                <span className="text-sm text-brand-text-black">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Conditional fields based on payment type */}
        {isInscrito ? (
          /* Servicio Inscrito: registered service dropdown */
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
        ) : (
          /* Otro Servicio: category, convenio, referencia fields */
          <>
            <div className="max-w-[500px] mx-auto">
              <SelectField
                label="Categoría"
                name="categoria"
                options={categoryOptions}
                placeholder="Seleccione..."
                value={formData.categoryId || ""}
                onChange={handleCategoryChange}
                error={errors.categoryId}
                required
              />
            </div>
            <div className="max-w-[500px] mx-auto">
              <SelectField
                label="Convenio"
                name="convenio"
                options={convenioOptions}
                placeholder="Seleccione..."
                value={formData.convenioId || ""}
                onChange={handleConvenioChange}
                error={errors.convenioId}
                disabled={!formData.categoryId || convenioOptions.length === 0}
                required
              />
            </div>
            <div className="max-w-[500px] mx-auto">
              <FormField
                label="Referencia"
                name="referencia"
                type="text"
                placeholder="Ingresa la referencia o número de factura"
                value={formData.reference || ""}
                onChange={(e) => onReferenceChange(e.target.value)}
                error={errors.reference}
                required
              />
            </div>
          </>
        )}

        {/* Valor a Pagar */}
        <div className="max-w-[500px] mx-auto">
          <label className="block text-sm font-medium text-black mb-1">
            Valor a Pagar
          </label>
          {isInscrito ? (
            <input
              type="text"
              value={formData.amount > 0 ? formatCurrency(formData.amount) : ""}
              readOnly
              className="w-full h-11 px-3 rounded-md border border-brand-border text-base text-black bg-gray-50 cursor-not-allowed"
            />
          ) : (
            <>
              <CurrencyInput
                value={formData.amount}
                onChange={onAmountChange}
                className="w-full"
              />
              {errors.amount && (
                <p className="text-sm text-brand-error mt-1">{errors.amount}</p>
              )}
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
