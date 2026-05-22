import * as yup from "yup";

const positiveInt = yup
  .number()
  .typeError("Debe ser un número")
  .integer("Debe ser un entero")
  .min(0, "Debe ser mayor o igual a 0")
  .required("Requerido");

const positiveAmount = yup
  .number()
  .typeError("Debe ser un número")
  .min(0, "Debe ser mayor o igual a 0")
  .required("Requerido");

const limitsSchema = yup.object({
  transactions: yup.object({
    daily: positiveInt,
    weekly: positiveInt.test(
      "weekly-gte-daily",
      "Debe ser ≥ diario",
      function (value) {
        return value === undefined || value >= (this.parent.daily ?? 0);
      },
    ),
    monthly: positiveInt.test(
      "monthly-gte-weekly",
      "Debe ser ≥ semanal",
      function (value) {
        return value === undefined || value >= (this.parent.weekly ?? 0);
      },
    ),
  }),
  amounts: yup.object({
    daily: positiveAmount,
    weekly: positiveAmount.test(
      "weekly-gte-daily",
      "Debe ser ≥ diario",
      function (value) {
        return value === undefined || value >= (this.parent.daily ?? 0);
      },
    ),
    monthly: positiveAmount.test(
      "monthly-gte-weekly",
      "Debe ser ≥ semanal",
      function (value) {
        return value === undefined || value >= (this.parent.weekly ?? 0);
      },
    ),
  }),
});

const channelLimitsSchema = yup.object({
  transactions: yup.object({
    daily: positiveInt,
    weekly: positiveInt,
    monthly: positiveInt,
  }),
  amounts: yup.object({
    daily: positiveAmount,
    weekly: positiveAmount,
    monthly: positiveAmount,
  }),
});

export const adminProductoSchema = yup
  .object({
    alias: yup
      .string()
      .trim()
      .required("El alias es requerido")
      .max(40, "Máximo 40 caracteres"),
    globalLimits: limitsSchema,
    channelLimits: yup.object({
      web: channelLimitsSchema,
      app: channelLimitsSchema,
      oficinas: channelLimitsSchema,
      cajeros: channelLimitsSchema,
      datafonos: channelLimitsSchema,
      pse: channelLimitsSchema,
      breb: channelLimitsSchema,
    }),
  })
  .test(
    "channels-within-globals",
    "Los límites por canal no pueden superar los globales",
    function (value) {
      if (!value) return true;
      const errors: yup.ValidationError[] = [];
      const channels = [
        "web",
        "app",
        "oficinas",
        "cajeros",
        "datafonos",
        "pse",
        "breb",
      ] as const;
      const buckets: Array<
        ["transactions" | "amounts", "daily" | "weekly" | "monthly"]
      > = [
        ["transactions", "daily"],
        ["transactions", "weekly"],
        ["transactions", "monthly"],
        ["amounts", "daily"],
        ["amounts", "weekly"],
        ["amounts", "monthly"],
      ];
      for (const ch of channels) {
        const channel = value.channelLimits?.[ch];
        if (!channel) continue;
        for (const [kind, period] of buckets) {
          const channelVal = channel[kind]?.[period];
          const globalVal = value.globalLimits?.[kind]?.[period];
          if (
            typeof channelVal === "number" &&
            typeof globalVal === "number" &&
            channelVal > globalVal
          ) {
            errors.push(
              this.createError({
                path: `channelLimits.${ch}.${kind}.${period}`,
                message: `No puede superar el global (${globalVal.toLocaleString("es-CO")})`,
              }),
            );
          }
        }
      }
      if (errors.length > 0) {
        return new yup.ValidationError(errors);
      }
      return true;
    },
  );

export type AdminProductoFormValues = yup.InferType<typeof adminProductoSchema>;
