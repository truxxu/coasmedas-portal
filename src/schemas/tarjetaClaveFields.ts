import * as yup from "yup";

export const fechaVencimientoField = yup
  .string()
  .required("La fecha de vencimiento es requerida")
  .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "Formato inválido. Usa MM/AA");

export const cvvField = yup
  .string()
  .required("El CVV es requerido")
  .matches(/^\d{3}$/, "El CVV debe tener 3 dígitos");

export const nuevaClaveField = yup
  .string()
  .required("La clave es requerida")
  .matches(/^\d{4}$/, "La clave debe tener 4 dígitos");

export const confirmarClaveField = yup
  .string()
  .required("La confirmación es requerida")
  .oneOf([yup.ref("nuevaClave")], "Las claves no coinciden");
