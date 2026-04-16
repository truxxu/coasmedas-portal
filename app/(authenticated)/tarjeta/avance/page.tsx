"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { TarjetaAvanceDetailsCard } from "@/src/organisms";
import { useUserContext, useWelcomeBar } from "@/src/contexts";
import {
  TARJETA_AVANCE_STEPS,
  mockTarjetaCreditoProducts,
  mockTarjetaSourceAccounts,
} from "@/src/mocks";
import { maskNumber } from "@/src/utils";

const BREADCRUMBS = ["Inicio", "Tarjeta de Crédito", "Realizar Avance"];

const DOCUMENT_LABEL: Record<string, string> = {
  CC: "C.C.",
  CE: "C.E.",
  NIT: "NIT",
  TI: "T.I.",
  PA: "PA",
};

const VENCIMIENTO_REGEX = /^(0[1-9]|1[0-2])\/\d{2}$/;

function AvanceDetalleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUserContext();
  const { setWelcomeBar, clearWelcomeBar } = useWelcomeBar();

  const cardId = searchParams.get("cardId") ?? "";
  const product = useMemo(
    () => mockTarjetaCreditoProducts.find((p) => p.id === cardId) ?? null,
    [cardId],
  );

  const [destinationAccountId, setDestinationAccountId] = useState("");
  const [cuotas, setCuotas] = useState(0);
  const [valor, setValor] = useState(0);
  const [vencimiento, setVencimiento] = useState("");
  const [cvv, setCvv] = useState("");

  const [destinationError, setDestinationError] = useState("");
  const [cuotasError, setCuotasError] = useState("");
  const [valorError, setValorError] = useState("");
  const [vencimientoError, setVencimientoError] = useState("");
  const [cvvError, setCvvError] = useState("");

  useEffect(() => {
    setWelcomeBar({ title: "Realizar Avance", backHref: "/tarjeta" });
    return () => clearWelcomeBar();
  }, [setWelcomeBar, clearWelcomeBar]);

  useEffect(() => {
    if (!product) {
      router.push("/tarjeta");
    }
  }, [product, router]);

  if (!product) {
    return null;
  }

  const documentDisplay = user?.documentNumber
    ? `${DOCUMENT_LABEL[user.documentType] ?? user.documentType} ${maskNumber(
        user.documentNumber,
        3,
      )}`
    : "-";

  const handleBack = () => {
    router.push("/tarjeta");
  };

  const handleContinue = () => {
    let hasError = false;

    if (!destinationAccountId) {
      setDestinationError("Selecciona una cuenta destino");
      hasError = true;
    } else {
      setDestinationError("");
    }

    if (!vencimiento || !VENCIMIENTO_REGEX.test(vencimiento)) {
      setVencimientoError("Formato inválido (MM/AA)");
      hasError = true;
    } else {
      setVencimientoError("");
    }

    if (cvv.length < 3) {
      setCvvError("CVV inválido");
      hasError = true;
    } else {
      setCvvError("");
    }

    if (!cuotas || cuotas < 1 || cuotas > 36) {
      setCuotasError("Selecciona el número de cuotas");
      hasError = true;
    } else {
      setCuotasError("");
    }

    if (valor <= 0) {
      setValorError("El valor debe ser mayor a 0");
      hasError = true;
    } else if (valor > product.cupoDisponible) {
      setValorError("El valor no puede exceder tu cupo disponible");
      hasError = true;
    } else {
      setValorError("");
    }

    if (hasError) return;

    const account = mockTarjetaSourceAccounts.find(
      (a) => a.id === destinationAccountId,
    );
    if (!account) {
      setDestinationError("Cuenta destino no válida");
      return;
    }

    sessionStorage.setItem("tarjetaAvanceCardId", product.id);
    sessionStorage.setItem("tarjetaAvanceProduct", JSON.stringify(product));
    sessionStorage.setItem("tarjetaAvanceValor", String(valor));
    sessionStorage.setItem("tarjetaAvanceCuotas", String(cuotas));
    sessionStorage.setItem("tarjetaAvanceDestinationId", account.id);
    sessionStorage.setItem(
      "tarjetaAvanceDestinationDisplay",
      `${account.displayName} (${account.maskedNumber})`,
    );

    router.push("/tarjeta/avance/confirmacion");
  };

  return (
    <div className="space-y-6">
      <Breadcrumbs items={BREADCRUMBS} />

      <div className="-mx-8 bg-white shadow-sm">
        <Stepper currentStep={1} steps={TARJETA_AVANCE_STEPS} />
      </div>

      <TarjetaAvanceDetailsCard
        product={product}
        destinationAccounts={mockTarjetaSourceAccounts}
        destinationAccountId={destinationAccountId}
        cuotas={cuotas}
        valor={valor}
        vencimiento={vencimiento}
        cvv={cvv}
        documentDisplay={documentDisplay}
        destinationError={destinationError}
        cuotasError={cuotasError}
        valorError={valorError}
        vencimientoError={vencimientoError}
        cvvError={cvvError}
        onDestinationAccountChange={(id) => {
          setDestinationAccountId(id);
          setDestinationError("");
        }}
        onCuotasChange={(c) => {
          setCuotas(c);
          setCuotasError("");
        }}
        onValorChange={(v) => {
          setValor(v);
          setValorError("");
        }}
        onVencimientoChange={(v) => {
          setVencimiento(v);
          setVencimientoError("");
        }}
        onCvvChange={(v) => {
          setCvv(v);
          setCvvError("");
        }}
      />

      <div className="flex justify-between items-center">
        <button
          onClick={handleBack}
          className="text-sm font-medium text-brand-navy hover:underline"
        >
          Volver
        </button>
        <Button variant="primary" onClick={handleContinue}>
          Confirmar
        </Button>
      </div>
    </div>
  );
}

export default function AvanceDetallePage() {
  return (
    <Suspense fallback={null}>
      <AvanceDetalleContent />
    </Suspense>
  );
}
