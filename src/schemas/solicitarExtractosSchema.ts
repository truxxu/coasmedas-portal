import * as yup from "yup";

export const solicitarExtractosSchema = yup.object({
  productId: yup.string().required("Selecciona un producto"),
  periodo: yup.string().required("Selecciona el período"),
});

export type SolicitarExtractosFormData = yup.InferType<
  typeof solicitarExtractosSchema
>;
