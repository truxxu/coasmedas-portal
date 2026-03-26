"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema, LoginFormData } from "@/src/schemas/loginSchema";
import {
  FormField,
  SelectField,
  PasswordField,
  CaptchaPlaceholder,
  CodeInputGroup,
} from "@/src/molecules";
import { Button, Link, ErrorMessage } from "@/src/atoms";
import { DOCUMENT_TYPES } from "@/src/constants/documentTypes";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/src/contexts";
import { getSaltAction, sendOtpAction, loginAction } from "@/app/actions/auth";
import type { UserIdentification } from "@/types/api/common";

type LoginStep = "credentials" | "otp";

const OTP_COOLDOWN_SECONDS = 60;

export function LoginForm() {
  const router = useRouter();
  const { login } = useUserContext();

  // Step state
  const [step, setStep] = useState<LoginStep>("credentials");
  const [hashedPassword, setHashedPassword] = useState("");
  const [maskedMobile, setMaskedMobile] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // OTP state
  const [otpValue, setOtpValue] = useState("");
  const [otpCooldown, setOtpCooldown] = useState(0);

  // Credentials form
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  // Cooldown timer
  useEffect(() => {
    if (otpCooldown <= 0) return;
    const timer = setTimeout(() => setOtpCooldown((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [otpCooldown]);

  // Handle credentials submit → get salt + send OTP in parallel, then hash password
  const onCredentialsSubmit = async (data: LoginFormData) => {
    setError("");
    setIsLoading(true);

    try {
      const identification: UserIdentification = {
        documentType: data.documentType as UserIdentification["documentType"],
        documentNumber: data.documentNumber,
      };

      // Run salt and OTP requests in parallel (async-parallel: independent operations)
      const [saltResult, otpResult] = await Promise.all([
        getSaltAction(identification),
        sendOtpAction(identification),
      ]);

      if (!saltResult.success || !saltResult.data) {
        setError(
          saltResult.error || "Error al obtener información de seguridad",
        );
        return;
      }

      if (!otpResult.success || !otpResult.data) {
        setError(
          otpResult.error || "Error al enviar el código de verificación",
        );
        return;
      }

      // Dynamic import bcryptjs only when needed (bundle-dynamic-imports)
      const bcrypt = await import("bcryptjs");
      const hashed = await bcrypt.hash(data.password, saltResult.data.salt);
      setHashedPassword(hashed);

      setMaskedMobile(otpResult.data.mobile);
      setOtpCooldown(OTP_COOLDOWN_SECONDS);
      setStep("otp");
    } catch {
      setError("Error inesperado. Intente nuevamente");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP submit → login
  const onOtpSubmit = async () => {
    if (otpValue.length !== 6) return;

    setError("");
    setIsLoading(true);

    try {
      const { documentType, documentNumber } = getValues();

      const result = await loginAction({
        documentType: documentType as UserIdentification["documentType"],
        documentNumber,
        password: hashedPassword,
        otp: otpValue,
      });

      if (!result.success || !result.data) {
        setError(result.error || "Error en el inicio de sesión");
        return;
      }

      // Store token in-memory and set user context
      login(result.data.userData, result.data.token);
      router.push("/home");
    } catch {
      setError("Error inesperado. Intente nuevamente");
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = useCallback(async () => {
    if (otpCooldown > 0) return;

    setError("");
    setIsLoading(true);

    try {
      const { documentType, documentNumber } = getValues();

      const otpResult = await sendOtpAction({
        documentType: documentType as UserIdentification["documentType"],
        documentNumber,
      });

      if (!otpResult.success) {
        setError(otpResult.error || "Error al reenviar el código");
        return;
      }

      setOtpValue("");
      setOtpCooldown(OTP_COOLDOWN_SECONDS);
    } catch {
      setError("Error al reenviar el código");
    } finally {
      setIsLoading(false);
    }
  }, [otpCooldown, getValues]);

  // Back to credentials step
  const handleBackToCredentials = () => {
    setStep("credentials");
    setOtpValue("");
    setError("");
    setHashedPassword("");
  };

  // ── OTP Step ──
  if (step === "otp") {
    return (
      <div className="flex flex-col gap-5">
        <p className="text-sm text-center text-brand-text-black">
          Código enviado a <span className="font-medium">{maskedMobile}</span>
        </p>

        <CodeInputGroup
          value={otpValue}
          onChange={setOtpValue}
          hasError={!!error}
          disabled={isLoading}
        />

        {error && <ErrorMessage message={error} />}

        <div className="flex justify-center">
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={otpCooldown > 0 || isLoading}
            className={`text-sm font-medium ${
              otpCooldown > 0 || isLoading
                ? "text-brand-gray-medium cursor-not-allowed"
                : "text-brand-navy hover:underline cursor-pointer"
            }`}
          >
            {otpCooldown > 0
              ? `Reenviar código (${otpCooldown}s)`
              : "Reenviar código"}
          </button>
        </div>

        <Button
          type="button"
          variant={otpValue.length === 6 ? "primary" : "disabled"}
          disabled={otpValue.length !== 6 || isLoading}
          size="md"
          className="w-full"
          onClick={onOtpSubmit}
        >
          {isLoading ? "Verificando..." : "Verificar"}
        </Button>

        <button
          type="button"
          onClick={handleBackToCredentials}
          disabled={isLoading}
          className="text-brand-navy text-center text-sm font-medium hover:underline cursor-pointer"
        >
          Volver
        </button>
      </div>
    );
  }

  // ── Credentials Step ──
  return (
    <form
      onSubmit={handleSubmit(onCredentialsSubmit)}
      className="flex flex-col gap-5"
    >
      {/* Required fields note */}
      <p className="text-xs text-gray-600">* Campos obligatorios</p>

      {/* Document Type */}
      <SelectField
        label="Tipo de documento"
        options={DOCUMENT_TYPES}
        placeholder="Selecciona un tipo"
        required
        error={errors.documentType?.message}
        {...register("documentType")}
      />

      {/* Document Number */}
      <FormField
        label="Número de documento"
        type="text"
        placeholder=""
        required
        error={errors.documentNumber?.message}
        {...register("documentNumber")}
      />

      {/* Password */}
      <PasswordField
        label="Contraseña"
        required
        error={errors.password?.message}
        {...register("password")}
      />

      {error && <ErrorMessage message={error} />}

      {/* Terms & Conditions */}
      <p className="text-xs text-black text-center">
        Al ingresar, aceptas nuestros{" "}
        <Link href="/terms" className="text-brand-navy font-medium text-[13px]">
          Términos y Condiciones
        </Link>
      </p>

      {/* CAPTCHA Placeholder */}
      <CaptchaPlaceholder />

      {/* Submit Button */}
      <Button
        type="submit"
        variant={isValid ? "primary" : "disabled"}
        disabled={!isValid || isLoading}
        size="md"
        className="w-full"
      >
        {isLoading ? "Ingresando..." : "Ingresar"}
      </Button>

      {/* Forgot Password */}
      <Link
        href="/forgot-password"
        className="text-brand-navy text-center text-sm font-medium"
      >
        ¿Olvidaste tu contraseña?
      </Link>
    </form>
  );
}
