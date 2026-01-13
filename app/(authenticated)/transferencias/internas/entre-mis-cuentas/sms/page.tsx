"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { CodeInputCard } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import { TRANSFER_STEPS, TRANSFER_MOCK_VALID_CODE } from "@/src/mocks";

export default function SMSVerificationPage() {
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  useEffect(() => {
    setWelcomeBar({
      title: "Entre mis Cuentas",
      backHref: "/transferencias/internas/entre-mis-cuentas/confirmacion",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    // Check if previous steps were completed
    const confirmationData = sessionStorage.getItem("transferConfirmation");
    if (!confirmationData) {
      router.push("/transferencias/internas/entre-mis-cuentas");
    }
  }, [router]);

  useEffect(() => {
    // Countdown timer for resend
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
        if (resendCountdown === 1) {
          setResendDisabled(false);
        }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setError("");
  };

  const handleResendCode = () => {
    setResendDisabled(true);
    setResendCountdown(60);
    setError("");
    // TODO: API call to resend SMS
  };

  const handlePay = async () => {
    if (code.length !== 6) {
      setError("Por favor ingresa el codigo de 6 digitos");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (code === TRANSFER_MOCK_VALID_CODE) {
        router.push("/transferencias/internas/entre-mis-cuentas/resultado");
      } else {
        setError("Codigo incorrecto. Por favor intenta nuevamente.");
      }
    } catch {
      setError(
        "Error al procesar la transferencia. Por favor intenta nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/transferencias/internas/entre-mis-cuentas/confirmacion");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Breadcrumbs
          items={["Inicio", "Transferencias", "Entre mis Cuentas"]}
        />
      </div>

      {/* Stepper */}
      <div className="bg-white rounded-2xl shadow-sm">
        <Stepper currentStep={3} steps={TRANSFER_STEPS} />
      </div>

      {/* SMS Input Card */}
      <CodeInputCard
        code={code}
        onCodeChange={handleCodeChange}
        hasError={!!error}
        errorMessage={error}
        onResend={handleResendCode}
        resendDisabled={resendDisabled}
        resendCountdown={resendCountdown}
        disabled={isLoading}
      />

      {/* Actions */}
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
          onClick={handlePay}
          disabled={isLoading || code.length !== 6}
        >
          {isLoading ? "Procesando..." : "Pagar"}
        </Button>
      </div>
    </div>
  );
}
