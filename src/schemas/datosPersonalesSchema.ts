import * as yup from "yup";

const PHONE_REGEX = /^\d{7,15}$/;

export const datosPersonalesSchema = yup.object({
  infoBasica: yup.object({
    documentType: yup.string().required(),
    documentNumber: yup.string().required(),
    birthDate: yup.string().required(),
    fullName: yup.string().required(),
  }),
  contacto: yup.object({
    gender: yup.string().required("Selecciona un género"),
    mobilePhone: yup
      .string()
      .matches(PHONE_REGEX, "Ingresa un teléfono válido")
      .required("El teléfono es obligatorio"),
    email: yup
      .string()
      .email("Ingresa un correo válido")
      .required("El correo es obligatorio"),
    residenceState: yup.string().required("El departamento es obligatorio"),
    residenceCity: yup.string().required("La ciudad es obligatoria"),
  }),
  laborales: yup.object({
    company: yup.string().required("La empresa es obligatoria"),
    position: yup.string().required("El cargo es obligatorio"),
    workPhone: yup
      .string()
      .matches(PHONE_REGEX, "Ingresa un teléfono válido")
      .required("El teléfono es obligatorio"),
    workAddress: yup.string().required("La dirección es obligatoria"),
    workCity: yup.string().required("La ciudad es obligatoria"),
    workState: yup.string().required("El departamento es obligatorio"),
    occupation: yup.string().required("La ocupación es obligatoria"),
    economicActivity: yup
      .string()
      .required("La actividad económica es obligatoria"),
  }),
  financieros: yup.object({
    monthlyIncome: yup
      .number()
      .typeError("Ingresa un valor numérico")
      .min(0, "Debe ser mayor o igual a 0")
      .required("Los ingresos mensuales son obligatorios"),
    otherIncome: yup
      .number()
      .typeError("Ingresa un valor numérico")
      .min(0, "Debe ser mayor o igual a 0")
      .required("Otros ingresos es obligatorio"),
    monthlyExpenses: yup
      .number()
      .typeError("Ingresa un valor numérico")
      .min(0, "Debe ser mayor o igual a 0")
      .required("Los egresos mensuales son obligatorios"),
    totalAssets: yup
      .number()
      .typeError("Ingresa un valor numérico")
      .min(0, "Debe ser mayor o igual a 0")
      .required("Total activos es obligatorio"),
    totalLiabilities: yup
      .number()
      .typeError("Ingresa un valor numérico")
      .min(0, "Debe ser mayor o igual a 0")
      .required("Total pasivos es obligatorio"),
  }),
});

export type DatosPersonalesFormValues = yup.InferType<
  typeof datosPersonalesSchema
>;
