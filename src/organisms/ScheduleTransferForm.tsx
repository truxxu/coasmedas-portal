"use client";

import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { DateInput } from "@/src/atoms";
import { FormField, SelectField } from "@/src/molecules";
import {
  scheduledTransferSchema,
  type ScheduledTransferFormValues,
} from "@/src/schemas/scheduledTransferSchema";
import { TRANSACTION_TYPE_OPTIONS, PERIODICITY_OPTIONS } from "@/src/mocks";
import { formatCurrency, maskCurrency } from "@/src/utils";
import type {
  ScheduleSourceAccount,
  ScheduleDestinationAccount,
} from "@/src/types/scheduledTransfer";
import { Label, ErrorMessage } from "@/src/atoms";

interface ScheduleTransferFormProps {
  sourceAccounts: ScheduleSourceAccount[];
  destinationAccounts: ScheduleDestinationAccount[];
  hideBalances: boolean;
  onSubmit: (data: ScheduledTransferFormValues) => void;
  onBack: () => void;
}

export function ScheduleTransferForm({
  sourceAccounts,
  destinationAccounts,
  hideBalances,
  onSubmit,
  onBack,
}: ScheduleTransferFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isValid },
  } = useForm<ScheduledTransferFormValues>({
    resolver: yupResolver(scheduledTransferSchema),
    mode: "onChange",
    defaultValues: {
      transactionType: "",
      startDate: "",
      periodicity: "unica",
      sourceAccountId: "",
      destinationAccountId: "",
      amount: undefined,
      numberOfPayments: undefined,
      concept: "",
    },
  });

  const periodicity = useWatch({ control, name: "periodicity" });
  const startDate = useWatch({ control, name: "startDate" });
  const isRecurring = periodicity === "mensual" || periodicity === "quincenal";

  // Clear conditional fields when switching to "unica"
  useEffect(() => {
    if (!isRecurring) {
      setValue("sourceAccountId", "");
      setValue("destinationAccountId", "");
      setValue("amount", undefined);
    }
  }, [isRecurring, setValue]);

  const transactionTypeOptions = TRANSACTION_TYPE_OPTIONS.map((opt) => ({
    value: opt.value,
    label: opt.label,
  }));

  const periodicityOptions = PERIODICITY_OPTIONS.map((opt) => ({
    value: opt.value,
    label: opt.label,
  }));

  const sourceAccountOptions = sourceAccounts.map((acc) => ({
    value: acc.id,
    label: `${acc.name} - Saldos: ${hideBalances ? maskCurrency() : formatCurrency(acc.balance)}`,
  }));

  const destinationAccountOptions = destinationAccounts.map((acc) => ({
    value: acc.id,
    label: `${acc.name} (${acc.accountNumber})`,
  }));

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* 1. Tipo de Transacción */}
        <SelectField
          label="Tipo de Transacción"
          options={transactionTypeOptions}
          placeholder="Seleccione"
          error={errors.transactionType?.message}
          required
          {...register("transactionType")}
        />

        {/* Conditional fields for recurring */}
        {isRecurring && (
          <>
            {/* 2. Cuenta Origen */}
            <SelectField
              label="Cuenta Origen"
              options={sourceAccountOptions}
              placeholder="Seleccione una cuenta"
              error={errors.sourceAccountId?.message}
              required
              {...register("sourceAccountId")}
            />

            {/* 3. Cuenta Externa Inscrita */}
            <SelectField
              label="Cuenta Externa Inscrita"
              options={destinationAccountOptions}
              placeholder="Seleccione una cuenta destino"
              error={errors.destinationAccountId?.message}
              required
              {...register("destinationAccountId")}
            />

            {/* 4. Monto */}
            <FormField
              label="Monto"
              type="number"
              placeholder="$ 0"
              error={errors.amount?.message}
              required
              {...register("amount")}
            />
          </>
        )}

        {/* 5. Fecha de Inicio del Pago */}
        <div className="flex flex-col">
          <Label htmlFor="startDate" required>
            Fecha de Inicio del Pago
          </Label>
          <DateInput
            {...register("startDate")}
            onChange={(value) =>
              setValue("startDate", value, { shouldValidate: true })
            }
            value={startDate}
            error={errors.startDate?.message}
            className="w-full"
          />
          <ErrorMessage message={errors.startDate?.message} />
        </div>

        {/* 6. Periodicidad */}
        <SelectField
          label="Periodicidad"
          options={periodicityOptions}
          placeholder="Seleccione"
          error={errors.periodicity?.message}
          required
          {...register("periodicity")}
        />

        {/* 7. Número de Pagos */}
        <FormField
          label="Número de Pagos"
          type="number"
          placeholder="Opcional"
          error={errors.numberOfPayments?.message}
          {...register("numberOfPayments")}
        />

        {/* 8. Concepto o Descripción */}
        <FormField
          label="Concepto o Descripción"
          placeholder="Opcional"
          error={errors.concept?.message}
          {...register("concept")}
        />

        {/* Actions */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={onBack}
            className="text-sm font-medium text-brand-teal-dark hover:underline"
          >
            Volver
          </button>
          <button
            type="submit"
            disabled={!isValid}
            className={
              isValid
                ? "bg-brand-primary text-white rounded-md shadow-sm px-7 py-2 text-sm font-bold"
                : "bg-[#8FE6FF] text-white rounded-md px-7 py-2 text-sm font-bold cursor-not-allowed"
            }
          >
            Programar
          </button>
        </div>
      </form>
    </div>
  );
}
