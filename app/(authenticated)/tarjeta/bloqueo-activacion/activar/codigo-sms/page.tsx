"use client";

import React from "react";
import { TarjetaSmsCodePage } from "@/src/organisms";
import {
  TarjetaActivacionConfirmationData,
  TarjetaActivacionResult,
} from "@/src/types/tarjeta-activacion";
import { TARJETA_ACTIVACION_STEPS } from "@/src/mocks";

export default function ActivarCodigoSmsPage() {
  return (
    <TarjetaSmsCodePage<
      TarjetaActivacionConfirmationData,
      TarjetaActivacionResult
    >
      sessionKey="tarjetaActivacionConfirmation"
      resultKey="tarjetaActivacionResult"
      fallbackPath="/tarjeta/bloqueo-activacion/activar"
      successPath="/tarjeta/bloqueo-activacion/activar/resultado"
      confirmationPath="/tarjeta/bloqueo-activacion/activar/confirmacion"
      breadcrumbs={["Inicio", "Tarjeta de Crédito", "Bloqueo y Activación"]}
      welcomeBarTitle="Bloqueo y Activación"
      steps={TARJETA_ACTIVACION_STEPS}
      submitLabel="Confirmar"
      buildResult={(confirmation, meta) => ({
        status: "success",
        cardDisplay: confirmation.cardDisplay,
        ...meta,
      })}
    />
  );
}
