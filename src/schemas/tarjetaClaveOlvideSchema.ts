import * as yup from "yup";
import {
  confirmarClaveField,
  cvvField,
  fechaVencimientoField,
  nuevaClaveField,
} from "./tarjetaClaveFields";

export const tarjetaClaveOlvideSchema = yup.object({
  fechaVencimiento: fechaVencimientoField,
  cvv: cvvField,
  claveTransaccional: yup
    .string()
    .required("La clave transaccional es requerida")
    .min(4, "La clave transaccional es inválida"),
  nuevaClave: nuevaClaveField,
  confirmarClave: confirmarClaveField,
});

export type TarjetaClaveOlvideFormData = yup.InferType<
  typeof tarjetaClaveOlvideSchema
>;
