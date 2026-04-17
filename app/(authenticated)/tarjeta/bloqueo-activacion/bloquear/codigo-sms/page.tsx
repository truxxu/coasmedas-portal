"use client";

import React from "react";
import { TarjetaSmsCodePage } from "@/src/organisms";
import {
  TarjetaBloqueoConfirmationData,
  TarjetaBloqueoResult,
} from "@/src/types/tarjeta-bloqueo";
import { TARJETA_BLOQUEO_STEPS } from "@/src/mocks";

export default function BloquearCodigoSmsPage() {
  return (
    <TarjetaSmsCodePage<TarjetaBloqueoConfirmationData, TarjetaBloqueoResult>
      sessionKey="tarjetaBloqueoConfirmation"
      resultKey="tarjetaBloqueoResult"
      fallbackPath="/tarjeta/bloqueo-activacion/bloquear"
      successPath="/tarjeta/bloqueo-activacion/bloquear/resultado"
      confirmationPath="/tarjeta/bloqueo-activacion/bloquear/confirmacion"
      breadcrumbs={["Inicio", "Tarjeta de Crédito", "Bloqueo y Activación"]}
      welcomeBarTitle="Bloqueo y Activación"
      steps={TARJETA_BLOQUEO_STEPS}
      submitLabel="Confirmar"
      buildResult={(confirmation, meta) => ({
        status: "success",
        cardDisplay: confirmation.cardDisplay,
        ...meta,
      })}
    />
  );
}
