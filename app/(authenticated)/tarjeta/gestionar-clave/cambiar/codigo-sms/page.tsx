"use client";

import React from "react";
import { TarjetaSmsCodePage } from "@/src/organisms";
import {
  TarjetaClaveConfirmationData,
  TarjetaClaveResult,
} from "@/src/types/tarjeta-clave";
import { TARJETA_CLAVE_STEPS } from "@/src/mocks";

export default function CambiarCodigoSmsPage() {
  return (
    <TarjetaSmsCodePage<TarjetaClaveConfirmationData, TarjetaClaveResult>
      sessionKey="tarjetaClaveCambiarConfirmation"
      resultKey="tarjetaClaveCambiarResult"
      fallbackPath="/tarjeta/gestionar-clave/cambiar"
      successPath="/tarjeta/gestionar-clave/cambiar/resultado"
      confirmationPath="/tarjeta/gestionar-clave/cambiar/confirmacion"
      breadcrumbs={["Inicio", "Gestionar Clave", "Cambiar Clave"]}
      welcomeBarTitle="Cambiar Clave"
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
