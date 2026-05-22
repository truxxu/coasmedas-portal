import * as yup from "yup";

export const certificadosProductosSchema = yup.object({
  tipoProducto: yup.string().required("Selecciona el producto"),
});

export type CertificadosProductosFormData = yup.InferType<
  typeof certificadosProductosSchema
>;
