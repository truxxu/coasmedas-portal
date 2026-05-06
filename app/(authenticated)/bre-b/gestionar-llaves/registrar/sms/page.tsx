"use client";

import { TarjetaSmsCodePage } from "@/src/organisms/TarjetaSmsCodePage";
import { useUserContext } from "@/src/contexts";
import { createBrebKey } from "@/services";
import { buildBrebDeviceContext, mapUiKeyTypeToApi } from "@/src/utils";
import { ApiError } from "@/lib/api/errors";
import { BREB_KEY_REGISTRATION_STEPS } from "@/src/mocks";
import type {
  BrebKeyRegistrationConfirmationData,
  BrebKeyRegistrationResult,
} from "@/src/types/brebKeyRegistration";
import type { CreateBrebKeyRequest } from "@/types/api/breb";
import {
  BREB_KEY_SUCCESS_STATE_CODE,
  BREB_SESSION_KEYS,
} from "@/src/constants/brebSessionKeys";

export default function RegistrarLlaveSmsPage() {
  const { user } = useUserContext();

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
      onVerify={async (confirmation) => {
        if (!user) {
          throw new Error("Sesión no válida. Inicie sesión nuevamente.");
        }
        const ctx = buildBrebDeviceContext(user);
        const req: CreateBrebKeyRequest = {
          ...ctx,
          typeKeyCustomer: mapUiKeyTypeToApi(confirmation.keyType),
          valueKeyCustomer: confirmation.keyValue,
          sourceNumberAccount: confirmation.sourceNumberAccount,
          sourceTypeAccount: confirmation.sourceTypeAccount,
          sourceSubTypeAccount: confirmation.sourceSubTypeAccount,
          sourceTypeAccountDescription:
            confirmation.sourceTypeAccountDescription,
          firstName: user.firstName,
          surName: user.lastName,
        };
        const res = await createBrebKey(req);
        if (res.stateCode !== BREB_KEY_SUCCESS_STATE_CODE) {
          throw new ApiError(
            -1,
            res.stateDescriptionSystem ??
              "No se pudo registrar la llave. Intente nuevamente.",
          );
        }
      }}
      buildResult={(confirmation) => ({
        success: true,
        keyValue: confirmation.keyValue,
        keyTypeLabel: confirmation.keyTypeLabel,
        accountLabel: confirmation.accountLabel,
      })}
    />
  );
}
