'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema, LoginFormData } from '@/src/schemas/loginSchema';
import { FormField, SelectField, PasswordField, CaptchaPlaceholder } from '@/src/molecules';
import { Button, Link } from '@/src/atoms';
import { DOCUMENT_TYPES } from '@/src/constants/documentTypes';

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log('Form submitted:', data);
    // Future: API integration
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    alert('Login exitoso (demo)');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {/* Required fields note */}
      <p className="text-xs text-gray-600">* Campos obligatorios</p>

      {/* Document Type */}
      <SelectField
        label="Tipo de documento"
        options={DOCUMENT_TYPES}
        placeholder="Selecciona un tipo"
        required
        error={errors.documentType?.message}
        {...register('documentType')}
      />

      {/* Document Number */}
      <FormField
        label="Número de documento"
        type="text"
        placeholder=""
        required
        error={errors.documentNumber?.message}
        {...register('documentNumber')}
      />

      {/* Password */}
      <PasswordField
        label="Contraseña"
        required
        error={errors.password?.message}
        {...register('password')}
      />

      {/* Terms & Conditions */}
      <p className="text-xs text-black text-center">
        Al ingresar, aceptas nuestros{' '}
        <Link href="/terms" className="text-brand-navy font-medium text-[13px]">
          Términos y Condiciones
        </Link>
      </p>

      {/* CAPTCHA Placeholder */}
      <CaptchaPlaceholder />

      {/* Submit Button */}
      <Button
        type="submit"
        variant={isValid ? 'primary' : 'disabled'}
        disabled={!isValid || isSubmitting}
        size="md"
        className="w-full"
      >
        {isSubmitting ? 'Ingresando...' : 'Ingresar'}
      </Button>

      {/* Forgot Password */}
      <Link href="/forgot-password" className="text-brand-navy text-center text-sm font-medium">
        ¿Olvidaste tu contraseña?
      </Link>
    </form>
  );
}
