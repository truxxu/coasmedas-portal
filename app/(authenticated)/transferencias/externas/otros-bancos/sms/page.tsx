"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { CodeInputCard } from "@/src/organisms";
import { useWelcomeBar } from "@/src/contexts";
import {
  EXTERNAL_TRANSFER_STEPS,
  EXTERNAL_TRANSFER_MOCK_VALID_CODE,
  mockExternalTransferSourceAccounts,
  mockExternalTransferDestinations,
} from "@/src/mocks";
import type { ExternalTransferResult } from "@/src/types/externalTransfer";

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
      title: "A Otros Bancos",
      backHref: "/transferencias/externas/otros-bancos/confirmacion",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    // Check if previous steps were completed
    const confirmationData = sessionStorage.getItem(
      "externalTransferConfirmation",
    );
    if (!confirmationData) {
      router.push("/transferencias/externas/otros-bancos");
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

  const generateTransactionResult = (
    success: boolean,
  ): ExternalTransferResult => {
    const sourceId = sessionStorage.getItem("externalTransferSourceId");
    const destinationId = sessionStorage.getItem(
      "externalTransferDestinationId",
    );
    const amount = sessionStorage.getItem("externalTransferAmount");
    const concept = sessionStorage.getItem("externalTransferConcept");

    const sourceAccount = mockExternalTransferSourceAccounts.find(
      (acc) => acc.id === sourceId,
    );
    const destination = mockExternalTransferDestinations.find(
      (acc) => acc.id === destinationId,
    );

    const now = new Date();
    const dateOptions: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    if (success) {
      return {
        status: "success",
        sourceAccount: sourceAccount?.type || "Cuenta de Ahorros",
        destinationBank: destination?.bankName || "",
        destinationAccountNumber: destination?.accountNumber || "",
        amountTransferred: Number(amount) || 0,
        concept: concept || "",
        transactionCost: 0,
        transactionDate: now.toLocaleDateString("es-CO", dateOptions),
        transactionTime: now.toLocaleTimeString("es-CO", timeOptions),
        approvalNumber: Math.floor(100000 + Math.random() * 900000).toString(),
        description: "Transferencia Exitosa",
      };
    } else {
      return {
        status: "error",
        sourceAccount: sourceAccount?.type || "Cuenta de Ahorros",
        destinationBank: destination?.bankName || "",
        destinationAccountNumber: destination?.accountNumber || "",
        amountTransferred: 0,
        concept: concept || "",
        transactionCost: 0,
        transactionDate: now.toLocaleDateString("es-CO", dateOptions),
        transactionTime: now.toLocaleTimeString("es-CO", timeOptions),
        approvalNumber: "-",
        description: "Transaccion Fallida",
        errorMessage: "Codigo de verificacion incorrecto",
      };
    }
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

      if (code === EXTERNAL_TRANSFER_MOCK_VALID_CODE) {
        // Generate success result
        const result = generateTransactionResult(true);
        sessionStorage.setItem(
          "externalTransferResult",
          JSON.stringify(result),
        );
        router.push("/transferencias/externas/otros-bancos/resultado");
      } else {
        setError("Codigo incorrecto. Por favor intenta nuevamente.");
      }
    } catch {
      setError(
        "Error al procesar la transferencia. Por favor intenta nuevamente.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.push("/transferencias/externas/otros-bancos/confirmacion");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Breadcrumbs items={["Inicio", "Transferencias", "A Otros Bancos"]} />
      </div>

      {/* Stepper */}
      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={3} steps={EXTERNAL_TRANSFER_STEPS} />
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
          {isLoading ? "Procesando..." : "Transferir"}
        </Button>
      </div>
    </div>
  );
}
