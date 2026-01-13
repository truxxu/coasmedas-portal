"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { CodeInputCard } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import {
  NETWORK_TRANSFER_STEPS,
  MOCK_VALID_CODE,
} from "@/src/mocks/mockNetworkTransferData";

export default function VerificacionPage() {
  const router = useRouter();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setWelcomeBar({
      title: "A Cuentas de mi Red",
      backHref: "/transferencias/internas/cuentas-mi-red/detalle",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    // Check if previous steps were completed
    const recipientData = sessionStorage.getItem("networkTransferRecipient");
    const sourceId = sessionStorage.getItem("networkTransferSourceId");
    const amount = sessionStorage.getItem("networkTransferAmount");

    if (!recipientData || !sourceId || !amount) {
      router.push("/transferencias/internas/cuentas-mi-red");
    }
  }, [router]);

  useEffect(() => {
    // Countdown timer for resend
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (resendCountdown === 0 && isResendDisabled) {
      setIsResendDisabled(false);
    }
  }, [resendCountdown, isResendDisabled]);

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    setError("");
  };

  const handleResendCode = () => {
    setIsResendDisabled(true);
    setResendCountdown(60);
    // TODO: API call to resend SMS
  };

  const handlePay = async () => {
    if (code.length !== 6) {
      setError("Por favor ingresa el código de 6 dígitos");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (code === MOCK_VALID_CODE) {
        router.push("/transferencias/internas/cuentas-mi-red/resultado");
      } else {
        setError("Código incorrecto. Por favor intenta nuevamente.");
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
    router.push("/transferencias/internas/cuentas-mi-red/detalle");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Breadcrumbs
          items={["Inicio", "Transferencias", "A Cuentas de mi Red"]}
        />
      </div>

      {/* Stepper */}
      <div className="bg-white rounded-2xl shadow-sm">
        <Stepper currentStep={3} steps={NETWORK_TRANSFER_STEPS} />
      </div>

      {/* SMS Input Card */}
      <CodeInputCard
        code={code}
        onCodeChange={handleCodeChange}
        onResend={handleResendCode}
        hasError={!!error}
        errorMessage={error}
        resendDisabled={isResendDisabled}
        resendCountdown={resendCountdown}
        disabled={isLoading}
      />

      {/* Footer Actions */}
      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          disabled={isLoading}
          className="text-sm font-medium text-[#004266] hover:underline disabled:opacity-50"
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
