"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { CodeInputCard } from "@/src/organisms/CodeInputCard";
import { useUserContext, useWelcomeBar } from "@/src/contexts";
import { useSMSCodeVerification } from "@/src/hooks";
import { Step } from "@/src/types/stepper";
import { sendTransactionOtp } from "@/services/auth.service";
import type { SendTransactionOtpRequest } from "@/types/api/auth";

export interface TransferSmsCodePageProps {
  sessionKey: string;
  fallbackPath: string;
  successPath: string;
  confirmationPath: string;
  breadcrumbs: string[];
  welcomeBarTitle: string;
  steps: Step[];
  submitLabel: string;
  resendTrnType: SendTransactionOtpRequest["trnType"];
  onSubmit: (otp: string) => Promise<void>;
}

export function TransferSmsCodePage({
  sessionKey,
  fallbackPath,
  successPath,
  confirmationPath,
  breadcrumbs,
  welcomeBarTitle,
  steps,
  submitLabel,
  resendTrnType,
  onSubmit,
}: TransferSmsCodePageProps) {
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();
  const { user } = useUserContext();
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
    onSubmit,
    onResend: async () => {
      if (!documentType || !documentNumber) return;
      await sendTransactionOtp({
        documentType,
        documentNumber,
        trnType: resendTrnType,
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
      <div className="flex items-center justify-between">
        <Breadcrumbs items={breadcrumbs} />
      </div>

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={3} steps={steps} />
      </div>

      <CodeInputCard
        code={code}
        onCodeChange={handleCodeChange}
        hasError={!!error}
        errorMessage={error}
        onResend={handleResendCode}
        resendDisabled={isResendDisabled}
        resendCountdown={resendCountdown > 0 ? resendCountdown : undefined}
        disabled={isLoading}
      />

      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          disabled={isLoading}
          className="text-sm font-medium text-brand-teal-dark hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Volver
        </button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isLoading || code.length !== 6}
        >
          {isLoading ? "Procesando..." : submitLabel}
        </Button>
      </div>
    </div>
  );
}
