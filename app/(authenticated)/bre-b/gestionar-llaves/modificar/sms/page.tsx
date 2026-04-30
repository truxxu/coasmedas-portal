"use client";

import { TarjetaSmsCodePage } from "@/src/organisms/TarjetaSmsCodePage";
import { BREB_KEY_MODIFICATION_STEPS } from "@/src/mocks";
import type {
  BrebKeyModificationConfirmationData,
  BrebKeyModificationResult,
} from "@/src/types/brebKeyModification";
import { BREB_SESSION_KEYS } from "@/src/constants/brebSessionKeys";

export default function ModificarLlaveSmsPage() {
  return (
    <TarjetaSmsCodePage<
      BrebKeyModificationConfirmationData,
      BrebKeyModificationResult
    >
      sessionKey={BREB_SESSION_KEYS.keyModification.confirmation}
      resultKey={BREB_SESSION_KEYS.keyModification.result}
      fallbackPath="/bre-b/gestionar-llaves/modificar"
      successPath="/bre-b/gestionar-llaves/modificar/resultado"
      confirmationPath="/bre-b/gestionar-llaves/modificar/confirmacion"
      breadcrumbs={["Inicio", "Bre-B", "Modificar Llave"]}
      welcomeBarTitle="Modificar Llave"
      steps={BREB_KEY_MODIFICATION_STEPS}
      submitLabel="Continuar"
      buildResult={(confirmation) => ({
        success: true,
        newKeyTypeLabel: confirmation.newKeyTypeLabel,
        newKeyValue: confirmation.newKeyValue,
        accountLabel: confirmation.accountLabel,
      })}
    />
  );
}
