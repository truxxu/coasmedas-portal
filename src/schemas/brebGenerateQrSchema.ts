import * as yup from "yup";

export const brebGenerateQrSchema = yup.object({
  sourceAccountId: yup.string().required("Seleccione la cuenta a recibir"),
  amount: yup
    .number()
    .typeError("Monto inválido")
    .min(0, "El monto no puede ser negativo")
    .required(),
});

export type BrebGenerateQrSchemaType = yup.InferType<
  typeof brebGenerateQrSchema
>;
