"use client";

import { TarjetaSmsCodePage } from "@/src/organisms/TarjetaSmsCodePage";
import { BREB_KEY_REGISTRATION_STEPS } from "@/src/mocks";
import type {
  BrebKeyRegistrationConfirmationData,
  BrebKeyRegistrationResult,
} from "@/src/types/brebKeyRegistration";
import { BREB_SESSION_KEYS } from "@/src/constants/brebSessionKeys";

export default function RegistrarLlaveSmsPage() {
  return (
    <TarjetaSmsCodePage<
      BrebKeyRegistrationConfirmationData,
      BrebKeyRegistrationResult
    >
      sessionKey={BREB_SESSION_KEYS.keyRegistration.confirmation}
      resultKey={BREB_SESSION_KEYS.keyRegistration.result}
      fallbackPath="/bre-b/gestionar-llaves/registrar"
      successPath="/bre-b/gestionar-llaves/registrar/resultado"
      confirmationPath="/bre-b/gestionar-llaves/registrar/confirmacion"
      breadcrumbs={["Inicio", "Gestión Llaves", "Registrar Llave"]}
      welcomeBarTitle="Registrar Llave"
      steps={BREB_KEY_REGISTRATION_STEPS}
      submitLabel="Continuar"
      buildResult={(confirmation) => ({
        success: true,
        keyValue: confirmation.keyValue,
        keyTypeLabel: confirmation.keyTypeLabel,
        accountLabel: confirmation.accountLabel,
      })}
    />
  );
}
