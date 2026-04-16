import * as yup from "yup";

export const tarjetaClaveCambiarSchema = yup.object({
  fechaVencimiento: yup
    .string()
    .required("La fecha de vencimiento es requerida")
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "Formato inválido. Usa MM/AA"),

  cvv: yup
    .string()
    .required("El CVV es requerido")
    .matches(/^\d{3}$/, "El CVV debe tener 3 dígitos"),

  claveActual: yup
    .string()
    .required("La clave actual es requerida")
    .matches(/^\d{4}$/, "La clave debe tener 4 dígitos"),

  nuevaClave: yup
    .string()
    .required("La clave es requerida")
    .matches(/^\d{4}$/, "La clave debe tener 4 dígitos")
    .notOneOf(
      [yup.ref("claveActual")],
      "La nueva clave no puede ser igual a la actual",
    ),

  confirmarClave: yup
    .string()
    .required("La confirmación es requerida")
    .oneOf([yup.ref("nuevaClave")], "Las claves no coinciden"),
});

export type TarjetaClaveCambiarFormData = yup.InferType<
  typeof tarjetaClaveCambiarSchema
>;
