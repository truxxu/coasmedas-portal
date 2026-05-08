"use client";

import {
  Controller,
  type Control,
  type FieldErrors,
  type UseFormRegister,
  type Path,
} from "react-hook-form";
import { ErrorMessage } from "@/src/atoms";
import type { AdminProductoFormValues } from "@/src/schemas/adminProductoSchema";

type LimitsPath =
  | "globalLimits"
  | `channelLimits.${
      | "web"
      | "app"
      | "oficinas"
      | "cajeros"
      | "datafonos"
      | "pse"
      | "breb"}`;

interface ProductLimitsRowProps {
  pathPrefix: LimitsPath;
  register: UseFormRegister<AdminProductoFormValues>;
  control: Control<AdminProductoFormValues>;
  errors: FieldErrors<AdminProductoFormValues>;
  disabled?: boolean;
}

const PERIODS: Array<{
  key: "daily" | "weekly" | "monthly";
  label: string;
}> = [
  { key: "daily", label: "Diarias:" },
  { key: "weekly", label: "Semanales:" },
  { key: "monthly", label: "Mensuales:" },
];

function getNestedError(
  errors: FieldErrors<AdminProductoFormValues>,
  path: string,
): string | undefined {
  const parts = path.split(".");
  let current: unknown = errors;
  for (const part of parts) {
    if (current && typeof current === "object" && part in current) {
      current = (current as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  if (
    current &&
    typeof current === "object" &&
    "message" in current &&
    typeof (current as { message?: unknown }).message === "string"
  ) {
    return (current as { message: string }).message;
  }
  return undefined;
}

export function ProductLimitsRow({
  pathPrefix,
  register,
  control,
  errors,
  disabled = false,
}: ProductLimitsRowProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Number of Transactions */}
      <div className="border border-brand-border rounded-md p-4">
        <h4 className="text-[15px] font-medium text-brand-primary mb-3">
          Número de Transacciones
        </h4>
        <div className="space-y-2">
          {PERIODS.map(({ key, label }) => {
            const path =
              `${pathPrefix}.transactions.${key}` as Path<AdminProductoFormValues>;
            const error = getNestedError(
              errors,
              `${pathPrefix}.transactions.${key}`,
            );
            return (
              <div key={key}>
                <div className="flex items-center justify-between gap-3">
                  <label
                    htmlFor={path}
                    className="text-sm text-brand-text-secondary"
                  >
                    {label}
                  </label>
                  <input
                    id={path}
                    type="number"
                    inputMode="numeric"
                    disabled={disabled}
                    {...register(path, { valueAsNumber: true })}
                    className={`w-24 h-8 px-2 text-right text-sm border rounded ${
                      error
                        ? "border-red-600"
                        : "border-brand-border focus:border-brand-primary"
                    } focus:outline-none`}
                  />
                </div>
                {error && (
                  <div className="flex justify-end">
                    <ErrorMessage message={error} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Amount per Transaction */}
      <div className="border border-brand-border rounded-md p-4">
        <h4 className="text-[15px] font-medium text-brand-primary mb-3">
          Monto por Transacción ($)
        </h4>
        <div className="space-y-2">
          {PERIODS.map(({ key, label }) => {
            const path =
              `${pathPrefix}.amounts.${key}` as Path<AdminProductoFormValues>;
            const error = getNestedError(
              errors,
              `${pathPrefix}.amounts.${key}`,
            );
            return (
              <div key={key}>
                <div className="flex items-center justify-between gap-3">
                  <label className="text-sm text-brand-text-secondary">
                    {label}
                  </label>
                  <Controller
                    name={path}
                    control={control}
                    render={({ field }) => {
                      const numericValue = Number(field.value) || 0;
                      const display = numericValue.toLocaleString("es-CO");
                      return (
                        <input
                          id={path}
                          type="text"
                          inputMode="numeric"
                          disabled={disabled}
                          value={display}
                          onChange={(e) => {
                            const cleaned = e.target.value.replace(
                              /[^\d]/g,
                              "",
                            );
                            field.onChange(cleaned ? parseInt(cleaned, 10) : 0);
                          }}
                          onBlur={field.onBlur}
                          className={`w-32 h-8 px-2 text-right text-sm border rounded ${
                            error
                              ? "border-red-600"
                              : "border-brand-border focus:border-brand-primary"
                          } focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed`}
                        />
                      );
                    }}
                  />
                </div>
                {error && (
                  <div className="flex justify-end">
                    <ErrorMessage message={error} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
