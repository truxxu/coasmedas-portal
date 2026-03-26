"use client";

import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Card, Button } from "@/src/atoms";
import {
  FormField,
  SelectField,
  AccountTypeRadioGroup,
  HolderTypeRadioGroup,
} from "@/src/molecules";
import { accountRegistrationSchema } from "@/src/schemas/accountRegistrationSchema";
import type {
  AccountRegistrationFormData,
  BankOption,
  CooperativaOption,
  DocumentTypeOption,
  RegistrationAccountTypeOption,
} from "@/src/types";

interface AccountRegistrationFormProps {
  mode: "register" | "edit";
  initialData?: AccountRegistrationFormData;
  banks: BankOption[];
  cooperativas: CooperativaOption[];
  documentTypes: DocumentTypeOption[];
  accountTypes: RegistrationAccountTypeOption[];
  onSubmit: (data: AccountRegistrationFormData) => void;
  onCancel?: () => void;
}

const defaultValues: AccountRegistrationFormData = {
  accountBankType: "otro_banco",
  entidadFinanciera: "",
  cooperativa: "",
  tipoCuenta: "ahorros",
  numeroCuenta: "",
  tipoTitular: "persona_natural",
  nombreTitular: "",
  apellidosTitular: "",
  razonSocial: "",
  tipoDocumento: "cc",
  documentoTitular: "",
  alias: "",
};

export function AccountRegistrationForm({
  mode,
  initialData,
  banks,
  cooperativas,
  documentTypes,
  accountTypes,
  onSubmit,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onCancel,
}: AccountRegistrationFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AccountRegistrationFormData>({
    resolver: yupResolver(accountRegistrationSchema),
    defaultValues: initialData || defaultValues,
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const accountBankType = watch("accountBankType");
  const tipoTitular = watch("tipoTitular");

  // Reset form when mode changes or initialData changes
  useEffect(() => {
    if (mode === "edit" && initialData) {
      reset(initialData);
    } else if (mode === "register") {
      reset(defaultValues);
    }
  }, [mode, initialData, reset]);

  const handleFormSubmit = (data: AccountRegistrationFormData) => {
    onSubmit(data);
  };

  const bankOptions = useMemo(
    () =>
      banks.map((bank) => ({
        value: bank.value,
        label: bank.label,
      })),
    [banks],
  );

  const cooperativaOptions = useMemo(
    () =>
      cooperativas.map((coop) => ({
        value: coop.value,
        label: coop.label,
      })),
    [cooperativas],
  );

  const documentTypeOptions = useMemo(
    () =>
      documentTypes.map((doc) => ({
        value: doc.value,
        label: doc.label,
      })),
    [documentTypes],
  );

  const accountTypeOptions = useMemo(
    () =>
      accountTypes.map((acc) => ({
        value: acc.value,
        label: acc.label,
      })),
    [accountTypes],
  );

  return (
    <Card className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-brand-navy mb-2">
          {mode === "register"
            ? "Inscripcion de Cuentas Externas"
            : "Editar Cuentas Externas"}
        </h2>
        <p className="text-sm text-brand-gray-high">
          {mode === "register"
            ? "Inscribe las cuentas de destino para tus transferencias a otros bancos y a la red Coopcentral."
            : "Edita la cuenta destino para tus transferencias a otros bancos y a la red Coopcentral."}
        </p>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
        {/* Account Type Selection */}
        <div>
          <label className="block text-sm font-medium text-brand-text-black mb-2">
            Tipo de Cuenta a Inscribir
          </label>
          <AccountTypeRadioGroup
            value={accountBankType}
            onChange={(value) => setValue("accountBankType", value)}
          />
        </div>

        {/* Conditional Bank/Cooperativa Field */}
        {accountBankType === "otro_banco" ? (
          <SelectField
            label="Entidad Financiera"
            {...register("entidadFinanciera")}
            options={bankOptions}
            placeholder="Seleccione.."
            error={errors.entidadFinanciera?.message}
            required
          />
        ) : (
          <SelectField
            label="Cooperativa"
            {...register("cooperativa")}
            options={cooperativaOptions}
            placeholder="Seleccione.."
            error={errors.cooperativa?.message}
            required
          />
        )}

        {/* Account Type and Number */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="Tipo de Cuenta"
            {...register("tipoCuenta")}
            options={accountTypeOptions}
            placeholder="Seleccione.."
            error={errors.tipoCuenta?.message}
            required
          />
          <FormField
            label="Número de Cuenta"
            {...register("numeroCuenta")}
            type="text"
            placeholder="Ingrese el número"
            error={errors.numeroCuenta?.message}
            required
          />
        </div>

        {/* Holder Type Selection */}
        <div>
          <label className="block text-sm font-medium text-brand-text-black mb-2">
            Tipo de Titular
          </label>
          <HolderTypeRadioGroup
            value={tipoTitular}
            onChange={(value) => setValue("tipoTitular", value)}
          />
        </div>

        {/* Conditional Holder Fields */}
        {tipoTitular === "persona_natural" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Nombre del Titular"
              {...register("nombreTitular")}
              type="text"
              placeholder="Ingrese el nombre"
              error={errors.nombreTitular?.message}
              required
            />
            <FormField
              label="Apellidos del Titular"
              {...register("apellidosTitular")}
              type="text"
              placeholder="Ingrese los apellidos"
              error={errors.apellidosTitular?.message}
              required
            />
          </div>
        ) : (
          <FormField
            label="Razon Social del Titular"
            {...register("razonSocial")}
            type="text"
            placeholder="Ingrese la razon social"
            error={errors.razonSocial?.message}
            required
          />
        )}

        {/* Document Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SelectField
            label="Tipo de Documento"
            {...register("tipoDocumento")}
            options={documentTypeOptions}
            placeholder="Seleccione.."
            error={errors.tipoDocumento?.message}
            required
          />
          <FormField
            label="Documento del Titular (C.C. o NIT)"
            {...register("documentoTitular")}
            type="text"
            placeholder="Ingrese el documento"
            error={errors.documentoTitular?.message}
            required
          />
        </div>

        {/* Alias Field */}
        <FormField
          label="Alias de la cuenta"
          {...register("alias")}
          type="text"
          placeholder="Ej: Cuenta Mama"
          error={errors.alias?.message}
          maxLength={50}
          required
        />

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          className="w-full h-10 bg-brand-primary hover:bg-brand-primary-dark text-white"
        >
          {mode === "register" ? "Inscribir Cuenta" : "Editar Cuenta"}
        </Button>
      </form>
    </Card>
  );
}
