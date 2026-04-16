"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/src/atoms";
import { Breadcrumbs, Stepper } from "@/src/molecules";
import { TarjetaAvanceDetailsCard } from "@/src/organisms";
import { useUserContext, useWelcomeBar } from "@/src/contexts";
import {
  TarjetaAvanceFormData,
  TarjetaAvanceFormErrors,
} from "@/src/types/tarjeta-avance";
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

const INITIAL_VALUES: TarjetaAvanceFormData = {
  destinationAccountId: "",
  cuotas: 0,
  valor: 0,
  vencimiento: "",
  cvv: "",
};

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

  const [values, setValues] = useState<TarjetaAvanceFormData>(INITIAL_VALUES);
  const [errors, setErrors] = useState<TarjetaAvanceFormErrors>({});

  const handleChange = (patch: Partial<TarjetaAvanceFormData>) => {
    setValues((prev) => ({ ...prev, ...patch }));
    setErrors((prev) => {
      const next = { ...prev };
      for (const key of Object.keys(patch) as (keyof TarjetaAvanceFormData)[]) {
        delete next[key];
      }
      return next;
    });
  };

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
    const nextErrors: TarjetaAvanceFormErrors = {};

    if (!values.destinationAccountId) {
      nextErrors.destinationAccountId = "Selecciona una cuenta destino";
    }
    if (!values.vencimiento || !VENCIMIENTO_REGEX.test(values.vencimiento)) {
      nextErrors.vencimiento = "Formato inválido (MM/AA)";
    }
    if (values.cvv.length < 3) {
      nextErrors.cvv = "CVV inválido";
    }
    if (!values.cuotas || values.cuotas < 1 || values.cuotas > 36) {
      nextErrors.cuotas = "Selecciona el número de cuotas";
    }
    if (values.valor <= 0) {
      nextErrors.valor = "El valor debe ser mayor a 0";
    } else if (values.valor > product.cupoDisponible) {
      nextErrors.valor = "El valor no puede exceder tu cupo disponible";
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const account = mockTarjetaSourceAccounts.find(
      (a) => a.id === values.destinationAccountId,
    );
    if (!account) {
      setErrors({ destinationAccountId: "Cuenta destino no válida" });
      return;
    }

    sessionStorage.setItem("tarjetaAvanceCardId", product.id);
    sessionStorage.setItem("tarjetaAvanceProduct", JSON.stringify(product));
    sessionStorage.setItem("tarjetaAvanceValor", String(values.valor));
    sessionStorage.setItem("tarjetaAvanceCuotas", String(values.cuotas));
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
        documentDisplay={documentDisplay}
        values={values}
        errors={errors}
        onChange={handleChange}
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
