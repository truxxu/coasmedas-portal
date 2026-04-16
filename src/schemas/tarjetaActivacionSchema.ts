import * as yup from "yup";

export const tarjetaActivacionSchema = yup.object({
  fechaVencimiento: yup
    .string()
    .required("La fecha de vencimiento es requerida")
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "Formato inválido. Usa MM/AA"),

  cvv: yup
    .string()
    .required("El CVV es requerido")
    .matches(/^\d{3}$/, "El CVV debe tener 3 dígitos"),
});

export type TarjetaActivacionFormData = yup.InferType<
  typeof tarjetaActivacionSchema
>;
