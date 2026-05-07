"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { CodeInputCard } from "@/src/organisms/CodeInputCard";
import { useUserContext, useWelcomeBar } from "@/src/contexts";
import { useSMSCodeVerification } from "@/src/hooks";
import { Step } from "@/src/types/stepper";
import {
  formatNowDate,
  formatNowTime,
  generateApprovalNumber,
} from "@/src/utils";
import { sendTransactionOtp } from "@/services/auth.service";

export interface TarjetaSmsMetadata {
  fechaTransaccion: string;
  horaTransaccion: string;
  numeroAprobacion: string;
  direccionIp: string;
  descripcion: string;
}

export interface TarjetaSmsCodePageProps<TConfirmation, TResult> {
  sessionKey: string;
  resultKey: string;
  fallbackPath: string;
  successPath: string;
  confirmationPath: string;
  breadcrumbs: string[];
  welcomeBarTitle: string;
  steps: Step[];
  submitLabel: string;
  buildResult: (
    confirmation: TConfirmation,
    meta: TarjetaSmsMetadata,
  ) => TResult;
  /**
   * Optional async verification step executed before `buildResult`. Use this
   * to perform a real backend call (e.g. createBrebKey). If it throws, the
   * error message bubbles up to the SMS card via `useSMSCodeVerification` and
   * the user remains on this step.
   */
  onVerify?: (confirmation: TConfirmation) => Promise<void>;
}

export function TarjetaSmsCodePage<TConfirmation, TResult>({
  sessionKey,
  resultKey,
  fallbackPath,
  successPath,
  confirmationPath,
  breadcrumbs,
  welcomeBarTitle,
  steps,
  submitLabel,
  buildResult,
  onVerify,
}: TarjetaSmsCodePageProps<TConfirmation, TResult>) {
  const router = useRouter();
  const { user } = useUserContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const { documentType, documentNumber } = user ?? {};

  const {
    code,
    error,
    isResendDisabled,
    resendCountdown,
    isLoading,
    handleCodeChange,
    handleResendCode,
    handleSubmit,
  } = useSMSCodeVerification({
    sessionKey,
    fallbackPath,
    successPath,
    onSubmit: async () => {
      const confirmationStr = sessionStorage.getItem(sessionKey);
      if (!confirmationStr) {
        throw new Error("Datos de transacción no encontrados");
      }
      const confirmation = JSON.parse(confirmationStr) as TConfirmation;

      if (onVerify) {
        await onVerify(confirmation);
      } else {
        await new Promise((resolve) => setTimeout(resolve, 800));
      }

      const meta: TarjetaSmsMetadata = {
        fechaTransaccion: formatNowDate(),
        horaTransaccion: formatNowTime(),
        numeroAprobacion: generateApprovalNumber(),
        direccionIp: "192.168.1.2",
        descripcion: "Exitosa",
      };
      const result = buildResult(confirmation, meta);
      sessionStorage.setItem(resultKey, JSON.stringify(result));
    },
    onResend: async () => {
      if (!documentType || !documentNumber) return;
      await sendTransactionOtp({
        documentType,
        documentNumber,
        trnType: "PaymentInternal",
      });
    },
  });

  useEffect(() => {
    setWelcomeBar({
      title: welcomeBarTitle,
      backHref: confirmationPath,
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar, welcomeBarTitle, confirmationPath]);

  const handleBack = () => {
    router.push(confirmationPath);
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={breadcrumbs} />

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={3} steps={steps} />
      </div>

      <CodeInputCard
        code={code}
        onCodeChange={handleCodeChange}
        onResend={handleResendCode}
        hasError={!!error}
        errorMessage={error}
        resendDisabled={isResendDisabled}
        resendCountdown={resendCountdown > 0 ? resendCountdown : undefined}
        disabled={isLoading}
      />

      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          disabled={isLoading}
          className="text-sm font-medium text-brand-navy hover:underline disabled:opacity-50"
        >
          Volver
        </button>
        <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? "Procesando..." : submitLabel}
        </Button>
      </div>
    </div>
  );
}
