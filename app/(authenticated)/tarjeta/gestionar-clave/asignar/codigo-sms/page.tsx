"use client";

import React from "react";
import { TarjetaSmsCodePage } from "@/src/organisms";
import {
  TarjetaClaveConfirmationData,
  TarjetaClaveResult,
} from "@/src/types/tarjeta-clave";
import { TARJETA_CLAVE_STEPS } from "@/src/mocks";

export default function AsignarCodigoSmsPage() {
  return (
    <TarjetaSmsCodePage<TarjetaClaveConfirmationData, TarjetaClaveResult>
      sessionKey="tarjetaClaveAsignarConfirmation"
      resultKey="tarjetaClaveAsignarResult"
      fallbackPath="/tarjeta/gestionar-clave/asignar"
      successPath="/tarjeta/gestionar-clave/asignar/resultado"
      confirmationPath="/tarjeta/gestionar-clave/asignar/confirmacion"
      breadcrumbs={["Inicio", "Gestionar Clave", "Asignar Clave"]}
      welcomeBarTitle="Asignar Clave"
      steps={TARJETA_CLAVE_STEPS}
      submitLabel="Confirmar"
      buildResult={(confirmation, meta) => ({
        status: "success",
        cardDisplay: confirmation.cardDisplay,
        ...meta,
      })}
    />
  );
}
