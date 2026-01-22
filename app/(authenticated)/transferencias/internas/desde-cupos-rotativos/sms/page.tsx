"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { CodeInputCard } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import {
  TRANSFER_STEPS,
  CUPO_ROTATIVO_MOCK_VALID_CODE,
  mockCuposRotativos,
  mockCupoRotativoDestinations,
  mockCupoRotativoResultSuccess,
  mockCupoRotativoResultError,
} from "@/src/mocks";
import type { CupoRotativoTransferResult } from "@/src/types";

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
      title: "Desde Cupos Rotativos",
      backHref: "/transferencias/internas/desde-cupos-rotativos/confirmacion",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    // Check if previous steps were completed
    const confirmationData = sessionStorage.getItem("cupoRotativoConfirmation");
    if (!confirmationData) {
      router.push("/transferencias/internas/desde-cupos-rotativos");
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
  };

  const handlePay = async () => {
    if (code.length !== 6) {
      setError("Por favor ingresa el codigo completo.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (code === CUPO_ROTATIVO_MOCK_VALID_CODE) {
        // Build result from stored data
        const cupoId = sessionStorage.getItem("cupoRotativoSelectedCupoId");
        const destinationId = sessionStorage.getItem("cupoRotativoDestinationId");
        const amount = sessionStorage.getItem("cupoRotativoAmount");

        const selectedCupo = mockCuposRotativos.find((c) => c.id === cupoId);
        const selectedDestination = mockCupoRotativoDestinations.find(
          (d) => d.id === destinationId
        );

        const result: CupoRotativoTransferResult = {
          ...mockCupoRotativoResultSuccess,
          sourceAccount: selectedCupo?.name || "Cupo Rotativo Personal",
          destinationAccount: selectedDestination
            ? `${selectedDestination.name} (${selectedDestination.maskedNumber})`
            : "Cuenta de Ahorros",
          amountTransferred: Number(amount) || 0,
        };

        sessionStorage.setItem(
          "cupoRotativoTransferResult",
          JSON.stringify(result)
        );

        router.push("/transferencias/internas/desde-cupos-rotativos/resultado");
      } else {
        setError("El codigo ingresado es incorrecto.");
      }
    } catch {
      // Store error result
      sessionStorage.setItem(
        "cupoRotativoTransferResult",
        JSON.stringify(mockCupoRotativoResultError)
      );
      router.push("/transferencias/internas/desde-cupos-rotativos/resultado");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/transferencias/internas/desde-cupos-rotativos/confirmacion");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Breadcrumbs
          items={["Inicio", "Transferencias", "Desde Cupos Rotativos"]}
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
