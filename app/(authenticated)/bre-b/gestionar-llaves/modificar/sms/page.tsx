"use client";

import { TarjetaSmsCodePage } from "@/src/organisms/TarjetaSmsCodePage";
import { useUserContext } from "@/src/contexts";
import { updateBrebKey } from "@/services";
import { buildBrebDeviceContext, mapUiKeyTypeToApi } from "@/src/utils";
import { ApiError } from "@/lib/api/errors";
import { BREB_KEY_MODIFICATION_STEPS } from "@/src/mocks";
import type {
  BrebKeyModificationConfirmationData,
  BrebKeyModificationResult,
} from "@/src/types/brebKeyModification";
import type { UpdateBrebKeyRequest } from "@/types/api/breb";
import { BREB_SESSION_KEYS } from "@/src/constants/brebSessionKeys";

const SUCCESS_STATE_CODE = "U000";

export default function ModificarLlaveSmsPage() {
  const { user } = useUserContext();

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
      onVerify={async (confirmation) => {
        if (!user) {
          throw new Error("Sesión no válida. Inicie sesión nuevamente.");
        }
        const ctx = buildBrebDeviceContext(user);
        const req: UpdateBrebKeyRequest = {
          ...ctx,
          idKeyCustomer: confirmation.idKeyCustomer,
          typeKeyCustomer: mapUiKeyTypeToApi(confirmation.newKeyType),
          valueKeyCustomer: confirmation.newKeyValue,
          sourceNumberAccount: confirmation.sourceNumberAccount,
          sourceTypeAccount: confirmation.sourceTypeAccount,
          sourceSubTypeAccount: confirmation.sourceSubTypeAccount,
          sourceTypeAccountDescription:
            confirmation.sourceTypeAccountDescription,
          firstName: user.firstName,
          surName: user.lastName,
        };
        console.log(req);
        const res = await updateBrebKey(req);
        if (res.stateCode !== SUCCESS_STATE_CODE) {
          throw new ApiError(
            -1,
            res.stateDescriptionSystem ??
              "No se pudo modificar la llave. Intente nuevamente.",
          );
        }
      }}
      buildResult={(confirmation) => ({
        success: true,
        newKeyTypeLabel: confirmation.newKeyTypeLabel,
        newKeyValue: confirmation.newKeyValue,
        accountLabel: confirmation.accountLabel,
      })}
    />
  );
}
