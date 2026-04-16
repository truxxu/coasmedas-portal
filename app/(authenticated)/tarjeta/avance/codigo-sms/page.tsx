"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { CodeInputCard } from "@/src/organisms";
import { useUserContext, useWelcomeBar } from "@/src/contexts";
import { useSMSCodeVerification } from "@/src/hooks";
import {
  TarjetaAvanceConfirmationData,
  TarjetaAvanceResult,
} from "@/src/types/tarjeta-avance";
import { TARJETA_AVANCE_STEPS } from "@/src/mocks";
import { sendTransactionOtp } from "@/services/auth.service";

const BREADCRUMBS = ["Inicio", "Tarjeta de Crédito", "Realizar Avance"];

function formatNowDate(): string {
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
}

function formatNowTime(): string {
  return new Intl.DateTimeFormat("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date());
}

function generateApprovalNumber(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default function AvanceCodigoSmsPage() {
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
    sessionKey: "tarjetaAvanceConfirmation",
    fallbackPath: "/tarjeta/avance",
    successPath: "/tarjeta/avance/resultado",
    // TODO: replace mock with real service once the tarjeta avance endpoint
    // is available.
    onSubmit: async () => {
      const confirmationStr = sessionStorage.getItem(
        "tarjetaAvanceConfirmation",
      );
      if (!confirmationStr) {
        throw new Error("Datos de transacción no encontrados");
      }
      const confirmation: TarjetaAvanceConfirmationData =
        JSON.parse(confirmationStr);

      await new Promise((resolve) => setTimeout(resolve, 800));

      const result: TarjetaAvanceResult = {
        status: "success",
        destinationAccount: confirmation.destinationAccount,
        valorAbonado: confirmation.valorAvance,
        cupoDisponibleActualizado: confirmation.cupoRestante,
        fechaTransaccion: formatNowDate(),
        horaTransaccion: formatNowTime(),
        numeroAprobacion: generateApprovalNumber(),
        direccionIp: "192.168.1.2",
        descripcion: "Exitosa",
      };
      sessionStorage.setItem("tarjetaAvanceResult", JSON.stringify(result));
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
      title: "Realizar Avance",
      backHref: "/tarjeta/avance/confirmacion",
    });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  const handleBack = () => {
    router.push("/tarjeta/avance/confirmacion");
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={BREADCRUMBS} />

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={3} steps={TARJETA_AVANCE_STEPS} />
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
          {isLoading ? "Procesando..." : "Confirmar"}
        </Button>
      </div>
    </div>
  );
}
