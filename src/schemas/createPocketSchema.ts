import * as yup from "yup";

export const createPocketSchema = yup.object({
  nombreBolsillo: yup
    .string()
    .trim()
    .required("El nombre es obligatorio")
    .min(3, "Mínimo 3 caracteres")
    .max(30, "Máximo 30 caracteres"),
});

export type CreatePocketFormData = yup.InferType<typeof createPocketSchema>;
