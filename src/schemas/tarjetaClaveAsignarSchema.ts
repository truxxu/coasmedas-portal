import * as yup from "yup";
import {
  confirmarClaveField,
  cvvField,
  fechaVencimientoField,
  nuevaClaveField,
} from "./tarjetaClaveFields";

export const tarjetaClaveAsignarSchema = yup.object({
  fechaVencimiento: fechaVencimientoField,
  cvv: cvvField,
  nuevaClave: nuevaClaveField,
  confirmarClave: confirmarClaveField,
});

export type TarjetaClaveAsignarFormData = yup.InferType<
  typeof tarjetaClaveAsignarSchema
>;
