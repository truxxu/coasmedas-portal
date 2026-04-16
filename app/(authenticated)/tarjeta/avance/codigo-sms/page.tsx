"use client";

import React from "react";
import { TarjetaSmsCodePage } from "@/src/organisms";
import {
  TarjetaAvanceConfirmationData,
  TarjetaAvanceResult,
} from "@/src/types/tarjeta-avance";
import { TARJETA_AVANCE_STEPS } from "@/src/mocks";

export default function AvanceCodigoSmsPage() {
  return (
    <TarjetaSmsCodePage<TarjetaAvanceConfirmationData, TarjetaAvanceResult>
      sessionKey="tarjetaAvanceConfirmation"
      resultKey="tarjetaAvanceResult"
      fallbackPath="/tarjeta/avance"
      successPath="/tarjeta/avance/resultado"
      confirmationPath="/tarjeta/avance/confirmacion"
      breadcrumbs={["Inicio", "Tarjeta de Crédito", "Realizar Avance"]}
      welcomeBarTitle="Realizar Avance"
      steps={TARJETA_AVANCE_STEPS}
      submitLabel="Confirmar"
      buildResult={(confirmation, meta) => ({
        status: "success",
        destinationAccount: confirmation.destinationAccount,
        valorAbonado: confirmation.valorAvance,
        cupoDisponibleActualizado: confirmation.cupoRestante,
        ...meta,
      })}
    />
  );
}
