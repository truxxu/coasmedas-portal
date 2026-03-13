import * as yup from "yup";

export const scheduledTransferSchema = yup.object({
  transactionType: yup
    .string()
    .required("Seleccione un tipo de transacción"),

  startDate: yup
    .string()
    .required("Ingrese la fecha de inicio del pago"),

  periodicity: yup
    .string()
    .oneOf(["unica", "mensual", "quincenal"])
    .required("Seleccione la periodicidad"),

  sourceAccountId: yup.string().when("periodicity", {
    is: (val: string) => val === "mensual" || val === "quincenal",
    then: (schema) => schema.required("Seleccione una cuenta origen"),
    otherwise: (schema) => schema.notRequired(),
  }),

  destinationAccountId: yup.string().when("periodicity", {
    is: (val: string) => val === "mensual" || val === "quincenal",
    then: (schema) => schema.required("Seleccione una cuenta destino"),
    otherwise: (schema) => schema.notRequired(),
  }),

  amount: yup.number().when("periodicity", {
    is: (val: string) => val === "mensual" || val === "quincenal",
    then: (schema) =>
      schema
        .transform((value, originalValue) => {
          if (typeof originalValue === "string") {
            const cleaned = originalValue.replace(/[^0-9]/g, "");
            return cleaned ? Number(cleaned) : undefined;
          }
          return value;
        })
        .required("Ingrese el monto a transferir")
        .moreThan(0, "El monto debe ser mayor a 0"),
    otherwise: (schema) => schema.notRequired(),
  }),

  numberOfPayments: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" || originalValue === undefined ? undefined : value
    )
    .optional()
    .positive("Debe ser un número entero positivo")
    .integer("Debe ser un número entero positivo"),

  concept: yup
    .string()
    .optional()
    .max(100, "El concepto no puede exceder 100 caracteres"),
});

export type ScheduledTransferFormValues = yup.InferType<
  typeof scheduledTransferSchema
>;
