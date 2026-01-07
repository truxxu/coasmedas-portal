"use client";

import React from "react";
import { Card } from "@/src/atoms";
import { CodeInputGroup } from "@/src/molecules";

interface CodeInputCardProps {
  code: string;
  onCodeChange: (code: string) => void;
  hasError: boolean;
  errorMessage?: string;
  onResend: () => void;
  resendDisabled: boolean;
  resendCountdown?: number;
  disabled?: boolean;
}

export const CodeInputCard: React.FC<CodeInputCardProps> = ({
  code,
  onCodeChange,
  hasError,
  errorMessage,
  onResend,
  resendDisabled,
  resendCountdown,
  disabled = false,
}) => {
  return (
    <Card className="p-6 md:p-8 max-w-2xl mx-auto max-w-full">
      {/* Header */}
      <div className="text-center mb-6 md:mb-8">
        <h2 className="text-xl md:text-2xl font-bold text-brand-navy mb-2">
          Código Enviado a tu Teléfono
        </h2>
        <p className="text-sm md:text-base text-brand-gray-high">
          Ingresa la clave de 6 dígitos enviada a tu dispositivo para autorizar
          la transacción
        </p>
      </div>

      {/* Code Input */}
      <div className="mb-4">
        <CodeInputGroup
          value={code}
          onChange={onCodeChange}
          hasError={hasError}
          disabled={disabled}
        />
      </div>

      {/* Error Message */}
      {hasError && errorMessage && (
        <p className="text-sm text-brand-error text-center mb-4">
          {errorMessage}
        </p>
      )}

      {/* Resend Link */}
      <div className="text-center">
        <span className="text-sm md:text-base text-brand-gray-high">
          ¿No recibiste la clave?{" "}
        </span>
        <button
          type="button"
          onClick={onResend}
          disabled={resendDisabled}
          className={`text-sm md:text-base ${
            resendDisabled
              ? "text-brand-gray-medium cursor-not-allowed"
              : "text-brand-primary hover:underline"
          }`}
        >
          {resendDisabled && resendCountdown
            ? `Reenviar (${resendCountdown}s)`
            : "Reenviar"}
        </button>
      </div>
    </Card>
  );
};
