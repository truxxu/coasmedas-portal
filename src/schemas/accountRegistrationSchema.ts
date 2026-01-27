import * as yup from "yup";

export const accountRegistrationSchema = yup.object({
  accountBankType: yup
    .string()
    .oneOf(["otro_banco", "red_coopcentral"])
    .required("Seleccione el tipo de cuenta"),

  entidadFinanciera: yup.string().when("accountBankType", {
    is: "otro_banco",
    then: (schema) => schema.required("Seleccione la entidad financiera"),
    otherwise: (schema) => schema.notRequired(),
  }),

  cooperativa: yup.string().when("accountBankType", {
    is: "red_coopcentral",
    then: (schema) => schema.required("Seleccione la cooperativa"),
    otherwise: (schema) => schema.notRequired(),
  }),

  tipoCuenta: yup
    .string()
    .oneOf(["ahorros", "corriente"])
    .required("Seleccione el tipo de cuenta"),

  numeroCuenta: yup
    .string()
    .matches(/^\d+$/, "Solo se permiten números")
    .min(8, "El número de cuenta debe tener al menos 8 dígitos")
    .max(20, "El número de cuenta no puede exceder 20 dígitos")
    .required("Ingrese el número de cuenta"),

  tipoTitular: yup
    .string()
    .oneOf(["persona_natural", "persona_juridica"])
    .required("Seleccione el tipo de titular"),

  nombreTitular: yup.string().when("tipoTitular", {
    is: "persona_natural",
    then: (schema) => schema.required("Ingrese el nombre del titular"),
    otherwise: (schema) => schema.notRequired(),
  }),

  apellidosTitular: yup.string().when("tipoTitular", {
    is: "persona_natural",
    then: (schema) => schema.required("Ingrese los apellidos del titular"),
    otherwise: (schema) => schema.notRequired(),
  }),

  razonSocial: yup.string().when("tipoTitular", {
    is: "persona_juridica",
    then: (schema) => schema.required("Ingrese la razon social"),
    otherwise: (schema) => schema.notRequired(),
  }),

  tipoDocumento: yup
    .string()
    .oneOf(["cc", "nit", "ce", "pasaporte"])
    .required("Seleccione el tipo de documento"),

  documentoTitular: yup
    .string()
    .matches(/^\d+$/, "Solo se permiten números")
    .min(6, "El documento debe tener al menos 6 dígitos")
    .max(12, "El documento no puede exceder 12 dígitos")
    .required("Ingrese el documento del titular"),

  alias: yup
    .string()
    .max(50, "El alias no puede exceder 50 caracteres")
    .required("Ingrese un alias para la cuenta"),
});

export type AccountRegistrationSchemaType = yup.InferType<
  typeof accountRegistrationSchema
>;
