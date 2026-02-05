import * as yup from 'yup';

export const loginSchema = yup.object({
  documentType: yup
    .string()
    .required('Selecciona un tipo de documento')
    .oneOf(['CC', 'CE', 'TI', 'PA'], 'Tipo de documento inválido'),

  documentNumber: yup
    .string()
    .required('Número de documento es requerido')
    .matches(/^[0-9]+$/, 'Solo números permitidos')
    .min(6, 'Mínimo 6 dígitos')
    .max(15, 'Máximo 15 dígitos'),

  password: yup
    .string()
    .required('Contraseña es requerida')
    .min(8, 'Mínimo 8 caracteres'),
});

export type LoginFormData = yup.InferType<typeof loginSchema>;

export const otpSchema = yup.object({
  otp: yup
    .string()
    .required('Código OTP es requerido')
    .matches(/^[0-9]{6}$/, 'El código debe ser de 6 dígitos'),
});

export type OtpFormData = yup.InferType<typeof otpSchema>;
