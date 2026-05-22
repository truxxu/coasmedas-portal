import * as yup from "yup";

export const certificadosTributariosSchema = yup.object({
  tipoCertificado: yup.string().required("Selecciona el tipo de certificado"),
  anio: yup.string().required("Selecciona el año"),
});

export type CertificadosTributariosFormData = yup.InferType<
  typeof certificadosTributariosSchema
>;
