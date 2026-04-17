import * as yup from "yup";
import {
  confirmarClaveField,
  cvvField,
  fechaVencimientoField,
  nuevaClaveField,
} from "./tarjetaClaveFields";

export const tarjetaClaveCambiarSchema = yup.object({
  fechaVencimiento: fechaVencimientoField,
  cvv: cvvField,
  claveActual: yup
    .string()
    .required("La clave actual es requerida")
    .matches(/^\d{4}$/, "La clave debe tener 4 dígitos"),
  nuevaClave: nuevaClaveField.notOneOf(
    [yup.ref("claveActual")],
    "La nueva clave no puede ser igual a la actual",
  ),
  confirmarClave: confirmarClaveField,
});

export type TarjetaClaveCambiarFormData = yup.InferType<
  typeof tarjetaClaveCambiarSchema
>;
