"use client";

import React from "react";
import { TarjetaSmsCodePage } from "@/src/organisms";
import {
  TarjetaClaveConfirmationData,
  TarjetaClaveResult,
} from "@/src/types/tarjeta-clave";
import { TARJETA_CLAVE_STEPS } from "@/src/mocks";

export default function OlvideCodigoSmsPage() {
  return (
    <TarjetaSmsCodePage<TarjetaClaveConfirmationData, TarjetaClaveResult>
      sessionKey="tarjetaClaveOlvideConfirmation"
      resultKey="tarjetaClaveOlvideResult"
      fallbackPath="/tarjeta/gestionar-clave/olvide"
      successPath="/tarjeta/gestionar-clave/olvide/resultado"
      confirmationPath="/tarjeta/gestionar-clave/olvide/confirmacion"
      breadcrumbs={["Inicio", "Gestionar Clave", "Olvidé mi Clave"]}
      welcomeBarTitle="Olvidé mi Clave"
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
